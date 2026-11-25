import { ArrowLeft, ArrowRight, CircleDollarSign, Package, Sparkles, Tags, Truck } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import type { Marketplace, Product } from './demo'
import { feeAssumptions, intelligencePath, marketplaces, priceEstimate, pricingPath, strategies, strategyKeys, strategyPrices, validPrice } from './marketDemo'
import type { PricingPlan } from './marketDemo'
import { MarketJourney, MarketNotice, MarketProduct } from './MarketUI'
import { productMoney } from './productWorkflow'
import { MarketLogo } from './ui'
import { listingRoute, useListingDemo } from './listingDemo'

export function PricingStudio({ product, products, plan, onChange }: { product: Product; products: Product[]; plan: PricingPlan; onChange: (plan: PricingPlan) => void }) {
  const navigate = useNavigate()
  const { prepareListing } = useListingDemo()
  const [costMarket, setCostMarket] = useState<Marketplace>(() => plan.marketplaces[0] ?? 'Etsy')
  const currency = product.profile?.currency || 'USD'
  const format = (value: number | null) => value === null ? '—' : productMoney(value, product)
  const estimate = (marketplace: Marketplace) => priceEstimate(product, marketplace, validPrice(plan.prices[marketplace]) ? Number(plan.prices[marketplace]) : null)
  const breakdown = estimate(costMarket)
  const canContinue = plan.marketplaces.length > 0 && plan.marketplaces.every((marketplace) => validPrice(plan.prices[marketplace]))
  const inputs = [
    { label: 'Expected selling price', value: product.price, icon: Tags, color: 'violet', provided: true },
    { label: 'Manufacturing cost', value: product.cost, icon: Package, color: 'blue', provided: true },
    { label: 'Packaging cost', value: Number(product.profile?.packaging || 0), icon: CircleDollarSign, color: 'amber', provided: !!product.profile?.packaging },
    { label: 'Shipping cost', value: Number(product.profile?.shipping || 0), icon: Truck, color: 'green', provided: !!product.profile?.shipping },
  ]

  return <div className="market-page">
    <MarketJourney product={product} />
    <div className="page-heading market-page-heading">
      <div><h1>Pricing Studio</h1><p>Compare strategies and see how price changes affect your estimated profit.</p></div>
      <Link className="button button-secondary" to={intelligencePath(product)}><ArrowLeft size={16} /> Market Intelligence</Link>
    </div>
    <MarketNotice>Prices and fees are illustrative. Calculations use {currency} per unit and exclude taxes, advertising, and refunds.
      {currency !== 'USD' && ' Strategy amounts are used as example amounts in your product currency without currency conversion.'}</MarketNotice>
    <MarketProduct product={product} products={products} route={pricingPath} />
    <div className="market-stat-grid market-section">
      {inputs.map(({ label, value, icon: Icon, color, provided }) => <article className="card metric market-stat" key={label}>
        <div className="metric-top"><span>{label}</span><span className={`metric-icon icon-${color}`}><Icon size={17} /></span></div>
        <strong>{format(value)}</strong><small>{provided ? 'Seller-provided' : 'Assumed zero'} · per unit</small>
      </article>)}
    </div>
    <fieldset className="market-section pricing-strategies">
      <legend>Choose a pricing strategy</legend>
      <p>Picking a different strategy loads its example prices. You can edit either price below.</p>
      <div className="strategy-grid">
        {strategyKeys.map((key) => <label className="card strategy-card" key={key}>
          <div><input type="radio" name="pricing-strategy" checked={key === plan.strategy} onChange={() => onChange({ ...plan, strategy: key, prices: strategyPrices(key) })} />
            <strong>{strategies[key].label}</strong></div>
          <p>{strategies[key].description}</p>
          <div className="strategy-quotes"><span>Etsy <strong>{format(strategies[key].prices.Etsy)}</strong></span><span>eBay <strong>{format(strategies[key].prices.eBay)}</strong></span></div>
        </label>)}
      </div>
    </fieldset>
    <section className="market-section" aria-labelledby="market-prices">
      <div className="market-section-heading"><div><h2 id="market-prices">Marketplace prices</h2><p>Edit selling prices and select which marketplaces to carry forward.</p></div></div>
      <div className="market-two-columns">
        {marketplaces.map((marketplace) => {
          const result = estimate(marketplace)
          const fee = feeAssumptions[marketplace]
          const invalid = !validPrice(plan.prices[marketplace])
          const included = plan.marketplaces.includes(marketplace)
          return <section className="card market-panel price-card" aria-label={marketplace + ' pricing'} key={marketplace}>
            <div className="pricing-market-head"><div className="market-icon-title"><MarketLogo name={marketplace} /><div><h3>{marketplace}</h3>
              <p>Demo fee: {Math.round(fee.rate * 100)}% + {format(fee.flat)} per unit</p></div></div>
              <label className="compare-control"><input type="checkbox" aria-label={'Include ' + marketplace + ' in listings'} checked={included} onChange={() => onChange({
                ...plan, marketplaces: included ? plan.marketplaces.filter((item) => item !== marketplace) : [...plan.marketplaces, marketplace],
              })} /> Include in listings</label>
            </div>
            <div className="pricing-inputs">
              <div><span>Recommended price</span><strong>{format(strategies[plan.strategy].prices[marketplace])}</strong></div>
              <label>Editable selling price ({currency})<input type="number" inputMode="decimal" min=".01" max="999999" step=".01" aria-label={marketplace + ' selling price'} aria-invalid={invalid}
                value={plan.prices[marketplace]} onChange={(event) => onChange({ ...plan, prices: { ...plan.prices, [marketplace]: event.target.value } })} /></label>
            </div>
            {invalid && <p className="field-error">Enter a price from 0.01 to 999,999 with up to two decimal places.</p>}
            <dl className="price-values">
              <div><dt>Total estimated expenses</dt><dd>{format(result.total)}</dd></div>
              <div><dt>Break-even price</dt><dd>{format(result.breakEven)}</dd></div>
              <div className={result.profit !== null && result.profit < 0 ? 'price-loss' : 'price-profit'}><dt>Estimated profit</dt><dd>{format(result.profit)}</dd></div>
              <div className={result.margin !== null && result.margin < 0 ? 'price-loss' : 'price-profit'}><dt>Estimated profit margin</dt><dd>{result.margin === null ? '—' : result.margin.toFixed(1) + '%'}</dd></div>
            </dl>
          </section>
        })}
      </div>
    </section>
    <div className="market-two-columns market-section">
      <section className="card market-panel">
        <div className="market-section-heading"><div><h2>Cost breakdown</h2><p>Estimated expenses per unit for {costMarket}.</p></div>
          <div className="market-tabs cost-tabs" role="group" aria-label="Cost breakdown marketplace">
            {marketplaces.map((marketplace) => <button type="button" key={marketplace} aria-pressed={marketplace === costMarket} onClick={() => setCostMarket(marketplace)}>{marketplace}</button>)}
          </div>
        </div>
        <div className="cost-breakdown">
          <div className="cost-chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart accessibilityLayer={false}>
                <Pie data={breakdown.costs.filter((item) => item.value > 0)} dataKey="value" nameKey="label" innerRadius={41} outerRadius={59} stroke="none" paddingAngle={2} isAnimationActive={false}>
                  {breakdown.costs.filter((item) => item.value > 0).map((item) => <Cell key={item.label} fill={item.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div><strong>{format(breakdown.total)}</strong><span>Total cost</span></div>
          </div>
          <ul className="sentiment-legend">
            {breakdown.costs.map((item) => <li key={item.label}><i style={{ background: item.color }} />{item.label}<strong>{format(item.value)}</strong></li>)}
          </ul>
        </div>
        {breakdown.total === null && <p className="market-panel-note">Enter a valid selling price to include the marketplace fee.</p>}
      </section>
      <section className="card market-panel pricing-rationale">
        <div className="market-section-heading"><div className="market-icon-title"><span className="metric-icon icon-violet"><Sparkles size={17} /></span>
          <div><h2>Why these sample prices</h2><p>{strategies[plan.strategy].label} · illustrative recommendation</p></div></div></div>
        <p>{strategies[plan.strategy].description} The demo positions Etsy slightly higher than eBay because its comparable listings have a higher average asking price.</p>
        <dl className="market-insights-list">
          <div><dt>Estimated profit</dt><dd>Selling price minus manufacturing, packaging, shipping, other expenses, and the illustrative marketplace fee.</dd></div>
          <div><dt>Profit margin</dt><dd>Estimated profit divided by selling price. Break-even solves for a selling price that covers the same expenses and fees.</dd></div>
        </dl>
      </section>
    </div>
    <div className="card research-action"><div><h2>Create marketplace listing drafts</h2>
      <p>{canContinue ? 'Carry these marketplace prices into the listing editor.' : 'Select at least one marketplace and enter a valid price for each selected marketplace.'}</p></div>
      <button className="button button-primary" type="button" disabled={!canContinue} onClick={() => {
        onChange(plan)
        prepareListing(product, plan)
        navigate(listingRoute(product))
      }}>Generate Listings <ArrowRight size={16} /></button>
    </div>
  </div>
}
