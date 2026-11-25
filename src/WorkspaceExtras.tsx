import { ArrowRight, CircleDollarSign, HelpCircle, Layers3, Plug, Store, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { monthlyRevenue, RevenueChart } from './Dashboard'
import { money, sampleProducts } from './demo'
import type { Marketplace, Product } from './demo'
import { marketplaces } from './marketDemo'
import { MarketNotice } from './MarketUI'
import { addProductPath, currencies } from './productWorkflow'
import { updateMarketSelection, useListingDemo } from './listingDemo'
import { MarketLogo, ProductPhoto } from './ui'

const performance: { marketplace: Marketplace; revenue: number; profit: number; sales: number }[] = [
  { marketplace: 'Etsy', revenue: 1560, profit: 492, sales: 36 },
  { marketplace: 'eBay', revenue: 920, profit: 318, sales: 24 },
]
const best = [
  { product: sampleProducts[0], sales: 24, revenue: 1040 },
  { product: sampleProducts[1], sales: 20, revenue: 780 },
  { product: sampleProducts[2], sales: 16, revenue: 660 },
]

export function Analytics({ products }: { products: Product[] }) {
  const { records } = useListingDemo()
  const active = records.filter((record) => record.status === 'Published')
  const categories = [...new Set(products.map((item) => item.category))].map((category) => ({ category, count: products.filter((item) => item.category === category).length }))
  const metrics = [
    { label: 'Sample revenue', value: money(monthlyRevenue), icon: CircleDollarSign, color: 'blue', caption: 'Fictional 30-day revenue' },
    { label: 'Active listings', value: active.length, icon: Store, color: 'green', caption: 'Current demo workspace' },
    { label: 'Estimated profit', value: money(performance.reduce((sum, item) => sum + item.profit, 0)), icon: TrendingUp, color: 'violet', caption: 'Fictional 30-day estimate' },
    { label: 'Sample sales', value: performance.reduce((sum, item) => sum + item.sales, 0), icon: Layers3, color: 'amber', caption: 'Fictional units sold' },
  ]
  return <div className="market-page">
    <div className="page-heading market-page-heading"><div><h1>Analytics</h1><p>Review sample performance and the current demo catalog.</p></div>
      <Link to="/dashboard/listings" className="button button-secondary">My Listings <ArrowRight size={16} /></Link></div>
    <MarketNotice>Revenue, sales, and profit are fictional. Catalog and listing counts reflect this session.</MarketNotice>
    <div className="market-stat-grid">{metrics.map(({ label, value, icon: Icon, color, caption }) => <article className="card metric market-stat" key={label}>
      <div className="metric-top"><span>{label}</span><span className={`metric-icon icon-${color}`}><Icon size={17} /></span></div><strong>{value}</strong><small>{caption}</small>
    </article>)}</div>
    <div className="market-two-columns market-section">
      <section className="card market-panel"><div className="market-section-heading"><div><h2>Sample revenue trends</h2><p>Fictional revenue over 30 days · USD</p></div></div>
        <div className="market-chart"><RevenueChart /></div></section>
      <section className="card market-panel"><div className="market-section-heading"><div><h2>Product category distribution</h2><p>Products in the current demo catalog</p></div></div>
        <div className="market-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={categories} layout="vertical" margin={{ left: 5, right: 14 }}>
          <CartesianGrid stroke="#e2e8f0" horizontal={false} /><XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="category" width={88} tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="count" name="Products" fill="#7c3aed" radius={[0, 5, 5, 0]} maxBarSize={25} isAnimationActive={false} />
        </BarChart></ResponsiveContainer></div>
        <ul className="analytics-category-list">{categories.map((item) => <li key={item.category}>{item.category} <strong>{item.count}</strong></li>)}</ul>
      </section>
      <section className="card market-panel"><div className="market-section-heading"><div><h2>Marketplace performance</h2><p>Fictional activity for the sample period</p></div></div>
        <div className="analytics-rows">{performance.map((item) => <div key={item.marketplace}><MarketLogo name={item.marketplace} />
          <span><strong>{item.marketplace}</strong><small>{item.sales} units · {active.filter((record) => record.marketplace === item.marketplace).length} active demo listings</small></span>
          <span><strong>{money(item.revenue)}</strong><small>{money(item.profit)} estimated profit</small></span></div>)}</div>
      </section>
      <section className="card market-panel"><div className="market-section-heading"><div><h2>Sample best-performing products</h2><p>Ranked by fictional revenue</p></div></div>
        <div className="analytics-rows">{best.map(({ product, sales, revenue }) => <div key={product.id}><ProductPhoto product={product} />
          <span><strong>{product.name}</strong><small>{sales} sample units</small></span><strong>{money(revenue)}</strong></div>)}</div>
      </section>
    </div>
  </div>
}

export function Integrations() {
  const { connections, settings, toggleConnection } = useListingDemo()
  return <div className="market-page">
    <div className="page-heading"><div><h1>Integrations</h1><p>Explore simulated marketplace connections.</p></div></div>
    <MarketNotice>Connect and Disconnect update local demo status. No credentials or external accounts are used.</MarketNotice>
    <div className="market-two-columns">{marketplaces.map((marketplace) => <section className="card market-panel" key={marketplace}>
      <div className="market-section-heading"><div className="market-icon-title"><MarketLogo name={marketplace} /><div><h2>{marketplace}</h2><p>{settings.businessName} · {marketplace} demo account</p></div></div></div>
      <div className="integration-actions"><span className={`status-pill ${connections[marketplace] ? 'active' : 'draft'}`}><span />{connections[marketplace] ? 'Demo connected' : 'Demo disconnected'}</span>
        <button type="button" className={`button ${connections[marketplace] ? 'button-secondary' : 'button-primary'}`} aria-label={(connections[marketplace] ? 'Disconnect ' : 'Connect ') + marketplace}
          onClick={() => toggleConnection(marketplace)}><Plug size={15} /> {connections[marketplace] ? 'Disconnect' : 'Connect'}</button></div>
    </section>)}</div>
  </div>
}

export function SettingsPage() {
  const { settings, setSettings } = useListingDemo()
  const [draft, setDraft] = useState(settings)
  const [saved, setSaved] = useState(false)
  return <div className="product-workflow">
    <div className="page-heading"><div><h1>Settings</h1><p>Set workspace defaults for this prototype session.</p></div></div>
    <form className="card wizard-card" onSubmit={(event) => { event.preventDefault(); if (!draft.businessName.trim()) return; setSettings({ ...draft, businessName: draft.businessName.trim() }); setSaved(true) }} onChange={() => setSaved(false)}>
      <div className="market-section-heading"><div><h2>Business information</h2><p>Use fictional details for the presentation.</p></div></div>
      <div className="form-grid workflow-fields">
        <label>Business name<input required value={draft.businessName} maxLength={70} onChange={(event) => setDraft({ ...draft, businessName: event.target.value })} /></label>
        <label>Default currency<select value={draft.currency} onChange={(event) => setDraft({ ...draft, currency: event.target.value })}>{currencies.map((code) => <option key={code}>{code}</option>)}</select></label>
        <label className="full-field">Business description<textarea rows={3} maxLength={260} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></label>
      </div>
      <fieldset className="settings-markets"><legend>Default marketplaces for new products</legend>{marketplaces.map((marketplace) => <label className="compare-control" key={marketplace}>
        <input type="checkbox" checked={draft.marketplaces.includes(marketplace)} onChange={() => setDraft({ ...draft, marketplaces: updateMarketSelection(draft.marketplaces, marketplace) })} /> {marketplace}</label>)}</fieldset>
      <div className="dialog-actions">{saved && <span className="listing-message" role="status">Workspace settings saved.</span>}<button type="submit" disabled={!draft.businessName.trim()} className="button button-primary">Save Settings</button></div>
    </form>
  </div>
}

export function HelpPage() {
  const steps = [
    ['Add and analyze a product', 'Open Add Product and choose Use Sample Product. Complete the wizard and run the simulated analysis.'],
    ['Research and price', 'Compare the fictional listings, review market intelligence, and choose a price per marketplace.'],
    ['Generate and approve listings', 'Generate Listings from Pricing Studio. Edit the sample content, review each listing, and choose the marketplaces to approve.'],
    ['Publish and manage', 'Confirm demo publishing, then view, edit, or pause the resulting records in My Listings.'],
  ]
  return <div className="product-workflow">
    <div className="page-heading"><div><h1>Help and Support</h1><p>Walk through the MarketPilot AI academic demo.</p></div></div>
    <section className="card market-panel">
      <div className="market-section-heading"><div className="market-icon-title"><span className="feature-icon icon-blue"><HelpCircle size={22} /></span><h2>Product-to-publishing walkthrough</h2></div></div>
      <ol className="help-steps">{steps.map(([name, description]) => <li key={name}><strong>{name}</strong><p>{description}</p></li>)}</ol>
      <Link className="button button-primary" to={addProductPath}>Start with the sample product <ArrowRight size={16} /></Link>
    </section>
    <section className="card market-panel market-section"><div className="market-section-heading"><h2>Prototype limitations</h2></div>
      <ul className="help-steps"><li>Analysis, comparable listings, prices, fees, sales, and revenue are fictional.</li>
        <li>Connections and publishing run locally. The prototype creates demo IDs only.</li><li>Choose Restart Demo in the sidebar to restore the sample workspace. Reloading the page also clears your session.</li></ul>
    </section>
  </div>
}
