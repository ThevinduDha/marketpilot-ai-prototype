import { ArrowRight, Columns3, LayoutGrid, List, ListFilter, Search, Star } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { money } from './demo'
import type { Marketplace, Product } from './demo'
import { closestComparables, competition, intelligencePath, marketplaces } from './marketDemo'
import type { Comparable } from './marketDemo'
import { ComparablePhoto, Feedback, MarketJourney, MarketNotice, MarketProduct } from './MarketUI'
import { productMoney, researchPath } from './productWorkflow'
import { Dialog, Markets, ProductPhoto } from './ui'

const filters = ['All marketplaces', ...marketplaces] as const
type Filter = 'All marketplaces' | Marketplace
type Sort = 'similarity' | 'price-low' | 'price-high' | 'delivered'
const compareLimit = 3

function CompareControl({ item, selected, locked, onToggle }: { item: Comparable; selected: boolean; locked: boolean; onToggle: () => void }) {
  return <label className="compare-control">
    <input type="checkbox" checked={selected} disabled={locked} aria-label={'Compare ' + item.name} onChange={onToggle} />
    <span>{selected ? 'Selected' : 'Compare'}</span>
  </label>
}

function Comparison({ product, items, onClose }: { product: Product; items: Comparable[]; onClose: () => void }) {
  const categoryFeatures = product.description || 'Unspecified'
  const rows = [
    { label: 'Marketplace', seller: (product.preferredMarketplaces ?? product.marketplaces).join(', ') || 'Unassigned', item: (row: Comparable) => row.marketplace },
    { label: 'Listed / expected price', seller: productMoney(product.price, product), item: (row: Comparable) => money(row.price) },
    { label: 'Shipping', seller: product.profile?.shipping ? productMoney(Number(product.profile.shipping), product) + ' cost' : 'Unspecified', item: (row: Comparable) => money(row.shipping) },
    { label: 'Dimensions', seller: product.dimensions || 'Unspecified', item: (row: Comparable) => row.dimensions },
    { label: 'Materials', seller: product.materials || 'Unspecified', item: (row: Comparable) => row.material },
    { label: 'Characteristics', seller: categoryFeatures, item: (row: Comparable) => row.characteristics },
    { label: 'Sample rating or feedback', seller: '—', item: (row: Comparable) => <Feedback item={row} /> },
    { label: 'Simulated similarity', seller: '—', item: (row: Comparable) => row.similarity + '%' },
  ]
  return <Dialog title="Compare products" description="Seller-provided details and fictional listings. Comparable prices are in USD." onClose={onClose} wide>
    <div className="table-scroll market-table-scroll comparison-table" role="region" aria-label="Side-by-side comparison" tabIndex={0}>
      <table className="product-table">
        <thead><tr><th scope="col">Attribute</th><th scope="col">
          <ProductPhoto className="comparison-photo" product={product} />
          <small>Your product</small><strong>{product.name}</strong>
        </th>{items.map((item) => <th scope="col" key={item.id}>
          <ComparablePhoto item={item} className="comparison-photo" />
          <small>{item.marketplace} · demo</small><strong>{item.name}</strong>
        </th>)}</tr></thead>
        <tbody>{rows.map(({ label, seller, item: value }) => <tr key={label}>
          <th scope="row">{label}</th><td>{seller}</td>
          {items.map((item) => <td key={item.id}>{value(item)}</td>)}
        </tr>)}</tbody>
      </table>
    </div>
    <div className="dialog-actions"><button type="button" className="button button-secondary" onClick={onClose}>Close</button></div>
  </Dialog>
}

export function MarketplaceResearch({ product, products }: { product: Product; products: Product[] }) {
  const [market, setMarket] = useState<Filter>('All marketplaces')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<Sort>('similarity')
  const [view, setView] = useState<'grid' | 'table'>('grid')
  const [selected, setSelected] = useState<string[]>([])
  const [comparing, setComparing] = useState(false)
  const search = query.toLowerCase().trim()
  const results = closestComparables.filter((item) =>
    (market === 'All marketplaces' || item.marketplace === market) &&
    [item.name, item.material, item.characteristics].join(' ').toLowerCase().includes(search),
  ).sort((a, b) => {
    if (sort === 'price-low') return a.price - b.price
    if (sort === 'price-high') return b.price - a.price
    if (sort === 'delivered') return a.price + a.shipping - b.price - b.shipping
    return b.similarity - a.similarity
  })
  const selectedItems = closestComparables.filter((item) => selected.includes(item.id))

  function comparisonControl(item: Comparable) {
    const checked = selected.includes(item.id)
    return <CompareControl item={item} selected={checked} locked={!checked && selected.length === compareLimit}
      onToggle={() => setSelected((current) => checked ? current.filter((id) => id !== item.id) : [...current, item.id])} />
  }

  return <div className="market-page">
    <MarketJourney product={product} />
    <div className="page-heading market-page-heading">
      <div><h1>Marketplace Research</h1><p>Compare example listings by price, materials, size, and seller feedback.</p></div>
      <Link className="button button-primary" to={intelligencePath(product)}>View Market Intelligence <ArrowRight size={16} /></Link>
    </div>
    <MarketNotice>Every product uses the fictional wooden-elephant dataset. Similarity scores are illustrative and listed prices are in USD.</MarketNotice>
    <MarketProduct product={product} products={products} route={researchPath} />
    <section aria-labelledby="comparable-heading" className="market-section">
      <div className="market-section-heading"><div><h2 id="comparable-heading">Comparable products</h2><p>Choose up to three listings to compare with your product.</p></div></div>
      <div className="card research-controls">
        <div className="market-tabs" role="group" aria-label="Marketplace filters">
          {filters.map((filter) => <button key={filter} aria-pressed={market === filter} type="button" onClick={() => setMarket(filter)}>{filter}</button>)}
        </div>
        <div className="research-tools">
          <label className="search-field"><Search size={16} /><span className="sr-only">Search comparable products</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by product or material…" />
          </label>
          <label className="market-select sort-select"><ListFilter size={15} /><span className="sr-only">Sort comparable products</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as Sort)}>
              <option value="similarity">Best match</option><option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option><option value="delivered">Lowest price + shipping</option>
            </select>
          </label>
          <div className="segmented" role="group" aria-label="Comparable product view">
            <button type="button" aria-label="Grid view" aria-pressed={view === 'grid'} onClick={() => setView('grid')}><LayoutGrid size={16} /></button>
            <button type="button" aria-label="Table view" aria-pressed={view === 'table'} onClick={() => setView('table')}><List size={17} /></button>
          </div>
        </div>
      </div>
      <div className="market-results-bar">
        <p className="results-count" aria-live="polite">{results.length} {results.length === 1 ? 'listing' : 'listings'} · {selected.length} of {compareLimit} selected</p>
        <div>
          {selected.length > 0 && <button type="button" className="text-link" onClick={() => setSelected([])}>Clear selection</button>}
          <button className="button button-secondary" type="button" disabled={selected.length === 0} onClick={() => setComparing(true)}>
            <Columns3 size={16} /> Compare Selected {selected.length > 0 && <span>({selected.length})</span>}
          </button>
        </div>
      </div>
      {!results.length ? <div className="card empty-state"><Search size={23} /><h2>No matching listings</h2><p>Try a different search or marketplace.</p>
        <button className="button button-secondary" type="button" onClick={() => { setQuery(''); setMarket('All marketplaces') }}>Reset filters</button>
      </div> : view === 'grid' ? <div className="comparable-grid">
        {results.map((item) => <article className="card comparable-card" key={item.id}>
          <div className="comparable-visual"><ComparablePhoto item={item} /><span className="match-pill">{item.similarity}% similarity</span></div>
          <div className="comparable-body">
            <Markets marketplaces={[item.marketplace]} />
            <h3>{item.name}</h3>
            <div className="comparable-price"><strong>{money(item.price)}</strong><span>{money(item.shipping)} shipping</span></div>
            <dl className="comparable-specs"><div><dt>Material</dt><dd>{item.material}</dd></div><div><dt>Size</dt><dd>{item.dimensions}</dd></div></dl>
            <p>{item.characteristics}</p>
            <div className="comparable-footer"><div><Star size={14} /><Feedback item={item} /></div>{comparisonControl(item)}</div>
          </div>
        </article>)}
      </div> : <div className="card table-scroll market-table-scroll" role="region" aria-label="Comparable product table" tabIndex={0}>
        <table className="product-table research-table">
          <thead><tr><th scope="col">Comparable product</th><th scope="col">Marketplace</th><th scope="col">Price</th><th scope="col">Shipping</th>
            <th scope="col">Material and size</th><th scope="col">Sample feedback</th><th scope="col">Similarity</th><th scope="col">Compare</th></tr></thead>
          <tbody>{results.map((item) => <tr key={item.id}>
            <th scope="row"><div className="market-table-product"><ComparablePhoto item={item} /><span><strong>{item.name}</strong><small>{item.characteristics}</small></span></div></th>
            <td><Markets marketplaces={[item.marketplace]} /></td><td>{money(item.price)}</td><td>{money(item.shipping)}</td>
            <td>{item.material}<small className="table-subtext">{item.dimensions}</small></td><td><Feedback item={item} /></td>
            <td>{item.similarity}%</td><td>{comparisonControl(item)}</td>
          </tr>)}</tbody>
        </table>
      </div>}
    </section>
    <div className="card research-action"><div><h2>See what the sample market suggests</h2><p>Review price benchmarks, customer feedback, and demand indicators.</p></div>
      <Link className="button button-primary" to={intelligencePath(product)}>View Market Intelligence <ArrowRight size={16} /></Link></div>
    {comparing && <Comparison product={product} items={selectedItems} onClose={() => setComparing(false)} />}
  </div>
}

export function ClosestComparables() {
  return <div className="table-scroll market-table-scroll" role="region" aria-label="Closest competitors" tabIndex={0}>
    <table className="product-table competitor-table">
      <thead><tr><th scope="col">Comparable</th><th scope="col">Listed price</th><th scope="col">Material</th><th scope="col">Dimensions</th><th scope="col">Sample feedback</th><th scope="col">Competition</th></tr></thead>
      <tbody>{closestComparables.slice(0, 3).map((item) => <tr key={item.id}>
        <th scope="row"><div className="market-table-product"><ComparablePhoto item={item} /><span><strong>{item.name}</strong><small>{item.marketplace} · {item.similarity}% similar</small></span></div></th>
        <td>{money(item.price)}</td><td>{item.material}</td><td>{item.dimensions}</td><td><Feedback item={item} /></td>
        <td><span className="market-chip">{competition[item.marketplace].level}</span></td>
      </tr>)}</tbody>
    </table>
  </div>
}
