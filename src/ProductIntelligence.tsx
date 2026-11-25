import { ArrowLeft, ArrowRight, Camera, Check, ChevronRight, ClipboardList, ImageIcon, Package, Pencil, Search, Sparkles, Store } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import type { Product } from './demo'
import { Markets, ProductPhoto, Status } from './ui'
import { addProductPath, analysisPath, editProductPath, imagesFor, productBase, productMoney, productPath, researchPath, suggestionsFor } from './productWorkflow'
import type { ProductImage } from './productWorkflow'

export function WorkflowPhoto({ photo }: { photo: ProductImage }) {
  return <ProductPhoto className="workflow-photo" product={{ name: photo.name, photo: photo.photo, upload: photo.upload }} />
}

function Gallery({ product }: { product: Product }) {
  const photos = imagesFor(product)
  return photos.length ? <div className="review-gallery">{photos.map((photo, index) => (
    <figure key={photo.id}><WorkflowPhoto photo={photo} /><figcaption>{index === 0 ? 'Primary image' : 'Photo ' + (index + 1)}</figcaption></figure>
  ))}</div> : <p className="workflow-muted">No product photos added.</p>
}

function Values({ values }: { values: [string, ReactNode][] }) {
  return <dl className="workflow-values">{values.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || 'Unspecified'}</dd></div>)}</dl>
}

export function ProductSummary({ product, onEdit }: { product: Product; onEdit?: (step: number) => void }) {
  const p = product.profile
  const cost = (value?: string) => value ? productMoney(Number(value), product) : 'Unspecified'
  const sections = [
    { title: 'Product photographs', body: <Gallery product={product} /> },
    { title: 'Product information', body: <>
      {product.description && <p className="workflow-description">{product.description}</p>}
      <Values values={[
        ['Product name', product.name], ['Category', product.category], ['Subcategory', p?.subcategory], ['Materials', product.materials],
        ['Color', p?.color], ['Condition', p?.condition], ['Dimensions', product.dimensions], ['Weight', p?.weight ? p.weight + ' ' + p.weightUnit : ''],
        ['Handmade or manufacturing information', p?.production],
      ]} />
    </> },
    { title: 'Costs and inventory', body: <Values values={[
      ['Manufacturing cost', productMoney(product.cost, product)], ['Expected selling price', productMoney(product.price, product)],
      ['Packaging cost', cost(p?.packaging)], ['Shipping cost', cost(p?.shipping)], ['Other expenses', cost(p?.otherExpenses)],
      ['Available quantity', String(product.quantity)], ['Currency', p?.currency ?? 'USD'], ['Desired profit margin', p?.margin ? p.margin + '%' : ''],
    ]} /> },
    { title: 'Marketplace preferences', body: <Values values={[
      ['Preferred marketplaces', <Markets marketplaces={product.preferredMarketplaces ?? product.marketplaces} />],
      ['Target market', p?.targetMarket], ['Selling preferences', p?.preferences],
    ]} /> },
  ]

  return <div className={onEdit ? 'workflow-summary summary-review' : 'workflow-summary summary-details'}>
    {sections.map(({ title, body }, index) => <section key={title} className={onEdit ? 'summary-section' : 'card summary-section'}>
      <div className="summary-title"><h3>{title}</h3>{onEdit && <button type="button" className="text-link" onClick={() => onEdit(index)} aria-label={'Edit ' + title}><Pencil size={14} /> Edit</button>}</div>
      {body}
    </section>)}
  </div>
}

export function ProductDetailsPage({ product }: { product?: Product }) {
  if (!product) return <div className="card phase-preview"><span className="feature-icon icon-blue"><Package size={24} /></span>
    <h1>Product unavailable</h1><p>Demo drafts are available until the page is reloaded.</p>
    <Link className="button button-primary" to={productBase}>Back to My Products</Link></div>

  return <div className="product-workflow">
    <Link className="text-link workflow-back" to={productBase}><ArrowLeft size={15} /> My Products</Link>
    <div className="page-heading workflow-page-heading"><div><h1>{product.name}</h1><p>Product details · Seller-provided information</p></div>
      <Link className="button button-secondary" to={editProductPath(product)}><Pencil size={15} /> Edit Product</Link></div>
    <div className="card analysis-status">
      <span className="feature-icon icon-violet"><Sparkles size={21} /></span>
      <div><h2>AI analysis status</h2><p>{product.suggestions ? 'Simulated analysis complete' : 'Ready for simulated analysis'}</p></div>
      <Status status={product.status} />
      <Link className="button button-primary" to={analysisPath(product, !product.suggestions)}>{product.suggestions ? 'View Analysis' : 'Analyze Product'} <ArrowRight size={16} /></Link>
    </div>
    <ProductSummary product={product} />
  </div>
}

const analysisStages = [
  { title: 'Analyzing product photographs', icon: Camera },
  { title: 'Identifying product characteristics', icon: Search },
  { title: 'Extracting product attributes', icon: ClipboardList },
  { title: 'Preparing marketplace research', icon: Store },
  { title: 'Analysis complete', icon: Check },
]

function AnalysisProgress({ product, onComplete }: { product: Product; onComplete: (product: Product) => void }) {
  const [stage, setStage] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (stage < analysisStages.length - 1) {
        setStage(stage + 1)
      } else {
        onComplete({ ...product, suggestions: suggestionsFor(product) })
        navigate(analysisPath(product), { replace: true })
      }
    }, 500)
    return () => window.clearTimeout(timeout)
  }, [stage, product, onComplete, navigate])

  return <div className="product-workflow analysis-progress">
    <div className="page-heading"><div><h1>Analyzing your product</h1><p>{product.name}</p></div></div>
    <section className="card wizard-card">
      <div className="progress-intro"><span className="feature-icon icon-violet"><Sparkles size={22} /></span>
        <div><h2>Simulated AI analysis</h2><p>This short demo uses example output and your saved product details.</p></div></div>
      <progress aria-label="Simulated analysis progress" max={analysisStages.length} value={stage + 1} />
      <ol className="analysis-timeline">
        {analysisStages.map(({ title, icon: Icon }, index) => (
          <li key={title} className={index === stage ? 'timeline-current' : ''} aria-current={index === stage ? 'step' : undefined}>
            <span className={`metric-icon icon-${index < stage || index === analysisStages.length - 1 && stage === index ? 'green' : index === stage ? 'violet' : 'blue'}`}>
              {index < stage ? <Check size={16} /> : <Icon size={16} />}
            </span><strong>{title}</strong><small>{index < stage || index === analysisStages.length - 1 && stage === index ? 'Done' : index === stage ? 'In progress' : 'Queued'}</small>
          </li>
        ))}
      </ol>
      <p className="sr-only" role="status">{analysisStages[stage].title}</p>
      <Link className="text-link" to={productPath(product)}><ArrowLeft size={15} /> Back to Product Details</Link>
    </section>
  </div>
}

const suggestionFields = [
  ['name', 'Suggested product name'], ['category', 'Suggested category'],
  ['subcategory', 'Suggested subcategory'], ['color', 'Suggested color'], ['style', 'Design style'],
  ['material', 'Material to confirm'], ['attributes', 'Suggested attributes'], ['keywords', 'Suggested search keywords'],
] as const

function AnalysisResults({ product, onSave }: { product: Product; onSave: (product: Product) => void }) {
  const [suggestions, setSuggestions] = useState(() => product.suggestions ?? suggestionsFor(product))
  const [saved, setSaved] = useState(false)
  const elephant = /elephant/i.test(product.name)
  function save() {
    onSave({ ...product, suggestions })
    setSaved(true)
  }

  return <div className="product-workflow">
    <Link className="text-link workflow-back" to={productPath(product)}><ArrowLeft size={15} /> Product Details</Link>
    <div className="page-heading workflow-page-heading"><div><h1>AI Product Intelligence</h1><p>{product.name}</p></div>
      <Link className="button button-secondary" to={editProductPath(product)} onClick={save}><Pencil size={15} /> Edit Product</Link></div>
    <div className="demo-notice"><Sparkles size={17} /><p><strong>Simulated suggestions</strong><span>Photo examples cannot verify exact material, product quality, or durability.</span></p></div>
    <div className="intelligence-grid">
      <section className="card summary-section">
        <div className="summary-title"><h2>Seller-provided information</h2></div>
        <Gallery product={product} />
        <Values values={[
          ['Product name', product.name], ['Category', product.category], ['Subcategory', product.profile?.subcategory],
          ['Declared material', product.materials], ['Declared color', product.profile?.color], ['Dimensions', product.dimensions],
        ]} />
      </section>
      <section className="card summary-section suggested-attributes">
        <div className="summary-title"><h2><Sparkles size={17} /> Editable AI suggestions</h2></div>
        <p className="workflow-muted">Review these example attributes before using them in a listing.</p>
        <form onSubmit={(event) => { event.preventDefault(); save() }}>
          <div className="form-grid workflow-fields">
            {suggestionFields.map(([key, label]) => <label key={key} className={key === 'name' || key === 'attributes' || key === 'keywords' ? 'full-field' : ''}>
              {label}<input value={suggestions[key]} maxLength={250} onChange={(event) => {
                setSaved(false)
                setSuggestions({ ...suggestions, [key]: event.target.value, materialConfirmed: key === 'material' ? false : suggestions.materialConfirmed })
              }} /></label>)}
          </div>
          <label className="confirm-material"><input type="checkbox" checked={suggestions.materialConfirmed} disabled={!suggestions.material.trim() || suggestions.material === 'Needs seller input'} onChange={(event) => {
            setSaved(false); setSuggestions({ ...suggestions, materialConfirmed: event.target.checked })
          }} /> I confirm this material as the seller</label>
          <div className="suggestion-actions"><button className="button button-secondary" type="submit">Save Suggestions</button>
            {saved && <span role="status">Suggestions saved</span>}</div>
        </form>
      </section>
      <section className="card summary-section">
        <div className="summary-title"><h2>Product signals</h2></div>
        <Values values={[
          ['Visible characteristics · demo', elephant ? 'Example: a raised trunk, carved ears, and a compact freestanding form.' : 'Review the photos for shape, finish, proportions, and construction.'],
          ['Potential target customers', elephant ? 'Home décor shoppers, figurine collectors, and gift buyers.' : 'Shoppers browsing ' + product.category + ' and buyers looking for gifts.'],
          ['Product use cases', elephant ? 'Shelf décor, desk display, or a gift for a collector.' : 'Category browsing, gift discovery, and product comparisons.'],
        ]} />
      </section>
      <section className="card summary-section">
        <div className="summary-title"><h2><ImageIcon size={16} /> Photo and listing recommendations</h2></div>
        <Values values={[
          ['Photo presentation', 'Use a neutral background, show a side view and a detail close-up, and add a photo that conveys scale.'],
          ['Missing or uncertain information', [!suggestions.materialConfirmed && 'Material needs seller confirmation', !product.profile?.weight && 'Weight is missing', !product.dimensions && 'Dimensions are missing', 'Quality and durability are unverified'].filter(Boolean).join(' · ')],
        ]} />
      </section>
    </div>
    <section className="card research-action"><div><h2>Compare similar products</h2><p>Continue to the marketplace research preview with this product selected.</p></div>
      <Link className="button button-primary" to={researchPath(product)} onClick={save}><Search size={16} /> Find Similar Products <ChevronRight size={15} /></Link></section>
  </div>
}

export function AnalysisPage({ product, run, products, onSave }: { product?: Product; run: boolean; products: Product[]; onSave: (product: Product) => void }) {
  if (product && (run || product.suggestions)) return run
    ? <AnalysisProgress key={product.id} product={product} onComplete={onSave} />
    : <AnalysisResults key={product.id} product={product} onSave={onSave} />
  if (product) return <Navigate replace to={analysisPath(product, true)} />

  return <div className="product-workflow">
    <div className="page-heading"><div><h1>AI Analysis</h1><p>Choose a catalog product to start or revisit a simulated analysis.</p></div>
      <Link className="button button-primary" to={addProductPath}>Add Product <ArrowRight size={16} /></Link></div>
    <section className="card summary-section analysis-products">
      {products.map((item) => <Link key={item.id} to={analysisPath(item, !item.suggestions)}>
        <ProductPhoto product={item} /><span><strong>{item.name}</strong><small>{item.suggestions ? 'Analysis complete' : 'Ready for analysis'}</small></span><ChevronRight size={16} />
      </Link>)}
    </section>
  </div>
}
