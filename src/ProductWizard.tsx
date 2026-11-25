import { ArrowLeft, ArrowRight, Camera, Check, ClipboardCheck, CircleDollarSign, FileText, Sparkles, Store, X } from 'lucide-react'
import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { categories } from './demo'
import type { Category, Marketplace, Product } from './demo'
import { ProductSummary, WorkflowPhoto } from './ProductIntelligence'
import { currencies, emptyProfile, imagesFor, makeSample, productBase, productPath, subcategories } from './productWorkflow'
import type { ProductImage, ProductProfile } from './productWorkflow'
import { useListingDemo, useSessionField } from './listingDemo'
import './workflow.css'

const steps = [
  { name: 'Photographs', title: 'Product photographs', text: 'Add up to six images and choose the photo shown first in your catalog.', icon: Camera },
  { name: 'Information', title: 'Product information', text: 'Describe what you are selling and record the details you know.', icon: FileText },
  { name: 'Costs & inventory', title: 'Costs and inventory', text: 'Record your per-unit costs, expected selling price, and stock.', icon: CircleDollarSign },
  { name: 'Marketplaces', title: 'Marketplace preferences', text: 'Choose the channels you want to explore in the simulation.', icon: Store },
  { name: 'Review', title: 'Review your product', text: 'Check your information before saving a draft or starting the simulated analysis.', icon: ClipboardCheck },
]

function draftFrom(product?: Product) {
  return {
    name: product?.name ?? '', description: product?.description ?? '', category: product?.category ?? categories[0],
    materials: product?.materials ?? '', cost: product ? String(product.cost) : '',
    price: product ? String(product.price) : '', quantity: product ? String(product.quantity) : '',
    markets: product?.preferredMarketplaces ?? product?.marketplaces ?? [],
    profile: { ...emptyProfile, ...product?.profile }, photos: product ? imagesFor(product) : [],
  }
}

const marketOptions: { label: string; markets: Marketplace[]; caption: string }[] = [
  { label: 'Etsy', markets: ['Etsy'], caption: 'Handmade, designed, and vintage goods' },
  { label: 'eBay', markets: ['eBay'], caption: 'A broad marketplace for many product types' },
  { label: 'Both marketplaces', markets: ['Etsy', 'eBay'], caption: 'Explore both channels in the demo' },
]

function readPhoto(file: File): Promise<ProductImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve({ id: crypto.getRandomValues(new Uint32Array(2)).join('-'), name: file.name, upload: String(reader.result) })
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function ProductWizard({ existing, onFinish }: { existing?: Product; onFinish: (product: Product, analyze: boolean) => void }) {
  const { settings } = useListingDemo()
  const memoryKey = 'wizard:' + (existing?.id ?? 'new')
  const [step, setStep, clearStep] = useSessionField(memoryKey + ':step', () => 0)
  const [draft, setDraft, clearDraft] = useSessionField(memoryKey + ':draft', () => {
    const initial = draftFrom(existing)
    return existing ? initial : { ...initial, markets: settings.marketplaces, profile: { ...initial.profile, currency: settings.currency } }
  })
  const [dragging, setDragging] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)
  const stepTitle = useRef<HTMLHeadingElement>(null)
  const current = steps[step]

  function goTo(index: number) {
    setError('')
    setStep(index)
    stepTitle.current?.focus()
    window.scrollTo(0, 0)
  }

  async function addPhotos(files: FileList) {
    if (busy) return
    const selected = Array.from(files)
    if (!selected.length) return
    const valid = selected.filter((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type) && file.size <= 6 * 1024 * 1024)
    const available = 6 - draft.photos.length
    setError(valid.length !== selected.length ? 'Use JPEG, PNG, or WebP images up to 6 MB each.' : valid.length > available ? 'You can add up to six photographs.' : '')
    setBusy(true)
    try {
      const photos = await Promise.all(valid.slice(0, available).map(readPhoto))
      setDraft((previous) => ({ ...previous, photos: [...previous.photos, ...photos].slice(0, 6) }))
    } catch {
      setError('A photo could not be opened. Choose the file again.')
    } finally {
      setBusy(false)
    }
  }

  const profileField = (key: keyof ProductProfile, label: string, options?: readonly string[]) => (
    <label>{label}{options ? <select value={draft.profile[key]} onChange={(event) => changeProfile(key, event.target.value)}>
      {!['dimensionUnit', 'weightUnit', 'currency'].includes(key) && <option value="">Select an option</option>}
      {options.map((option) => <option key={option}>{option}</option>)}
    </select> : <input value={draft.profile[key]} onChange={(event) => changeProfile(key, event.target.value)} maxLength={180} />}</label>
  )

  function changeProfile(key: keyof ProductProfile, value: string) {
    setDraft((previous) => ({ ...previous, profile: { ...previous.profile, [key]: value } }))
  }

  function advance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy || step === 4) return
    if (step === 1 && !draft.name.trim()) {
      setError('Enter a product name to continue.')
      return
    }
    goTo(step + 1)
  }

  const product: Product = {
    id: existing?.id ?? '', name: draft.name.trim(), description: draft.description.trim(),
    category: draft.category, status: existing?.status ?? 'Draft', materials: draft.materials.trim(),
    cost: Number(draft.cost), price: Number(draft.price), quantity: Number(draft.quantity),
    marketplaces: existing?.status === 'Active' ? existing.marketplaces : draft.markets, preferredMarketplaces: draft.markets, profile: draft.profile, images: draft.photos,
    photo: draft.photos[0]?.photo, upload: draft.photos[0]?.upload,
    dimensions: [
      ['L', draft.profile.length], ['W', draft.profile.width], ['H', draft.profile.height],
    ].filter(([, value]) => value).map(([label, value]) => label + ' ' + value + ' ' + draft.profile.dimensionUnit).join(' · ') || (existing?.profile ? '' : existing?.dimensions ?? ''),
  }

  function clearWizard() {
    clearStep()
    clearDraft()
  }

  function finish(analyze: boolean) {
    clearWizard()
    onFinish({ ...product, id: product.id || 'draft-' + crypto.getRandomValues(new Uint32Array(2)).join('-') }, analyze)
  }

  return (
    <div className="product-workflow">
      <Link className="text-link workflow-back" to={existing ? productPath(existing) : productBase}><ArrowLeft size={15} /> {existing ? 'Back to Product Details' : 'Back to My Products'}</Link>
      <div className="page-heading"><div><h1>{existing ? 'Edit Product' : 'Add New Product'}</h1><p>{existing ? 'Review your saved photographs, costs, and marketplace preferences.' : 'Add your own product details or choose Use Sample Product to fill all five steps.'}</p></div></div>
      <ol className="workflow-steps card" aria-label="Product submission steps">
        {steps.map(({ name, icon: Icon }, index) => <li key={name} aria-current={step === index ? 'step' : undefined}>
          <span className="step-icon">{index < step ? <Check size={16} /> : <Icon size={16} />}</span>
          <span><small>Step {index + 1}</small><strong>{name}</strong></span>
        </li>)}
      </ol>
      <form className="card wizard-card" onSubmit={advance}>
        <header className="workflow-card-head">
          <div><h2 ref={stepTitle} tabIndex={-1}>{current.title}</h2><p>{current.text}</p></div>
          {step === 0 && <button className="button button-secondary" type="button" disabled={busy} onClick={() => {
            setDraft(draftFrom(makeSample(existing?.id ?? '')))
            setError('')
          }}><Sparkles size={16} /> Use Sample Product</button>}
        </header>
        {step === 0 && <>
          <div className={`photo-drop ${dragging ? 'photo-drop-active' : ''}`}
            onDragOver={(event) => { event.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => { event.preventDefault(); setDragging(false); void addPhotos(event.dataTransfer.files) }}>
            <span className="feature-icon icon-blue"><Camera size={23} /></span>
            <strong>Drag and drop your photos here</strong>
            <small>JPEG, PNG, or WebP · 6 MB each · stored in this tab</small>
            <input hidden ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => {
              if (event.target.files) void addPhotos(event.target.files)
              event.target.value = ''
            }} />
            <button className="button button-secondary" type="button" disabled={busy} onClick={() => fileInput.current?.click()}>Browse Files</button>
            {busy && <p role="status">Preparing previews…</p>}
          </div>
          {draft.photos.length > 0 && <div className="wizard-photos">
            {draft.photos.map((photo, index) => <div className="card wizard-photo" key={photo.id}>
              <WorkflowPhoto photo={photo} />
              <div><button type="button" className="text-link" aria-pressed={index === 0} aria-label={'Primary image: photo ' + (index + 1)} onClick={() => setDraft((previous) => ({
                ...previous, photos: [photo, ...previous.photos.filter((other) => other.id !== photo.id)],
              }))}>{index === 0 ? <><Check size={14} /> Primary</> : 'Set as primary'}</button>
              <button type="button" className="icon-button" aria-label={'Remove photo ' + (index + 1)} onClick={() => setDraft((previous) => ({
                ...previous, photos: previous.photos.filter((other) => other.id !== photo.id),
              }))}><X size={15} /></button></div>
            </div>)}
          </div>}
        </>}
        {step === 1 && <div className="form-grid workflow-fields">
          <label className="full-field">Product name<input required maxLength={100} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
          <label className="full-field">Description<textarea rows={3} maxLength={600} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></label>
          <label>Category<select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value as Category, profile: { ...draft.profile, subcategory: '' } })}>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select></label>
          {profileField('subcategory', 'Subcategory', subcategories[draft.category])}
          <label>Materials<input maxLength={100} value={draft.materials} onChange={(event) => setDraft({ ...draft, materials: event.target.value })} /></label>
          {profileField('color', 'Color')}{profileField('condition', 'Condition', ['New', 'Used', 'Vintage', 'Refurbished'])}
          {profileField('production', 'Handmade or manufacturing information')}
          {(['length', 'width', 'height'] as const).map((key) => <label key={key}>{key[0].toUpperCase() + key.slice(1)}<input type="number" min="0" step="any" value={draft.profile[key]} onChange={(event) => changeProfile(key, event.target.value)} /></label>)}
          {profileField('dimensionUnit', 'Dimension unit', ['cm', 'mm', 'in'])}
          <label>Weight<input type="number" min="0" step="any" value={draft.profile.weight} onChange={(event) => changeProfile('weight', event.target.value)} /></label>
          {profileField('weightUnit', 'Weight unit', ['g', 'kg', 'oz', 'lb'])}
        </div>}
        {step === 2 && <div className="form-grid workflow-fields">
          {profileField('currency', 'Currency', currencies)}
          {([['cost', 'Manufacturing cost'], ['price', 'Expected selling price'], ['quantity', 'Available quantity']] as const).map(([key, label]) =>
            <label key={key}>{label}<input required type="number" min="0" max="999999" step={key === 'quantity' ? '1' : '0.01'} value={draft[key]} onChange={(event) => setDraft({ ...draft, [key]: event.target.value })} /></label>)}
          {([['packaging', 'Packaging cost'], ['shipping', 'Shipping cost'], ['otherExpenses', 'Other expenses'], ['margin', 'Desired profit margin (%)']] as const).map(([key, label]) =>
            <label key={key}>{label}<input type="number" min="0" max={key === 'margin' ? 100 : 999999} step="0.01" value={draft.profile[key]} onChange={(event) => changeProfile(key, event.target.value)} /></label>)}
        </div>}
        {step === 3 && <>
          <fieldset className="market-choices"><legend>Preferred marketplaces</legend>
            {marketOptions.map(({ label, markets, caption }) => <label key={label}>
              <input type="radio" name="preferred-marketplace" checked={draft.markets.join() === markets.join()} onChange={() => setDraft({ ...draft, markets })} />
              <span><strong>{label}</strong><small>{caption}</small></span>
            </label>)}
          </fieldset>
          <div className="form-grid workflow-fields">
            {profileField('targetMarket', 'Target market')}
            {profileField('preferences', 'Selling preferences (optional)')}
          </div>
        </>}
        {step === 4 && <ProductSummary product={product} onEdit={goTo} />}
        {error && <p className="field-error" role="alert">{error}</p>}
        <footer className="wizard-actions">
          {step > 0 ? <button type="button" className="button button-secondary" onClick={() => goTo(step - 1)}><ArrowLeft size={16} /> Back</button> :
            <Link className="button button-secondary" to={existing ? productPath(existing) : productBase} onClick={clearWizard}>Cancel</Link>}
          <div>
            {step === 4 ? <>
              <button type="button" className="button button-secondary" onClick={() => finish(false)}>{existing?.status === 'Active' ? 'Save Changes' : 'Save Draft'}</button>
              <button type="button" className="button button-primary" onClick={() => finish(true)}><Sparkles size={16} /> Analyze Product</button>
            </> : <button className="button button-primary" type="submit" disabled={busy}>Next <ArrowRight size={16} /></button>}
          </div>
        </footer>
      </form>
    </div>
  )
}
