import { ArrowRight, ArrowUpRight, LayoutGrid, List, PackageSearch, Plus, Search, SlidersHorizontal } from 'lucide-react'
import { useSessionField } from './listingDemo'
import { Link } from 'react-router-dom'
import { categories } from './demo'
import { productMoney, productPath } from './productWorkflow'
import type { Product } from './demo'
import { Markets, ProductPhoto, Status } from './ui'

export function ProductTable({ items, compact = false }: { items: Product[]; compact?: boolean }) {
  return (
    <div className="table-scroll" role="region" aria-label={compact ? 'Recent products table' : 'Product catalog table'} tabIndex={0}>
      <table className={`product-table ${compact ? 'table-compact' : ''}`}>
        <thead><tr>
          <th scope="col">Product</th>
          {!compact && <th scope="col">Category</th>}
          <th scope="col">Price</th>
          {!compact && <th scope="col">Quantity</th>}
          <th scope="col">Marketplace</th><th scope="col">Status</th><th scope="col"><span className="sr-only">Actions</span></th>
        </tr></thead>
        <tbody>
          {items.map((product) => (
            <tr key={product.id}>
              <th scope="row"><Link className="product-cell" to={productPath(product)}>
                <ProductPhoto product={product} />
                <span><strong>{product.name}</strong>{compact && <small>{product.category}</small>}</span>
              </Link></th>
              {!compact && <td>{product.category}</td>}
              <td className="table-price">{productMoney(product.price, product)}</td>
              {!compact && <td>{product.quantity}</td>}
              <td><Markets marketplaces={product.marketplaces} /></td>
              <td><Status status={product.status} /></td>
              <td><Link className={compact ? 'icon-button table-action' : 'text-link table-action'} to={productPath(product)} aria-label={`View Product: ${product.name}`}>
                {compact ? <ArrowUpRight size={16} /> : <>View Product <ArrowUpRight size={14} /></>}
              </Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ProductsPage({ items }: { items: Product[] }) {
  const [view, setView] = useSessionField<'grid' | 'table'>('catalog:view', () => 'grid')
  const [query, setQuery] = useSessionField('catalog:query', () => '')
  const [category, setCategory] = useSessionField('catalog:category', () => '')
  const [status, setStatus] = useSessionField('catalog:status', () => '')
  const matching = items.filter((product) =>
    (product.name + ' ' + product.category + ' ' + product.materials).toLowerCase().includes(query.trim().toLowerCase()) &&
    (!category || product.category === category) && (!status || product.status === status),
  )

  return (
    <>
      <div className="page-heading">
        <div><h1>My Products</h1><p>Manage the products and drafts in your demo catalog.</p></div>
        <Link className="button button-primary" to="?add=1"><Plus size={17} /> Add Product</Link>
      </div>
      <div className="catalog-toolbar card">
        <label className="search-field"><Search size={17} aria-hidden="true" /><span className="sr-only">Search products</span>
          <input placeholder="Search products…" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <div className="filter-actions">
          <SlidersHorizontal size={16} className="filter-icon" aria-hidden="true" />
          <label><span className="sr-only">Filter by category</span><select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}
          </select></label>
          <label><span className="sr-only">Filter by status</span><select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">All statuses</option><option>Active</option><option>Draft</option>
          </select></label>
        </div>
        <div className="segmented" role="group" aria-label="Catalog view">
          <button type="button" aria-label="Grid view" aria-pressed={view === 'grid'} onClick={() => setView('grid')}><LayoutGrid size={16} /></button>
          <button type="button" aria-label="Table view" aria-pressed={view === 'table'} onClick={() => setView('table')}><List size={17} /></button>
        </div>
      </div>
      <p className="results-count" aria-live="polite">{matching.length} {matching.length === 1 ? 'product' : 'products'}</p>
      {matching.length === 0 ? (
        <div className="card empty-state">
          <span className="feature-icon icon-blue"><PackageSearch size={23} /></span>
          <h2>No products found</h2><p>Try another search or clear your filters.</p>
          <button className="button button-secondary" onClick={() => { setQuery(''); setCategory(''); setStatus('') }}>Clear filters</button>
        </div>
      ) : view === 'table' ? <div className="card"><ProductTable items={matching} /></div> : (
        <div className="product-grid">
          {matching.map((product) => (
            <article className="card product-card" key={product.id}>
              <Link to={productPath(product)} className="product-image-link" aria-label={`View ${product.name}`}>
                <ProductPhoto product={product} className="catalog-photo" />
              </Link>
              <div className="product-card-body">
                <div className="product-card-meta"><span>{product.category}</span><Status status={product.status} /></div>
                <h2><Link to={productPath(product)}>{product.name}</Link></h2>
                <div className="product-card-stock"><strong>{productMoney(product.price, product)}</strong><span>{product.quantity} available</span></div>
                <div className="product-card-footer"><Markets marketplaces={product.marketplaces} />
                  <Link className="text-link" to={productPath(product)}>View Product <ArrowRight size={14} /></Link></div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  )
}
