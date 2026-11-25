import { ArrowLeft, ArrowRight, Check, CheckCircle2, Clipboard, FileCheck, ImageIcon, Pencil, RotateCw, Send, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import type { Marketplace, Product } from './demo'
import { marketplaces, priceEstimate, pricingPath, validPrice } from './marketDemo'
import type { PricingPlan } from './marketDemo'
import { MarketNotice } from './MarketUI'
import { WorkflowPhoto } from './ProductIntelligence'
import { addProductPath, editProductPath, emptyProfile, imagesFor, productMoney } from './productWorkflow'
import { Dialog, MarketLogo } from './ui'
import { createDraft, generatedDescription, generatedTitle, listingChecklist, listingPhoto, listingRoute, updateMarketSelection, useListingDemo, useSessionField } from './listingDemo'
import type { ListingDraft, ListingSession, PublishJob } from './listingDemo'

const editableFields = [
  ['category', 'Category'], ['tags', 'Tags and SEO keywords'], ['materials', 'Materials'],
  ['dimensions', 'Dimensions'], ['condition', 'Product condition'], ['shipping', 'Shipping information'],
] as const

export function ListingPreview({ product, draft, marketplace }: { product: Product; draft: ListingDraft; marketplace: Marketplace }) {
  const photo = listingPhoto(product, draft)
  return <article className="card market-panel listing-preview">
    <div className="market-icon-title"><MarketLogo name={marketplace} /><div><h2>{marketplace} listing preview</h2><p>Simulated buyer view</p></div></div>
    {photo ? <WorkflowPhoto photo={photo} /> : <div className="listing-no-photo"><ImageIcon size={24} /> No product photo added</div>}
    <h3>{draft.title || 'Untitled listing'}</h3>
    <div className="listing-price-line"><strong>{validPrice(draft.price) ? productMoney(Number(draft.price), product) : 'Price needed'}</strong>
      <span>{draft.quantity || '0'} available</span></div>
    <p className="listing-description">{draft.description || 'Add a description to preview it here.'}</p>
    <dl className="workflow-values">
      <div><dt>Category</dt><dd>{draft.category || 'Unspecified'}</dd></div>
      <div><dt>Materials</dt><dd>{draft.materials || 'Unspecified'}</dd></div>
      <div><dt>Dimensions</dt><dd>{draft.dimensions || 'Unspecified'}</dd></div>
      <div><dt>Condition</dt><dd>{draft.condition || 'Unspecified'}</dd></div>
      <div><dt>Shipping information</dt><dd>{draft.shipping || 'Shipping details pending'}</dd></div>
      <div><dt>Shipping cost entered</dt><dd>{draft.shippingCost ? productMoney(Number(draft.shippingCost), product) : 'Unspecified'}</dd></div>
    </dl>
  </article>
}

function ListingEditor({ product, session, onChange }: { product: Product; session: ListingSession; onChange: (session: ListingSession) => void }) {
  const [marketplace, setMarketplace] = useSessionField<Marketplace>('listing-tab:' + product.id + ':' + session.selected.join(','), () => session.selected[0] ?? 'Etsy')
  const [message, setMessage] = useState('')
  const [copyText, setCopyText] = useState('')
  const draft = session.drafts[marketplace]
  const photos = imagesFor(product)
  const photoId = listingPhoto(product, draft)?.id ?? ''
  const change = (update: Partial<ListingDraft>) => {
    setMessage('')
    onChange({ ...session, drafts: { ...session.drafts, [marketplace]: { ...draft, ...update } }, saved: false })
  }
  function regenerate(field: 'title' | 'description') {
    if (field === 'title') {
      const titleVariant = draft.titleVariant + 1
      change({ titleVariant, title: generatedTitle(product, marketplace, titleVariant) })
    } else {
      const descriptionVariant = draft.descriptionVariant + 1
      change({ descriptionVariant, description: generatedDescription(product, marketplace, descriptionVariant) })
    }
    setMessage(field === 'title' ? 'Sample title updated.' : 'Sample description updated.')
  }
  async function copy() {
    const text = [draft.title, draft.description, ...editableFields.map(([key, label]) => label + ': ' + draft[key]),
      'Price: ' + (validPrice(draft.price) ? productMoney(Number(draft.price), product) : draft.price),
      'Quantity: ' + draft.quantity, 'Shipping cost: ' + (draft.shippingCost ? productMoney(Number(draft.shippingCost), product) : 'Unspecified')].join('\n\n')
    try {
      await navigator.clipboard.writeText(text)
      setMessage('Listing content copied.')
    } catch {
      setCopyText(text)
    }
  }

  return <div className="market-page">
    <Link className="text-link workflow-back" to={pricingPath(product)}><ArrowLeft size={15} /> Pricing Studio</Link>
    <div className="page-heading market-page-heading"><div><h1>AI Listing Generation</h1><p>Edit the sample listing for {product.name}.</p></div>
      <Link to={listingRoute(product, 'review')} className="button button-primary">Review Final Listings <ArrowRight size={16} /></Link></div>
    <MarketNotice>Sample content uses seller-provided product details. Regeneration swaps predefined wording.</MarketNotice>
    <div className="card listing-toolbar">
      <div className="market-tabs" role="group" aria-label="Listing marketplace">
        {marketplaces.map((market) => <button type="button" key={market} aria-pressed={marketplace === market} onClick={() => { setMarketplace(market); setMessage('') }}>{market}</button>)}
      </div>
      <div>
        <button className="button button-secondary" type="button" onClick={() => document.getElementById('listing-title')?.focus()}><Pencil size={15} /> Edit Listing</button>
        <button className="button button-secondary" type="button" onClick={() => void copy()}><Clipboard size={15} /> Copy Content</button>
        <button className="button button-secondary" type="button" onClick={() => { onChange({ ...session, saved: true }); setMessage('Draft saved for this session.') }}>Save Draft</button>
      </div>
    </div>
    {message && <p role="status" className="listing-message">{message}</p>}
    <div className="listing-editor-grid market-section">
      <section className="card market-panel" aria-label={marketplace + ' listing editor'}>
        <div className="market-section-heading"><div><h2>{marketplace} listing details</h2><p>Check the product information before approving this listing.</p></div><span className="metric-icon icon-violet"><Sparkles size={17} /></span></div>
        <div className="form-grid workflow-fields listing-fields">
          <div className="full-field listing-field-block">
            <label htmlFor="listing-title">Generated title</label>
            <button type="button" className="text-link" onClick={() => regenerate('title')}><RotateCw size={14} /> Regenerate Title</button>
            <input id="listing-title" value={draft.title} onChange={(event) => change({ title: event.target.value })} maxLength={160} />
          </div>
          <div className="full-field listing-field-block">
            <label htmlFor="listing-description">Generated description</label>
            <button type="button" className="text-link" onClick={() => regenerate('description')}><RotateCw size={14} /> Regenerate Description</button>
            <textarea id="listing-description" value={draft.description} rows={6} maxLength={1800} onChange={(event) => change({ description: event.target.value })} />
          </div>
          {editableFields.map(([key, label]) => <label key={key} className={key === 'tags' || key === 'shipping' ? 'full-field' : ''}>{label}
            <input value={draft[key]} maxLength={280} placeholder={key === 'shipping' ? 'e.g. destination and handling time' : undefined} onChange={(event) => change({ [key]: event.target.value })} /></label>)}
          <label>Selling price ({product.profile?.currency || 'USD'})<input type="number" min=".01" step=".01" value={draft.price} onChange={(event) => change({ price: event.target.value })} /></label>
          <label>Quantity<input type="number" min="1" step="1" value={draft.quantity} onChange={(event) => change({ quantity: event.target.value })} /></label>
          <label>Shipping cost (per unit)<input type="number" min="0" step=".01" value={draft.shippingCost} onChange={(event) => {
            if (event.target.value === '' || event.target.validity.valid) change({ shippingCost: event.target.value })
          }} /></label>
          <label>Primary photo<select value={photoId} onChange={(event) => change({ photoId: event.target.value })} disabled={!photos.length}>
            {!photos.length && <option value="">No photos available</option>}
            {photos.map((photo, index) => <option value={photo.id} key={photo.id}>Photo {index + 1} · {photo.name}</option>)}
          </select></label>
        </div>
        {!photos.length && <Link className="text-link" to={editProductPath(product)}>Add product photographs <ArrowRight size={15} /></Link>}
        {photos.length > 0 && <div className="listing-photo-strip" aria-label="Product photos">{photos.map((photo, index) =>
          <button key={photo.id} type="button" aria-label={'Use photo ' + (index + 1)} aria-pressed={photo.id === photoId}
            onClick={() => change({ photoId: photo.id })}><WorkflowPhoto photo={photo} /></button>)}</div>}
      </section>
      <ListingPreview product={product} draft={draft} marketplace={marketplace} />
    </div>
    {copyText && <Dialog title="Copy listing content" description="Select and copy the text below." onClose={() => setCopyText('')} wide>
      <textarea className="listing-copy-text" aria-label="Listing content" readOnly value={copyText} rows={9} onFocus={(event) => event.target.select()} data-dialog-autofocus />
    </Dialog>}
  </div>
}

function ListingReview({ product, session }: { product: Product; session: ListingSession }) {
  const [confirm, setConfirm] = useState(false)
  const { saveSession, beginPublish } = useListingDemo()
  const navigate = useNavigate()
  const ready = session.selected.length > 0 && session.selected.every((market) => listingChecklist(session.drafts[market], product).every((item) => item.complete || !item.required))

  return <div className="market-page">
    <Link className="text-link workflow-back" to={listingRoute(product)}><ArrowLeft size={15} /> Edit Listing</Link>
    <div className="page-heading market-page-heading"><div><h1>Final Listing Review</h1><p>Choose which marketplace listings you approve for the demo.</p></div></div>
    <MarketNotice>Publishing only adds records to this demo workspace. No actual Etsy or eBay listings will be created.</MarketNotice>
    <div className="market-two-columns">
      {marketplaces.map((marketplace) => {
        const draft = session.drafts[marketplace]
        const price = validPrice(draft.price) ? Number(draft.price) : null
        const effectiveProduct = { ...product, profile: { ...emptyProfile, ...product.profile, shipping: draft.shippingCost } }
        const profit = priceEstimate(effectiveProduct, marketplace, price).profit
        return <section className="listing-review-card" key={marketplace}>
          <label className="card review-select"><input type="checkbox" checked={session.selected.includes(marketplace)} onChange={() =>
            saveSession(product.id, { ...session, selected: updateMarketSelection(session.selected, marketplace) })} /> <strong>Publish to {marketplace}</strong></label>
          <ListingPreview product={product} draft={draft} marketplace={marketplace} />
          <section className="card market-panel listing-checklist">
            <div className="market-section-heading"><h2>Listing completeness</h2><span className="market-chip">Estimated profit {profit === null ? '—' : productMoney(profit, product)}</span></div>
            <ul>{listingChecklist(draft, product).map(({ label, complete, required }) => <li key={label}>
              {complete ? <Check size={15} /> : <span className="check-placeholder" />}
              <span>{label}</span><small>{complete ? 'Complete' : required ? 'Required' : 'Optional'}</small>
            </li>)}</ul>
          </section>
        </section>
      })}
    </div>
    <div className="card research-action"><div><h2>Approve selected listings</h2><p>{ready ? 'Review your marketplace selection before starting the simulation.' : 'Select at least one marketplace and complete its required checks.'}</p></div>
      <button type="button" className="button button-primary" disabled={!ready} onClick={() => setConfirm(true)}>Confirm and Publish <ArrowRight size={16} /></button></div>
    {confirm && <Dialog title="Confirm demo publishing" description={'Selected marketplaces: ' + session.selected.join(', ')} onClose={() => setConfirm(false)}>
      <p className="dialog-copy">This action creates demo records in My Listings. No actual marketplace listings will be created.</p>
      <div className="dialog-actions"><button className="button button-secondary" type="button" onClick={() => setConfirm(false)}>Cancel</button>
        <button type="button" className="button button-primary" onClick={() => {
          beginPublish(product, session)
          navigate(listingRoute(product, 'publish'), { replace: true })
        }}>Publish Demo Listings</button></div>
    </Dialog>}
  </div>
}

const stages = ['Validating listing information', 'Preparing product images', 'Publishing to selected marketplaces', 'Verifying simulated listing results', 'Publishing complete']
function PublishingProgress({ product, job, onPublished }: { product: Product; job: PublishJob; onPublished: (product: Product) => void }) {
  const [step, setStep] = useState(0)
  const { completePublish } = useListingDemo()
  const navigate = useNavigate()
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (step < stages.length - 1) setStep(step + 1)
      else {
        completePublish(product.id, job)
        const channels = job.records.map((record) => record.marketplace)
        onPublished({ ...product, status: 'Active', marketplaces: [...new Set([...(product.status === 'Active' ? product.marketplaces : []), ...channels])] })
        navigate(listingRoute(product, 'success'), { replace: true })
      }
    }, 580)
    return () => window.clearTimeout(timer)
  }, [step, product, job, completePublish, onPublished, navigate])

  return <div className="product-workflow analysis-progress">
    <div className="page-heading"><div><h1>Simulated Publishing</h1><p>{product.name}</p></div></div>
    <div className="card wizard-card">
      <div className="progress-intro"><span className="feature-icon icon-violet"><Send size={22} /></span>
        <div><h2>Publishing demo listings</h2><p>Selected marketplaces: {job.records.map((item) => item.marketplace).join(', ')}</p></div></div>
      <progress max={stages.length} value={step + 1} aria-label="Demo publishing progress" />
      <ol className="analysis-timeline">{stages.map((stage, index) => <li key={stage} aria-current={step === index ? 'step' : undefined} className={step === index ? 'timeline-current' : ''}>
        <span className={`metric-icon icon-${step > index ? 'green' : 'violet'}`}>{step > index ? <Check size={16} /> : <FileCheck size={16} />}</span>
        <strong>{stage}</strong><small>{index < step || index === stages.length - 1 && index === step ? 'Done' : index === step ? 'In progress' : 'Queued'}</small>
      </li>)}</ol>
      <p className="sr-only" role="status">{stages[step]}</p>
    </div>
  </div>
}

function PublishingSuccess({ job, product }: { job: PublishJob; product: Product }) {
  return <div className="market-page success-page">
    <section className="card market-panel success-hero">
      <span className="feature-icon icon-green"><CheckCircle2 size={25} /></span>
      <h1>Publishing successful — Demo</h1>
      <p>{job.records.length} demo {job.records.length === 1 ? 'listing' : 'listings'} for {product.name} added to My Listings.</p>
      <p>The following records exist in this prototype session only.</p>
      <div className="success-actions"><Link to="/dashboard/listings" className="button button-primary">View My Listings <ArrowRight size={16} /></Link>
        <Link to="/dashboard" className="button button-secondary">Return to Dashboard</Link>
        <Link to={addProductPath} className="button button-secondary">Add Another Product</Link></div>
    </section>
    <div className="market-two-columns market-section">{job.records.map((record) => <section className="card market-panel" key={record.id}>
      <div className="market-icon-title"><MarketLogo name={record.marketplace} /><strong>{record.marketplace}</strong><span className="status-pill active">Demo published</span></div>
      <dl className="price-values"><div><dt>Final selling price</dt><dd>{productMoney(Number(record.content.price), product)}</dd></div>
        <div><dt>Simulated listing ID</dt><dd>{record.id}</dd></div></dl>
    </section>)}</div>
  </div>
}

export function ListingWorkflow({ product, plan, stage, onPublished }: { product: Product; plan: PricingPlan; stage: string | null; onPublished: (product: Product) => void }) {
  const { sessions, jobs, saveSession } = useListingDemo()
  const session = sessions[product.id] ?? {
    drafts: { Etsy: createDraft(product, 'Etsy', plan.prices.Etsy), eBay: createDraft(product, 'eBay', plan.prices.eBay) },
    selected: plan.marketplaces,
  }
  const job = jobs[product.id]
  if (stage === 'publish') return !job ? <Navigate replace to={listingRoute(product, 'review')} /> :
    job.complete ? <Navigate replace to={listingRoute(product, 'success')} /> : <PublishingProgress product={product} job={job} onPublished={onPublished} />
  if (stage === 'success') return job?.complete ? <PublishingSuccess job={job} product={product} /> : <Navigate replace to={listingRoute(product)} />
  if (stage === 'review') return <ListingReview product={product} session={session} />
  return <ListingEditor product={product} session={session} onChange={(value) => saveSession(product.id, value)} />
}
