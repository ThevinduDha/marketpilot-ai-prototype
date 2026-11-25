import { ArrowRight, ClipboardList, Eye, Pause, Pencil, Play, Search } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from './demo'
import { marketplaces, pricingPath, researchSample, validPrice } from './marketDemo'
import { MarketNotice } from './MarketUI'
import { Dialog, Markets, ProductPhoto } from './ui'
import { productMoney } from './productWorkflow'
import { displayDate, listingPhoto, listingRoute, useListingDemo } from './listingDemo'
import type { Listing } from './listingDemo'
import { ListingPreview } from './ListingWorkflow'

function ManageEdit({ item, onClose, onSave }: { item: Listing; onClose: () => void; onSave: (listing: Listing) => void }) {
  const [draft, setDraft] = useState(item.content)
  return <Dialog title="Edit demo listing" description={item.marketplace + ' · Changes apply only to this workspace.'} onClose={onClose}>
    <form onSubmit={(event) => {
      event.preventDefault()
      if (!draft.title.trim() || !validPrice(draft.price)) return
      onSave({ ...item, content: { ...draft, title: draft.title.trim() } })
    }}>
      <div className="form-grid workflow-fields">
        <label className="full-field">Title<input required value={draft.title} maxLength={160} onChange={(event) => setDraft({ ...draft, title: event.target.value })} /></label>
        <label>Selling price<input type="number" min=".01" max="999999" step=".01" required value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} /></label>
        <label>Stock quantity<input type="number" min="0" max="999999" step="1" required value={draft.quantity} onChange={(event) => setDraft({ ...draft, quantity: event.target.value })} /></label>
      </div>
      <div className="dialog-actions"><button type="button" className="button button-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="button button-primary" disabled={!draft.title.trim() || !validPrice(draft.price)}>Save Changes</button></div>
    </form>
  </Dialog>
}

export function MyListings({ products }: { products: Product[] }) {
  const { records, sessions, updateListing } = useListingDemo()
  const [query, setQuery] = useState('')
  const [market, setMarket] = useState('')
  const [status, setStatus] = useState('')
  const [panel, setPanel] = useState<{ mode: 'view' | 'edit'; item: Listing }>()
  const [message, setMessage] = useState('')
  const savedDrafts = [researchSample, ...products.filter((item) => item.id !== researchSample.id)].filter((item) => sessions[item.id]?.saved)
  const results = records.filter((item) => (!market || item.marketplace === market) && (!status || item.status === status) &&
    (item.content.title + ' ' + item.id).toLowerCase().includes(query.trim().toLowerCase()))

  return <div className="market-page">
    <div className="page-heading market-page-heading"><div><h1>My Listings</h1><p>Manage published and paused records in the demo workspace.</p></div>
      <Link className="button button-primary" to={pricingPath(researchSample)}>Create Listing <ArrowRight size={16} /></Link></div>
    <MarketNotice>These listings are stored in this session. Changes here affect the prototype only.</MarketNotice>
    {savedDrafts.length > 0 && <section className="card market-panel listing-drafts">
      <div className="market-section-heading"><h2>Saved listing drafts</h2></div>
      {savedDrafts.map((item) => <Link className="text-link" key={item.id} to={listingRoute(item)}>{item.name} <ArrowRight size={15} /></Link>)}
    </section>}
    <div className="card catalog-toolbar listing-filter">
      <label className="search-field"><Search size={16} /><span className="sr-only">Search listings</span>
        <input value={query} placeholder="Search by title or listing ID…" onChange={(event) => setQuery(event.target.value)} /></label>
      <label className="market-select"><span className="sr-only">Filter by marketplace</span><select value={market} onChange={(event) => setMarket(event.target.value)}>
        <option value="">All marketplaces</option>{marketplaces.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label className="market-select"><span className="sr-only">Filter by status</span><select value={status} onChange={(event) => setStatus(event.target.value)}>
        <option value="">All statuses</option><option>Published</option><option>Paused</option></select></label>
    </div>
    <p className="results-count" aria-live="polite">{results.length} {results.length === 1 ? 'listing' : 'listings'}</p>
    {message && <p className="listing-message" role="status">{message}</p>}
    {results.length ? <div className="card table-scroll" role="region" aria-label="My listings table" tabIndex={0}>
      <table className="product-table listing-table"><thead><tr><th scope="col">Listing</th><th scope="col">Marketplace</th><th scope="col">Price</th>
        <th scope="col">Stock</th><th scope="col">Status</th><th scope="col">Published</th><th scope="col">Actions</th></tr></thead>
        <tbody>{results.map((item) => <tr key={item.id}>
          <th scope="row"><div className="market-table-product"><ProductPhoto product={{ ...item.product, ...listingPhoto(item.product, item.content), name: item.content.title }} /><span><strong>{item.content.title}</strong><small>{item.id}</small></span></div></th>
          <td><Markets marketplaces={[item.marketplace]} /></td><td>{productMoney(Number(item.content.price), item.product)}</td><td>{item.content.quantity}</td>
          <td><span className={`status-pill ${item.status === 'Published' ? 'active' : 'draft'}`}><span />{item.status}</span></td><td>{displayDate(item.date)}</td>
          <td><div className="listing-row-actions">
            <button className="text-link" type="button" aria-label={'View ' + item.content.title} onClick={() => setPanel({ mode: 'view', item })}><Eye size={14} /> View</button>
            <button className="text-link" type="button" aria-label={'Edit ' + item.content.title} onClick={() => setPanel({ mode: 'edit', item })}><Pencil size={14} /> Edit</button>
            <button className="text-link" type="button" onClick={() => {
              const resumed = item.status === 'Paused'
              updateListing({ ...item, status: resumed ? 'Published' : 'Paused' })
              setMessage(item.marketplace + (resumed ? ' demo listing resumed.' : ' demo listing paused.'))
            }}>{item.status === 'Paused' ? <><Play size={14} /> Resume</> : <><Pause size={14} /> Pause</>}</button>
          </div></td></tr>)}</tbody>
      </table>
    </div> : <div className="card empty-state"><ClipboardList size={22} /><h2>No matching listings</h2><p>Try different filters or start a demo listing.</p></div>}
    {panel?.mode === 'view' && <Dialog title="View demo listing" description={panel.item.id} onClose={() => setPanel(undefined)} wide>
      <ListingPreview product={panel.item.product} draft={panel.item.content} marketplace={panel.item.marketplace} />
    </Dialog>}
    {panel?.mode === 'edit' && <ManageEdit item={panel.item} onClose={() => setPanel(undefined)} onSave={(record) => {
      updateListing(record); setPanel(undefined); setMessage('Demo listing updated.')
    }} />}
  </div>
}
