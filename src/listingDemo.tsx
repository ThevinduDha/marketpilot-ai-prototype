import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { sampleProducts } from './demo'
import type { Marketplace, Product } from './demo'
import { initialPricingPlan, listingsPath, marketplaces, validPrice } from './marketDemo'
import type { PricingPlan } from './marketDemo'
import { imagesFor } from './productWorkflow'

export type ListingDraft = {
  title: string; description: string; category: string; tags: string; materials: string
  dimensions: string; condition: string; price: string; quantity: string; shipping: string; shippingCost: string
  photoId: string; titleVariant: number; descriptionVariant: number
}
export type Listing = {
  id: string; product: Product; marketplace: Marketplace; content: ListingDraft; date: string; status: 'Published' | 'Paused'
}
export type ListingSession = {
  drafts: Record<Marketplace, ListingDraft>; selected: Marketplace[]; saved?: boolean
}
export type PublishJob = { records: Listing[]; complete: boolean }
export type Settings = { businessName: string; description: string; currency: string; marketplaces: Marketplace[] }

export const listingRoute = (product: Product, stage = 'editor') => listingsPath(product) + '&stage=' + stage
export const listingId = (product: Product, market: Marketplace) => 'DEMO-' + market.toUpperCase() + '-' + product.id.replace(/[^a-z0-9]/gi, '').toUpperCase()
export const displayDate = (date: string) => new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'Asia/Colombo' }).format(new Date(date))

const confirmedMaterial = (product: Product) => product.suggestions?.materialConfirmed
  ? product.suggestions.material.trim() || product.materials
  : product.materials

export function listingPhoto(product: Product, draft: ListingDraft) {
  const photos = imagesFor(product)
  return photos.find((photo) => photo.id === draft.photoId) ?? photos[0]
}

export function generatedTitle(product: Product, marketplace: Marketplace, variant: number) {
  const detail = variant % 3 === 1 ? confirmedMaterial(product) : variant % 3 === 2 ? product.dimensions : marketplace === 'eBay' ? product.dimensions : product.profile?.subcategory
  return [product.name, detail].filter(Boolean).join(' · ')
}

export function generatedDescription(product: Product, marketplace: Marketplace, variant: number) {
  const details = [
    confirmedMaterial(product) && 'Materials: ' + confirmedMaterial(product),
    product.dimensions && 'Dimensions: ' + product.dimensions,
    product.profile?.condition && 'Condition: ' + product.profile.condition,
  ].filter(Boolean).join('\n')
  const intro = variant % 2 === 0 ? [product.description || product.name, details] : [details, product.description || product.name]
  return (marketplace === 'Etsy' ? intro : [...intro].reverse()).filter(Boolean).join('\n\n')
}

export function createDraft(product: Product, marketplace: Marketplace, price: string): ListingDraft {
  return {
    title: generatedTitle(product, marketplace, 0), description: generatedDescription(product, marketplace, 0),
    category: [product.category, product.profile?.subcategory].filter(Boolean).join(' / '),
    tags: [product.name.toLowerCase(), product.category.toLowerCase(), confirmedMaterial(product).toLowerCase()].filter(Boolean).join(', '),
    materials: confirmedMaterial(product), dimensions: product.dimensions, condition: product.profile?.condition || '',
    price, quantity: String(product.quantity), shipping: product.profile?.targetMarket || '',
    shippingCost: product.profile?.shipping || '', photoId: imagesFor(product)[0]?.id || '',
    titleVariant: 0, descriptionVariant: 0,
  }
}

export function listingChecklist(draft: ListingDraft, product: Product) {
  return [
    { label: 'Title, description, and category', complete: Boolean(draft.title.trim() && draft.description.trim() && draft.category.trim()), required: true },
    { label: 'Valid price and quantity', complete: validPrice(draft.price) && Number.isInteger(Number(draft.quantity)) && Number(draft.quantity) > 0 && Number(draft.quantity) <= 999999, required: true },
    { label: 'A product photograph', complete: imagesFor(product).length > 0, required: true },
    { label: 'Materials, dimensions, and condition', complete: Boolean(draft.materials.trim() && draft.dimensions.trim() && draft.condition.trim()), required: false },
    { label: 'Shipping details added', complete: Boolean(draft.shipping.trim() || draft.shippingCost.trim()), required: false },
  ]
}

const seedListings: Listing[] = sampleProducts.filter((item) => item.status === 'Active').flatMap((product) => product.marketplaces.map<Listing>((marketplace) => ({
  id: listingId(product, marketplace), product, marketplace, content: createDraft(product, marketplace, product.price.toFixed(2)),
  date: '2026-11-24T08:00:00Z', status: 'Published',
})))

function useListingStore() {
  const [viewMemory] = useState(() => new Map<string, unknown>())
  const [records, setRecords] = useState(seedListings)
  const [sessions, setSessions] = useState<Partial<Record<string, ListingSession>>>({})
  const [pricingPlans, setPricingPlans] = useState<Partial<Record<string, PricingPlan>>>({})
  const [jobs, setJobs] = useState<Partial<Record<string, PublishJob>>>({})
  const [connections, setConnections] = useState<Record<Marketplace, boolean>>({ Etsy: true, eBay: true })
  const [settings, setSettings] = useState<Settings>({ businessName: 'Studio North', description: '', currency: 'USD', marketplaces: [] })

  function saveSession(id: string, session: ListingSession) {
    setSessions((current) => ({ ...current, [id]: session }))
    setPricingPlans((current) => ({ ...current, [id]: {
      strategy: current[id]?.strategy ?? 'balanced',
      prices: { Etsy: session.drafts.Etsy.price, eBay: session.drafts.eBay.price },
      marketplaces: session.selected,
    } }))
  }

  function savePricingPlan(id: string, plan: PricingPlan) {
    setPricingPlans((current) => ({ ...current, [id]: plan }))
    setSessions((current) => {
      const session = current[id]
      if (!session) return current
      return { ...current, [id]: { ...session, selected: plan.marketplaces, drafts: {
        Etsy: { ...session.drafts.Etsy, price: plan.prices.Etsy },
        eBay: { ...session.drafts.eBay, price: plan.prices.eBay },
      } } }
    })
  }
  function prepareListing(product: Product, plan: PricingPlan) {
    setSessions((current) => {
      const previous = current[product.id]
      const draft = (marketplace: Marketplace) => previous?.drafts[marketplace] ?? createDraft(product, marketplace, plan.prices[marketplace])
      return { ...current, [product.id]: {
        drafts: { Etsy: draft('Etsy'), eBay: draft('eBay') },
        selected: plan.marketplaces, saved: previous?.saved,
      } }
    })
  }
  function beginPublish(product: Product, session: ListingSession) {
    const publishedAt = new Date().toISOString()
    const listings: Listing[] = session.selected.map((marketplace) => ({
      id: listingId(product, marketplace), product, marketplace, content: session.drafts[marketplace], date: publishedAt, status: 'Published',
    }))
    setJobs((current) => ({ ...current, [product.id]: { records: listings, complete: false } }))
  }
  const completePublish = useCallback((id: string, job: PublishJob) => {
    setRecords((current) => [...job.records, ...current.filter((record) => !job.records.some((published) => record.id === published.id))])
    setJobs((current) => ({ ...current, [id]: { ...job, complete: true } }))
    setSessions((current) => { const session = current[id]; return session ? { ...current, [id]: { ...session, saved: false } } : current })
  }, [])
  function updateListing(record: Listing, edits?: Pick<ListingDraft, 'title' | 'price' | 'quantity'>) {
    if (edits) {
      setPricingPlans((current) => {
        const plan = current[record.product.id] ?? initialPricingPlan(record.product)
        return { ...current, [record.product.id]: { ...plan, prices: { ...plan.prices, [record.marketplace]: edits.price } } }
      })
      setSessions((current) => {
        const session = current[record.product.id]
        if (!session) return current
        const draft = { ...session.drafts[record.marketplace], ...edits }
        return { ...current, [record.product.id]: { ...session, drafts: { ...session.drafts, [record.marketplace]: draft } } }
      })
    }
    setRecords((current) => current.map((item) => item.id === record.id ? record : item))
  }
  function toggleConnection(marketplace: Marketplace) {
    setConnections((current) => ({ ...current, [marketplace]: !current[marketplace] }))
  }
  return { viewMemory, pricingPlans, savePricingPlan, records, sessions, jobs, settings, setSettings, connections, toggleConnection, saveSession, prepareListing, beginPublish, completePublish, updateListing }
}

const ListingContext = createContext<ReturnType<typeof useListingStore> | null>(null)
export function ListingProvider({ children }: { children: ReactNode }) {
  return <ListingContext.Provider value={useListingStore()}>{children}</ListingContext.Provider>
}

export function useListingDemo() {
  const store = useContext(ListingContext)
  if (!store) throw new Error('ListingProvider is required')
  return store
}

// Keep unfinished work across route changes within this demo session.
export function useSessionField<T>(key: string, initial: () => T) {
  const { viewMemory } = useListingDemo()
  const [value, setValue] = useState<T>(() => viewMemory.has(key) ? viewMemory.get(key) as T : initial())
  useEffect(() => { viewMemory.set(key, value) }, [key, value, viewMemory])
  return [value, setValue, () => viewMemory.delete(key)] as const
}

export function updateMarketSelection(selected: Marketplace[], marketplace: Marketplace) {
  return selected.includes(marketplace) ? selected.filter((item) => item !== marketplace) : marketplaces.filter((item) => item === marketplace || selected.includes(item))
}
