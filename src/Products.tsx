import { ArrowRight, ArrowUpRight, ImagePlus, LayoutGrid, List, PackageSearch, Plus, Search, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { categories, money } from './demo'
import type { Category, Product } from './demo'
import { Dialog, Markets, ProductPhoto, Status } from './ui'

export const productPath = (product: Product) => '/dashboard/products?product=' + encodeURIComponent(product.id)

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
              <td className="table-price">{money(product.price)}</td>
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
  const [view, setView] = useState<'grid' | 'table'>('grid')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
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
                <div className="product-card-stock"><strong>{money(product.price)}</strong><span>{product.quantity} available</span></div>
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

export function ProductDetails({ product, onClose }: { product: Product; onClose: () => void }) {
  return (
    <Dialog title={product.name} description="Demo catalog product" onClose={onClose} wide>
      <div className="detail-view">
        <ProductPhoto product={product} className="detail-photo" />
        <div>
          <div className="detail-badges"><Status status={product.status} /><Markets marketplaces={product.marketplaces} /></div>
          <p>{product.description || 'No description added yet.'}</p>
          <dl>
            <div><dt>Category</dt><dd>{product.category}</dd></div><div><dt>Available quantity</dt><dd>{product.quantity}</dd></div>
            <div><dt>Selling price</dt><dd>{money(product.price)}</dd></div><div><dt>Manufacturing cost</dt><dd>{money(product.cost)}</dd></div>
            <div><dt>Dimensions</dt><dd>{product.dimensions || 'Unspecified'}</dd></div><div><dt>Materials</dt><dd>{product.materials || 'Unspecified'}</dd></div>
          </dl>
        </div>
      </div>
      <div className="dialog-actions"><button className="button button-secondary" type="button" onClick={onClose}>Close</button></div>
    </Dialog>
  )
}

export function AddProduct({ onClose, onSave }: { onClose: () => void; onSave: (product: Product) => void }) {
  const [photo, setPhoto] = useState<File>()
  const [photoError, setPhotoError] = useState('')
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (photoError) return
    const fields = new FormData(event.currentTarget)
    const value = (name: string) => String(fields.get(name) ?? '').trim()
    if (!value('name')) {
      const nameField = event.currentTarget.elements.namedItem('name') as HTMLInputElement
      nameField.setCustomValidity('Enter a product name.')
      nameField.reportValidity()
      return
    }
    onSave({
      id: 'draft-' + crypto.randomUUID(), name: value('name'), category: value('category') as Category,
      quantity: Number(value('quantity')), price: Number(value('price')), cost: Number(value('cost')),
      dimensions: value('dimensions'), materials: value('materials'), description: value('description'),
      status: 'Draft', marketplaces: [], upload: photo ? URL.createObjectURL(photo) : undefined,
    })
  }

  return (
    <Dialog title="Add Product" description="Create a demo draft for this browser session." onClose={onClose} wide>
      <form onSubmit={save} className="draft-form">
        <label className="upload-field">
          <ImagePlus size={22} aria-hidden="true" />
          <span><strong>{photo?.name || 'Choose a product photo'}</strong><small>Optional · JPEG, PNG, or WebP · up to 6 MB</small></span>
          <input type="file" accept="image/jpeg,image/png,image/webp" aria-label="Choose a product photo" onChange={(event) => {
            const selected = event.target.files?.[0]
            const invalid = selected && (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type) || selected.size > 6 * 1024 * 1024)
            setPhoto(invalid ? undefined : selected)
            setPhotoError(invalid ? 'Choose a JPEG, PNG, or WebP image under 6 MB.' : '')
          }} />
        </label>
        {photoError && <p className="field-error" role="alert">{photoError}</p>}
        <div className="form-grid">
          <label>Product name<input name="name" placeholder="e.g. Hand-thrown planter" required maxLength={100} onInput={(event) => event.currentTarget.setCustomValidity('')} /></label>
          <label>Category<select name="category">{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Manufacturing cost (USD)<input name="cost" type="number" min="0" max="999999" step="0.01" placeholder="0.00" required /></label>
          <label>Expected selling price (USD)<input name="price" type="number" min="0" max="999999" step="0.01" placeholder="0.00" required /></label>
          <label>Available quantity<input name="quantity" type="number" min="0" max="999999" step="1" placeholder="0" required /></label>
          <label>Dimensions<input name="dimensions" placeholder="e.g. 12 × 12 × 8 cm" maxLength={60} /></label>
          <label className="full-field">Materials<input name="materials" placeholder="e.g. Glazed stoneware" maxLength={100} /></label>
          <label className="full-field">Description<textarea name="description" rows={3} maxLength={500} placeholder="Describe the product and its finish." /></label>
        </div>
        <div className="dialog-actions">
          <button className="button button-secondary" type="button" onClick={onClose}>Cancel</button>
          <button className="button button-primary" type="submit">Save demo draft</button>
        </div>
      </form>
    </Dialog>
  )
}
