import { BarChart3, Package, X } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Marketplace, Product } from './demo'

export function Brand({ to = '/', dark = false }: { to?: string; dark?: boolean }) {
  return (
    <Link className={dark ? 'brand brand-light' : 'brand'} to={to} aria-label="MarketPilot AI home">
      <span className="brand-mark"><BarChart3 size={20} strokeWidth={2.4} /></span>
      <span>MarketPilot <span className="brand-ai">AI</span></span>
    </Link>
  )
}

export function DemoBadge() {
  return <span className="demo-badge"><span />Demo Mode</span>
}

const photoPositions = { elephant: '0% 0%', necklace: '100% 0%', vase: '0% 100%', camera: '100% 100%' }

export function ProductPhoto({ product, className = '' }: { product: Product; className?: string }) {
  return (
    <div className={`product-photo ${className}`} role="img" aria-label={product.name}>
      <Package size={22} aria-hidden="true" />
      {product.upload ? <span style={{ backgroundImage: `url("${product.upload}")` }} /> :
        product.photo && <span className="sample-photo" style={{ backgroundPosition: photoPositions[product.photo] }} />}
    </div>
  )
}

export function MarketLogo({ name }: { name: Marketplace }) {
  return <span aria-hidden="true" className={`market-logo ${name === 'Etsy' ? 'market-etsy' : 'market-ebay'}`}>{name === 'Etsy' ? 'E' : 'e'}</span>
}

export function Markets({ marketplaces }: { marketplaces: Product['marketplaces'] }) {
  if (marketplaces.length === 0) return <span className="muted-text">Unassigned</span>
  return <div className="market-badges">{marketplaces.map((market) => <span className={`market-badge ${market === 'Etsy' ? 'etsy' : 'ebay'}`} key={market}>{market}</span>)}</div>
}

export function Status({ status }: { status: Product['status'] }) {
  return <span className={`status-pill ${status === 'Active' ? 'active' : 'draft'}`}><span />{status}</span>
}

export function Dialog({ title, description, children, onClose, wide = false }: {
  title: string
  description?: string
  children: ReactNode
  onClose: () => void
  wide?: boolean
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    dialog?.showModal()
    dialog?.querySelector<HTMLElement>('[data-dialog-autofocus]')?.focus()
    return () => dialog?.close()
  }, [])

  return (
    <dialog
      ref={dialogRef}
      className={`dialog ${wide ? 'dialog-wide' : ''}`}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
    >
      <div className="dialog-inner">
        <div className="dialog-head">
          <div><h2 id={titleId}>{title}</h2>{description && <p id={descriptionId}>{description}</p>}</div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close dialog"><X size={19} /></button>
        </div>
        {children}
      </div>
    </dialog>
  )
}
