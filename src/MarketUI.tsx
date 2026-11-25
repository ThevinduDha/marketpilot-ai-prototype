import { ArrowUpRight, FlaskConical } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import type { Product } from './demo'
import { intelligencePath, pricingPath, researchSample } from './marketDemo'
import type { Comparable } from './marketDemo'
import { productMoney, productPath, researchPath } from './productWorkflow'
import { Markets, ProductPhoto } from './ui'

export function MarketJourney({ product }: { product: Product }) {
  return (
    <nav className="market-journey" aria-label="Marketplace workflow">
      <NavLink end to={researchPath(product)}>Research</NavLink>
      <NavLink to={intelligencePath(product)}>Market Intelligence</NavLink>
      <NavLink to={pricingPath(product)}>Pricing Studio</NavLink>
    </nav>
  )
}

export function MarketNotice({ children }: { children: ReactNode }) {
  return <div className="demo-notice market-notice"><FlaskConical size={17} aria-hidden="true" /><p><strong>Simulation</strong><span>{children}</span></p></div>
}

export function MarketProduct({ product, products, route }: { product: Product; products?: Product[]; route?: (product: Product) => string }) {
  const navigate = useNavigate()
  return <section className="card market-context" aria-label="Seller product">
    <ProductPhoto className="market-context-photo" product={product} />
    <div className="market-context-copy">
      <span className="market-eyebrow">{product.id === researchSample.id ? 'Sample seller product' : 'Seller product'}</span>
      <h2><Link to={productPath(product)}>{product.name} <ArrowUpRight size={14} aria-hidden="true" /></Link></h2>
      <p>{[product.materials, product.dimensions, product.category].filter(Boolean).join(' · ')}</p>
      <Markets marketplaces={product.preferredMarketplaces ?? product.marketplaces} />
    </div>
    <div className="market-context-price"><span>Expected price</span><strong>{productMoney(product.price, product)}</strong></div>
    {products && route && <label className="market-select context-select"><span>Change product</span>
      <select value={product.id} onChange={(event) => {
        const selected = products.find((item) => item.id === event.target.value) ?? researchSample
        navigate(route(selected))
      }}>
        {!products.some((item) => item.id === researchSample.id) && <option value={researchSample.id}>Demo mahogany elephant</option>}
        {products.map((item) => <option value={item.id} key={item.id}>{item.name} ({productMoney(item.price, item)})</option>)}
      </select>
    </label>}
  </section>
}

export function ComparablePhoto({ item, className = '' }: { item: Comparable; className?: string }) {
  return <img className={`comparable-photo ${className}`} src={'/comparables/elephant-' + (item.photo + 1) + '.jpg'}
    alt={item.name} width={384} height={512} loading="lazy" />
}

export function Feedback({ item }: { item: Comparable }) {
  return <span className="market-feedback"><strong>{item.rating}</strong><small>{item.feedbackCount} {item.marketplace === 'Etsy' ? 'reviews' : 'feedback entries'}</small></span>
}
