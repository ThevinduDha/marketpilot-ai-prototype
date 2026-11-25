import { ArrowLeft, ArrowRight, Bell, CheckCircle2, ChevronDown, ChevronRight, Command, House, Menu, PanelLeftClose, PanelLeftOpen, Search, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Dashboard } from './Dashboard'
import { ProductsPage } from './Products'
import { AnalysisPage, ProductDetailsPage } from './ProductIntelligence'
import { ProductWizard } from './ProductWizard'
import { MarketplaceResearch } from './MarketplaceResearch'
import { MarketIntelligence } from './MarketIntelligence'
import { PricingStudio } from './PricingStudio'
import { ListingWorkflow } from './ListingWorkflow'
import { MyListings } from './ListingManagement'
import { Analytics, HelpPage, Integrations, SettingsPage } from './WorkspaceExtras'
import { ListingProvider, useListingDemo } from './listingDemo'
import './listings.css'
import { initialPricingPlan, researchSample } from './marketDemo'
import type { PricingPlan } from './marketDemo'
import './market.css'
import { addProductPath, analysisPath, productPath, suggestionsFor } from './productWorkflow'
import { Landing, SignIn } from './PublicPages'
import { activities, preferenceLinks, sampleProducts, workspaceLinks } from './demo'
import type { Product } from './demo'
import { Brand, DemoBadge, Dialog, ProductPhoto } from './ui'

const links = [...workspaceLinks, ...preferenceLinks]
const addPath = addProductPath

function ScrollToPage() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  const [products, setProducts] = useState(() => sampleProducts.map((product) => product.id === 'wooden-elephant' ? { ...product, suggestions: suggestionsFor(product) } : product))
  const [pricingPlans, setPricingPlans] = useState<Partial<Record<string, PricingPlan>>>({})
  const savePricingPlan = useCallback((productId: string, plan: PricingPlan) => {
    setPricingPlans((current) => ({ ...current, [productId]: plan }))
  }, [])
  const saveProduct = useCallback((product: Product) => {
    setProducts((current) => current.some((item) => item.id === product.id)
      ? current.map((item) => item.id === product.id ? product : item)
      : [product, ...current])
  }, [])
  return (
    <ListingProvider>
      <ScrollToPage />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/dashboard/*" element={<Workspace products={products} onSaveProduct={saveProduct} pricingPlans={pricingPlans} onSavePricingPlan={savePricingPlan} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ListingProvider>
  )
}

function Workspace({ products, onSaveProduct, pricingPlans, onSavePricingPlan }: {
  products: Product[]
  onSaveProduct: (product: Product) => void
  pricingPlans: Partial<Record<string, PricingPlan>>
  onSavePricingPlan: (productId: string, plan: PricingPlan) => void
}) {
  const { settings } = useListingDemo()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [panel, setPanel] = useState<'search' | 'alerts' | 'account'>()
  const [query, setQuery] = useState('')
  const [readAlerts, setReadAlerts] = useState(false)
  const [toast, setToast] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const showAdd = location.pathname === '/dashboard/products' && params.has('add')
  const detailId = params.get('product')
  const selectedProduct = products.find((product) => product.id === detailId) ?? (detailId === researchSample.id ? researchSample : undefined)
  const marketProduct = selectedProduct ?? researchSample
  const pricingPlan = pricingPlans[marketProduct.id]
  const editing = !!selectedProduct && params.has('edit')
  const currentLink = links.find((link) => link.path === location.pathname)
  const crumb = showAdd ? 'Add Product' : location.pathname === '/dashboard/products' && detailId ? (editing ? 'Edit Product' : 'Product Details')
    : location.pathname === '/dashboard/research/intelligence' ? 'Market Intelligence' : currentLink?.label || 'Overview'
  const searchItems = products.filter((product) => product.name.toLowerCase().includes(query.trim().toLowerCase()))

  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if (event.key === 'Escape') setMobileOpen(false)
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k' && !document.querySelector('dialog[open]')) {
        event.preventDefault()
        setQuery('')
        setPanel('search')
      }
    }
    window.addEventListener('keydown', shortcut)
    return () => window.removeEventListener('keydown', shortcut)
  }, [])

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(''), 5000)
    return () => window.clearTimeout(timeout)
  }, [toast])

  function finishProduct(product: Product, analyze: boolean) {
    onSaveProduct(product)
    if (!analyze) setToast(product.status === 'Active' ? 'Product changes saved.' : 'Demo draft saved to My Products.')
    navigate(analyze ? analysisPath(product, true) : productPath(product), { replace: true })
  }

  function sectionLinks(group: typeof links) {
    return group.map(({ path, icon: Icon, label }) => path === addPath ? (
      <Link className={`sidebar-link${showAdd ? ' sidebar-active' : ''}`} to={path} key={path} title={label} onClick={() => setMobileOpen(false)}>
        <Icon size={17} /><span>{label}</span>
      </Link>
    ) : (
      <NavLink className={({ isActive }) => `sidebar-link${isActive && !(path === '/dashboard/products' && showAdd) ? ' sidebar-active' : ''}`}
        to={path} end={path !== '/dashboard/research'} key={path} title={label} onClick={() => setMobileOpen(false)}>
        <Icon size={17} /><span>{label}</span>
      </NavLink>
    ))
  }

  return (
    <div className={`workspace ${collapsed ? 'workspace-collapsed' : ''} ${mobileOpen ? 'workspace-drawer-open' : ''}`}>
      <a className="skip-link" href="#workspace-main">Skip to content</a>
      {mobileOpen && <button className="drawer-backdrop" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <aside className="sidebar" id="workspace-sidebar">
        <div className="sidebar-top">
          <Brand to="/dashboard" />
          <button className="icon-button sidebar-toggle" type="button" aria-controls="workspace-sidebar" aria-expanded={!collapsed} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
          </button>
          <button className="icon-button drawer-close" type="button" aria-label="Close sidebar" onClick={() => setMobileOpen(false)}><X size={19} /></button>
        </div>
        <div className="workspace-identity">
          <span className="workspace-avatar">{settings.businessName[0].toUpperCase()}</span><div><strong>{settings.businessName}</strong><small>Seller workspace</small></div>
        </div>
        <nav className="sidebar-nav" aria-label="Workspace navigation">
          <div className="sidebar-group"><p>Workspace</p>{sectionLinks(workspaceLinks)}</div>
          <div className="sidebar-group"><p>Preferences</p>{sectionLinks(preferenceLinks)}</div>
        </nav>
        <div className="sidebar-bottom"><Link className="sidebar-link" title="Back to website" to="/"><ArrowLeft size={17} /><span>Back to website</span></Link></div>
      </aside>
      <div className="workspace-body">
        <header className="topbar">
          <button className="icon-button mobile-menu" type="button" aria-label="Open navigation" aria-expanded={mobileOpen} aria-controls="workspace-sidebar" onClick={() => setMobileOpen(!mobileOpen)}><Menu size={21} /></button>
          {collapsed && <button className="icon-button topbar-expand" aria-label="Expand sidebar" onClick={() => setCollapsed(false)}><PanelLeftOpen size={18} /></button>}
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/dashboard" aria-label="Workspace overview"><House size={16} /><span>Workspace</span></Link><ChevronRight size={13} /><span aria-current="page">{crumb}</span>
          </nav>
          <div className="topbar-actions">
            <button className="top-search" type="button" aria-label="Search workspace" onClick={() => { setQuery(''); setPanel('search') }}>
              <Search size={16} /><span>Search anything…</span><kbd><Command size={11} /> K</kbd>
            </button>
            <DemoBadge />
            <button className="icon-button bell-button" type="button" aria-label="Notifications" onClick={() => { setReadAlerts(true); setPanel('alerts') }}><Bell size={19} />{!readAlerts && <span />}</button>
            <button className="account-button" type="button" aria-label="Demo account" onClick={() => setPanel('account')}><span className="user-avatar">AM</span><ChevronDown size={13} /></button>
          </div>
        </header>
        <main className="workspace-main" id="workspace-main">
          <Routes>
            <Route index element={<Dashboard products={products} />} />
            <Route path="products" element={showAdd || editing
              ? <ProductWizard key={editing ? detailId : 'new'} existing={editing ? selectedProduct : undefined} onFinish={finishProduct} />
              : detailId ? <ProductDetailsPage product={selectedProduct} /> : <ProductsPage items={products} />} />
            <Route path="analysis" element={<AnalysisPage product={selectedProduct} products={products} run={params.has('run')} onSave={onSaveProduct} />} />
            <Route path="research" element={<MarketplaceResearch key={marketProduct.id} product={marketProduct} products={products} />} />
            <Route path="research/intelligence" element={<MarketIntelligence product={marketProduct} />} />
            <Route path="pricing" element={<PricingStudio key={marketProduct.id} product={marketProduct} products={products}
              plan={pricingPlan ?? initialPricingPlan(marketProduct)} onChange={(plan) => onSavePricingPlan(marketProduct.id, plan)} />} />
            <Route path="listings" element={selectedProduct
              ? <ListingWorkflow key={selectedProduct.id} product={selectedProduct} plan={pricingPlan ?? initialPricingPlan(selectedProduct)}
                stage={params.get('stage')} onPublished={onSaveProduct} />
              : <MyListings products={products} />} />
            <Route path="analytics" element={<Analytics products={products} />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
        <footer className="workspace-footer"><span>MarketPilot AI</span><span>Academic AI Economy prototype</span></footer>
      </div>

      {panel === 'search' && <Dialog title="Search workspace" description="Find a product or jump to a workspace page." onClose={() => setPanel(undefined)}>
        <label className="search-field dialog-search"><Search size={17} /><span className="sr-only">Search workspace</span>
          <input data-dialog-autofocus value={query} placeholder="Search products or pages…" onChange={(event) => setQuery(event.target.value)} />
        </label>
        <div className="search-results">
          {searchItems.length > 0 && <span className="search-caption">Products</span>}
          {searchItems.map((product) => (
            <button type="button" className="search-result" key={product.id} onClick={() => { setPanel(undefined); navigate(productPath(product)) }}>
              <ProductPhoto product={product} /><span>{product.name}</span><ArrowRight size={15} />
            </button>
          ))}
          {links.some((item) => item.label.toLowerCase().includes(query.trim().toLowerCase())) && <span className="search-caption">Workspace pages</span>}
          {links.filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase())).map(({ icon: Icon, path, label }) => (
            <Link to={path} className="search-result" key={path} onClick={() => setPanel(undefined)}><Icon size={16} /><span>{label}</span><ArrowRight size={15} /></Link>
          ))}
          {!searchItems.length && !links.some((item) => item.label.toLowerCase().includes(query.trim().toLowerCase())) && <p className="dialog-copy">No results for “{query}”.</p>}
        </div>
      </Dialog>}
      {panel === 'alerts' && <Dialog title="Notifications" description="Activity from the demo workspace." onClose={() => setPanel(undefined)}>
        <ul className="activity-list modal-activity">{activities.map(({ title, detail, time, icon: Icon, color }) => <li key={title}>
          <span className={`metric-icon icon-${color}`}><Icon size={16} /></span><div><strong>{title}</strong><small>{detail}</small></div><time>{time}</time>
        </li>)}</ul>
      </Dialog>}
      {panel === 'account' && <Dialog title="Demo account" onClose={() => setPanel(undefined)}>
        <div className="account-profile"><span className="user-avatar">AM</span><div><strong>Alex Morgan</strong><p>{settings.businessName} · Demo seller</p></div></div>
        <div className="dialog-actions"><Link className="button button-secondary" to="/sign-in">Go to demo sign-in <ArrowRight size={15} /></Link></div>
      </Dialog>}
      {toast && <div className="toast" role="status"><CheckCircle2 size={19} /><span>{toast}</span><button className="icon-button" type="button" aria-label="Dismiss message" onClick={() => setToast('')}><X size={16} /></button></div>}
    </div>
  )
}
