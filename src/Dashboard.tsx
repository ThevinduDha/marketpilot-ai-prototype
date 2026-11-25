import { ArrowDownRight, ArrowRight, ArrowUpRight, CalendarDays, Check, ChevronRight, CircleDollarSign, FileText, Package, Plus, Sparkles, Store } from 'lucide-react'
import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { activities, money, recommendations } from './demo'
import type { Marketplace, Product } from './demo'
import { ProductTable } from './Products'
import { Dialog, MarketLogo } from './ui'
import { useListingDemo } from './listingDemo'

const periods = {
  '30': [
    { date: 'Oct 29', amount: 180 }, { date: 'Nov 2', amount: 240 }, { date: 'Nov 6', amount: 195 },
    { date: 'Nov 10', amount: 345 }, { date: 'Nov 14', amount: 290 }, { date: 'Nov 18', amount: 410 },
    { date: 'Nov 22', amount: 350 }, { date: 'Nov 26', amount: 470 },
  ],
  '7': [
    { date: 'Nov 20', amount: 86 }, { date: 'Nov 21', amount: 105 }, { date: 'Nov 22', amount: 159 },
    { date: 'Nov 23', amount: 96 }, { date: 'Nov 24', amount: 121 }, { date: 'Nov 25', amount: 118 }, { date: 'Nov 26', amount: 135 },
  ],
  '90': [
    { date: 'Aug 29', amount: 520 }, { date: 'Sep 10', amount: 730 }, { date: 'Sep 22', amount: 680 },
    { date: 'Oct 4', amount: 840 }, { date: 'Oct 16', amount: 765 }, { date: 'Oct 28', amount: 975 },
    { date: 'Nov 12', amount: 960 }, { date: 'Nov 26', amount: 1520 },
  ],
}
type Period = keyof typeof periods
const periodNotes: Record<Period, { change: string; positive: boolean }> = {
  '7': { change: '4.2%', positive: false }, '30': { change: '12.8%', positive: true }, '90': { change: '18.4%', positive: true },
}

export const monthlyRevenue = periods['30'].reduce((total, entry) => total + entry.amount, 0)
const markets: { name: Marketplace; color: string }[] = [{ name: 'Etsy', color: '#2563EB' }, { name: 'eBay', color: '#A78BFA' }]

export function RevenueChart({ period = '30', preview = false }: { period?: Period; preview?: boolean }) {
  const gradient = 'revenue-fill-' + useId().replace(/:/g, '')
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
      <AreaChart data={periods[period]} margin={{ top: 9, right: preview ? 12 : 20, bottom: 0, left: 0 }} accessibilityLayer={!preview}>
        <defs><linearGradient id={gradient} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#2563EB" stopOpacity={0.19} /><stop offset="100%" stopColor="#2563EB" stopOpacity={0.015} />
        </linearGradient></defs>
        <CartesianGrid vertical={false} stroke="#E2E8F0" strokeDasharray="4 4" />
        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} minTickGap={preview ? 8 : 14} padding={preview ? undefined : { left: 8, right: 12 }} tick={{ fill: '#64748B', fontSize: preview ? 9 : 11 }} />
        <YAxis tickLine={false} axisLine={false} tickMargin={7} width={preview ? 36 : 45}
          tick={{ fill: '#64748B', fontSize: preview ? 9 : 11 }} tickFormatter={(value: number) => value >= 1000 ? '$' + value / 1000 + 'k' : '$' + value} />
        {!preview && <Tooltip formatter={(value) => [typeof value === 'number' ? money(value) : '—', 'Demo revenue']} contentStyle={{ borderRadius: 8, borderColor: '#e2e8f0', fontSize: 12 }} />}
        <Area type="monotone" dataKey="amount" stroke="#2563EB" strokeWidth={preview ? 2 : 2.5} fill={'url(#' + gradient + ')'} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function Dashboard({ products }: { products: Product[] }) {
  const { records, connections } = useListingDemo()
  const [period, setPeriod] = useState<Period>('30')
  const [insight, setInsight] = useState<(typeof recommendations)[number]>()
  const [marketDetails, setMarketDetails] = useState<Marketplace>()
  const distribution = markets.map((market) => ({ ...market, value: records.filter((record) => record.status === 'Published' && record.marketplace === market.name).length }))
  const listings = distribution.reduce((total, market) => total + market.value, 0)
  const drafts = products.filter((product) => product.status === 'Draft').length
  const total = periods[period].reduce((sum, entry) => sum + entry.amount, 0)
  const change = periodNotes[period]
  const metrics = [
    { label: 'Total products', value: products.length, icon: Package, color: 'blue', note: 'In your demo catalog' },
    { label: 'Active listings', value: listings, icon: Store, color: 'green', note: 'Published on Etsy or eBay' },
    { label: 'Pending drafts', value: drafts, icon: FileText, color: 'amber', note: 'Awaiting review' },
    { label: 'Estimated revenue', value: money(total, false), icon: CircleDollarSign, color: 'violet', note: 'Last ' + period + ' days · demo' },
  ]

  return (
    <>
      <div className="page-heading">
        <div><h1>Overview</h1><p>Start with Add Product to take a sample item from photo to published listing.</p></div>
        <Link className="button button-primary" to="/dashboard/products?add=1"><Plus size={17} /> Add Product</Link>
      </div>
      <div className="demo-notice"><Sparkles size={17} /><p><strong>Demo workspace</strong><span>AI insights, marketplace activity, and revenue use simulated data.</span></p></div>
      <div className="metrics-grid">
        {metrics.map(({ label, value, icon: Icon, color, note }) => (
          <article className="card metric" key={label}>
            <div className="metric-top"><span>{label}</span><span className={`metric-icon icon-${color}`}><Icon size={17} /></span></div>
            <strong>{value}</strong><small>{note}</small>
          </article>
        ))}
      </div>
      <div className="dashboard-grid">
        <section className="card revenue-card" aria-labelledby="revenue-title">
          <div className="card-heading">
            <div><h2 id="revenue-title">Revenue performance</h2><p>Fictional revenue by interval · USD</p></div>
            <label className="period-control"><CalendarDays size={15} aria-hidden="true" /><span className="sr-only">Revenue date range</span>
              <select value={period} onChange={(event) => setPeriod(event.target.value as Period)}>
                <option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option>
              </select>
            </label>
          </div>
          <div className="chart-total"><strong>{money(total, false)}</strong><span className={change.positive ? 'change-positive' : 'change-negative'}>
            {change.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{change.change}</span><span className="comparison">vs. prior period</span></div>
          <div className="revenue-chart"><RevenueChart period={period} /></div>
        </section>
        <section className="card distribution-card" aria-labelledby="distribution-title">
          <div className="card-heading"><div><h2 id="distribution-title">Marketplace distribution</h2><p>Active demo listings by channel</p></div></div>
          <div className="donut" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart accessibilityLayer={false}><Pie data={listings ? distribution : [{ name: 'No listings', value: 1, color: '#e2e8f0' }]} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={58} outerRadius={77} startAngle={90} endAngle={-270} paddingAngle={4} stroke="none" isAnimationActive={false}>
                {listings ? distribution.map((market) => <Cell key={market.name} fill={market.color} />) : <Cell fill="#e2e8f0" /> }
              </Pie></PieChart>
            </ResponsiveContainer>
            <div className="donut-label"><strong>{listings}</strong><span>Active listings</span></div>
          </div>
          <ul className="chart-legend">
            {distribution.map((market) => <li key={market.name}><span><i style={{ backgroundColor: market.color }} />{market.name}</span><span>{market.value} {market.value === 1 ? 'listing' : 'listings'}</span><strong>{listings ? Math.round(100 * market.value / listings) : 0}%</strong></li>)}
          </ul>
        </section>
        <section className="card recent-products" aria-labelledby="recent-products-title">
          <div className="card-heading"><div><h2 id="recent-products-title">Recent products</h2><p>Latest items in your catalog</p></div><Link className="text-link" to="/dashboard/products">View all <ArrowRight size={15} /></Link></div>
          <ProductTable items={products.slice(0, 4)} compact />
        </section>
        <section className="card insights-card" aria-labelledby="insights-title">
          <div className="card-heading"><div className="insights-title"><span className="metric-icon icon-violet"><Sparkles size={18} /></span><div><h2 id="insights-title">AI recommendations</h2><p>Simulated suggestions</p></div></div></div>
          <div className="insight-list">
            {recommendations.map((item) => (
              <button className="insight-button" type="button" key={item.title} onClick={() => setInsight(item)}>
                <span><strong>{item.title}</strong><small>{item.text}</small></span><ChevronRight size={17} />
              </button>
            ))}
          </div>
        </section>
        <section className="card activity-card" aria-labelledby="activity-title">
          <div className="card-heading"><div><h2 id="activity-title">Recent activity</h2><p>Updates from the demo workspace</p></div></div>
          <ul className="activity-list">{activities.map(({ title, detail, time, icon: Icon, color }) => (
            <li key={title}><span className={`metric-icon icon-${color}`}><Icon size={16} /></span><div><strong>{title}</strong><small>{detail}</small></div><time>{time}</time></li>
          ))}</ul>
        </section>
        <section className="card connections-card" aria-labelledby="connections-title">
          <div className="card-heading"><div><h2 id="connections-title">Marketplace connections</h2><p>Example account status</p></div></div>
          <div className="connection-list">{markets.map(({ name }) => (
            <button className="connection-button" type="button" onClick={() => setMarketDetails(name)} key={name}>
              <MarketLogo name={name} /><strong>{name}</strong><span className={connections[name] ? undefined : 'dashboard-connection-off'}>{connections[name] ? <><Check size={13} /> Demo connected</> : 'Demo disconnected'}</span><ChevronRight size={15} />
            </button>
          ))}</div>
        </section>
      </div>
      {insight && <Dialog title={insight.title} description="Simulated AI recommendation" onClose={() => setInsight(undefined)}>
        <p className="dialog-copy">{insight.detail}</p>
        <div className="dialog-actions"><Link className="button button-primary" to={'/dashboard/products?product=' + insight.product} onClick={() => setInsight(undefined)}>View Product <ArrowRight size={16} /></Link></div>
      </Dialog>}
      {marketDetails && <Dialog title={marketDetails + ' demo connection'} description="Simulated marketplace account" onClose={() => setMarketDetails(undefined)}>
        <p className="dialog-copy">This example connection is part of the presentation. Its displayed listings and connection status use fictional data.</p>
        <div className="dialog-actions"><Link className="button button-secondary" to="/dashboard/integrations">View integrations <ArrowRight size={16} /></Link></div>
      </Dialog>}
    </>
  )
}
