import { ArrowLeft, ArrowRight, ChartNoAxesCombined, CircleDollarSign, Layers3, PackageCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { money } from './demo'
import type { Product } from './demo'
import { comparables, listPriceRange, marketStats, pricingPath } from './marketDemo'
import { ClosestComparables } from './MarketplaceResearch'
import { MarketJourney, MarketNotice, MarketProduct } from './MarketUI'
import { researchPath } from './productWorkflow'
import { MarketLogo } from './ui'

const marketColors = ['#2563eb', '#7c3aed']
const sentiment = [
  { name: 'Positive', value: 35, color: '#059669' },
  { name: 'Neutral', value: 9, color: '#94a3b8' },
  { name: 'Negative', value: 6, color: '#d97706' },
]
const sentimentTotal = sentiment.reduce((sum, item) => sum + item.value, 0)
const recommendations = [
  ['Product improvements', 'Inspect the base and edges for rough spots. Add exact dimensions and a photo showing scale.'],
  ['Suitable marketplace', 'Start with Etsy in this demo. Its sample listings show a higher average asking price for handmade décor.'],
  ['Potential customers', 'Gift buyers, home décor shoppers, and collectors of small animal figurines.'],
  ['Pricing opportunity', 'Test $26.99 on Etsy and $23.99 on eBay in the balanced USD scenario. Check costs and shipping first.'],
  ['Product presentation', 'Lead with a well-lit three-quarter view. Add grain, carving detail, and a packaging photo.'],
]

export function MarketIntelligence({ product }: { product: Product }) {
  const metrics = [
    { label: 'Average Etsy listed price', value: money(marketStats[0].average), text: '4 fictional Etsy listings', icon: CircleDollarSign, color: 'blue' },
    { label: 'Average eBay listed price', value: money(marketStats[1].average), text: '4 fictional eBay listings', icon: CircleDollarSign, color: 'violet' },
    { label: 'Competitive price range', value: money(listPriceRange[0]) + '–' + money(listPriceRange[1]), text: 'Listed prices in USD', icon: ChartNoAxesCombined, color: 'green' },
    { label: 'Comparable products', value: comparables.length, text: 'Across both marketplaces', icon: Layers3, color: 'amber' },
  ]

  return <div className="market-page">
    <MarketJourney product={product} />
    <div className="page-heading market-page-heading">
      <div><h1>Market Intelligence</h1><p>Turn example listings and feedback into decisions you can explore in the demo.</p></div>
      <Link className="button button-primary" to={pricingPath(product)}>Get Pricing Recommendations <ArrowRight size={16} /></Link>
    </div>
    <MarketNotice>Listed prices are asking prices. Confirmed sale prices are unavailable in this demo. Demand, sentiment, and competitor signals are fictional.</MarketNotice>
    <MarketProduct product={product} />
    <section className="market-section" aria-labelledby="market-overview">
      <div className="market-section-heading"><div><h2 id="market-overview">Market overview</h2><p>Fictional wooden-elephant listings · USD · shipping excluded</p></div></div>
      <div className="market-stat-grid">
        {metrics.map(({ label, value, text, icon: Icon, color }) => <article className="card metric market-stat" key={label}>
          <div className="metric-top"><span>{label}</span><span className={`metric-icon icon-${color}`}><Icon size={17} /></span></div>
          <strong>{value}</strong><small>{text}</small>
        </article>)}
      </div>
      <div className="market-two-columns market-overview-grid">
        <section className="card market-panel">
          <div className="market-section-heading"><div><h3>Marketplace price comparison</h3><p>Average listed price in the sample</p></div></div>
          <div className="market-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marketStats} margin={{ top: 6, left: 3, right: 15, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="marketplace" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#425570' }} />
                <YAxis width={41} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#53637a' }} tickFormatter={(value) => '$' + value} domain={[0, 35]} />
                <Tooltip cursor={{ fill: '#eff4fb' }} formatter={(value) => [typeof value === 'number' ? money(value) : '—', 'Average listed price']} />
                <Bar dataKey="average" radius={[5, 5, 0, 0]} maxBarSize={84} isAnimationActive={false}>
                  {marketStats.map((item, index) => <Cell key={item.marketplace} fill={marketColors[index]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="card market-panel">
          <div className="market-section-heading"><div><h3>Demand and competition</h3><p>Illustrative interest index from 0 to 100</p></div></div>
          <div className="demand-list">
            {marketStats.map((item, index) => <div className="demand-item" key={item.marketplace}>
              <div><MarketLogo name={item.marketplace} /><strong>{item.marketplace}</strong><span className="market-chip">{item.level} competition</span></div>
              <label><span>Simulated interest <strong>{item.interest}/100</strong></span>
                <progress max={100} value={item.interest} style={{ color: marketColors[index] }} /></label>
              <p>{item.feedbackCount} {item.marketplace === 'Etsy' ? 'fictional reviews' : 'fictional seller feedback entries'} across {item.count} comparables</p>
              <small><strong>Opportunity</strong> {item.opportunity}</small>
            </div>)}
          </div>
        </section>
      </div>
    </section>
    <section className="card market-panel market-section">
      <div className="market-section-heading"><div><h2>Competitor analysis</h2><p>Closest example products by simulated similarity.</p></div>
        <Link to={researchPath(product)} className="text-link">Explore all comparables <ArrowRight size={14} /></Link></div>
      <ClosestComparables />
    </section>
    <div className="market-two-columns market-section">
      <section className="card market-panel">
        <div className="market-section-heading"><div><h2>Customer feedback</h2><p>{sentimentTotal} fictional review excerpts covering common buying expectations</p></div></div>
        <div className="sentiment-block">
          <div className="sentiment-chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart accessibilityLayer={false}><Pie data={sentiment} dataKey="value" nameKey="name" innerRadius={36} outerRadius={52} stroke="none" paddingAngle={3} isAnimationActive={false}>
                {sentiment.map((item) => <Cell key={item.name} fill={item.color} />)}
              </Pie></PieChart>
            </ResponsiveContainer>
            <div><strong>{sentimentTotal}</strong><span>Excerpts</span></div>
          </div>
          <ul className="sentiment-legend">{sentiment.map((item) => <li key={item.name}><i style={{ background: item.color }} />{item.name}<strong>{item.value / sentimentTotal * 100}%</strong></li>)}</ul>
        </div>
        <dl className="market-insights-list">
          <div><dt>Positive themes</dt><dd>Visible wood grain, carved detail, and gifting appeal.</dd></div>
          <div><dt>Negative themes</dt><dd>Smaller size than expected, rough edges, and loose packaging.</dd></div>
          <div><dt>Common expectations</dt><dd>Clear measurements, an even finish, and packaging that limits movement.</dd></div>
          <div><dt>Improvement opportunity</dt><dd>Add a scale reference to the photos and check the base before packing.</dd></div>
        </dl>
      </section>
      <section className="card market-panel">
        <div className="market-section-heading"><div><h2>Quality insights</h2><p>Photo cues and fictional feedback prompts for seller review.</p></div><span className="metric-icon icon-green"><PackageCheck size={17} /></span></div>
        <dl className="market-insights-list">
          <div><dt>Visible craftsmanship indicators</dt><dd>Compare visible carve lines, edge finish, and grain consistency in close-up photos.</dd></div>
          <div><dt>Sample feedback about finish</dt><dd>Example buyers liked the natural oil finish and flagged occasional roughness near the base.</dd></div>
          <div><dt>Packaging</dt><dd>Wrap the trunk and legs separately within a snug padded box to limit movement.</dd></div>
          <div><dt>Photography</dt><dd>Use soft side lighting, one close-up of the carving, and a scale reference.</dd></div>
        </dl>
        <p className="market-panel-note">Quality and durability remain unverified. Inspect the physical product before making listing claims.</p>
      </section>
    </div>
    <section className="card market-panel market-section market-recommendations">
      <div className="market-section-heading"><div className="market-icon-title"><span className="feature-icon icon-violet"><Sparkles size={21} /></span>
        <div><h2>AI recommendations</h2><p>Simulated suggestions for the wooden-elephant example</p></div></div></div>
      <dl className="market-insights-list">{recommendations.map(([label, text]) => <div key={label}><dt>{label}</dt><dd>{text}</dd></div>)}</dl>
    </section>
    <nav className="market-footer-nav" aria-label="Adjacent workflow steps">
      <Link className="text-link" to={researchPath(product)}><ArrowLeft size={15} /> Back to Marketplace Research</Link>
      <Link className="text-link" to={pricingPath(product)}>Get Pricing Recommendations <ArrowRight size={16} /></Link>
    </nav>
  </div>
}
