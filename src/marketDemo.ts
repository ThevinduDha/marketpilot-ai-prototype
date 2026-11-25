import type { Marketplace, Product } from './demo'
import { makeSample, suggestionsFor } from './productWorkflow'

export const marketplaces: Marketplace[] = ['Etsy', 'eBay']
const sample = makeSample('research-demo-elephant')
export const researchSample = { ...sample, suggestions: suggestionsFor(sample) }

const forProduct = (path: string, product: Product) => '/dashboard/' + path + '?product=' + encodeURIComponent(product.id)
export const intelligencePath = (product: Product) => forProduct('research/intelligence', product)
export const pricingPath = (product: Product) => forProduct('pricing', product)
export const listingsPath = (product: Product) => forProduct('listings', product)

export type Comparable = {
  id: string
  name: string
  marketplace: Marketplace
  price: number
  shipping: number
  dimensions: string
  material: string
  characteristics: string
  rating: string
  feedbackCount: number
  similarity: number
  photo: number
}

export const comparables: Comparable[] = [
  { id: 'teak', name: 'Hand-Carved Teak Elephant', marketplace: 'Etsy', price: 23, shipping: 4.5, dimensions: '13 × 6 × 12 cm', material: 'Teak', characteristics: 'Raised trunk, satin finish', rating: '4.7 / 5', feedbackCount: 34, similarity: 91, photo: 0 },
  { id: 'mahogany', name: 'Mahogany Elephant Figurine', marketplace: 'Etsy', price: 25.5, shipping: 3.75, dimensions: '14 × 7 × 15 cm', material: 'Mahogany', characteristics: 'Engraved ears, natural oil finish', rating: '4.9 / 5', feedbackCount: 51, similarity: 97, photo: 1 },
  { id: 'mango', name: 'Modern Mango Wood Elephant', marketplace: 'Etsy', price: 27.5, shipping: 0, dimensions: '16 × 7 × 14 cm', material: 'Mango wood', characteristics: 'Minimal silhouette, light grain', rating: '4.6 / 5', feedbackCount: 18, similarity: 82, photo: 2 },
  { id: 'walnut', name: 'Rounded Walnut Elephant', marketplace: 'Etsy', price: 30, shipping: 4, dimensions: '17 × 8 × 16 cm', material: 'Walnut', characteristics: 'Rounded form, polished base', rating: '4.8 / 5', feedbackCount: 42, similarity: 87, photo: 3 },
  { id: 'rubberwood', name: 'Small Rubberwood Elephant', marketplace: 'eBay', price: 19.5, shipping: 4.25, dimensions: '11 × 5 × 10 cm', material: 'Rubberwood', characteristics: 'Pale finish, compact form', rating: '97% positive', feedbackCount: 64, similarity: 78, photo: 4 },
  { id: 'rosewood', name: 'Dark Rosewood Elephant', marketplace: 'eBay', price: 21.7, shipping: 3, dimensions: '15 × 7 × 13 cm', material: 'Rosewood', characteristics: 'Lowered trunk, dark stain', rating: '98% positive', feedbackCount: 47, similarity: 86, photo: 5 },
  { id: 'acacia', name: 'Acacia Desk Elephant', marketplace: 'eBay', price: 24, shipping: 3.5, dimensions: '15 × 7 × 14 cm', material: 'Acacia', characteristics: 'Visible grain, carved details', rating: '99% positive', feedbackCount: 88, similarity: 93, photo: 6 },
  { id: 'suar', name: 'Hand-Finished Suar Elephant', marketplace: 'eBay', price: 26, shipping: 0, dimensions: '16 × 8 × 15 cm', material: 'Suar wood', characteristics: 'Red-brown finish, upright trunk', rating: '98% positive', feedbackCount: 36, similarity: 89, photo: 7 },
]

export const closestComparables = [...comparables].sort((a, b) => b.similarity - a.similarity)
export const competition = {
  Etsy: { interest: 72, level: 'Moderate', opportunity: 'Gift-ready packaging and close-ups of carving details' },
  eBay: { interest: 58, level: 'Higher', opportunity: 'Clear size, shipping costs, and total buyer price' },
}

export const marketStats = marketplaces.map((marketplace) => {
  const items = comparables.filter((item) => item.marketplace === marketplace)
  return {
    marketplace, count: items.length, average: items.reduce((total, item) => total + item.price, 0) / items.length,
    feedbackCount: items.reduce((total, item) => total + item.feedbackCount, 0),
    ...competition[marketplace],
  }
})
export const listPriceRange = [Math.min(...comparables.map((item) => item.price)), Math.max(...comparables.map((item) => item.price))]

export const strategies = {
  competitive: { label: 'Competitive pricing', description: 'Near the low end of the sample listings, with less room for unexpected costs.', prices: { Etsy: 23.99, eBay: 20.99 } },
  balanced: { label: 'Balanced pricing', description: 'Near each marketplace’s sample average, with room for estimated expenses.', prices: { Etsy: 26.99, eBay: 23.99 } },
  premium: { label: 'Premium pricing', description: 'Near the upper end of the sample range, supported by stronger photos and product details.', prices: { Etsy: 29.99, eBay: 25.99 } },
}
export const strategyKeys = ['competitive', 'balanced', 'premium'] as const
export type Strategy = typeof strategyKeys[number]
export type PricingPlan = { strategy: Strategy; prices: Record<Marketplace, string>; marketplaces: Marketplace[] }
export const feeAssumptions = { Etsy: { rate: 0.10, flat: 0.25 }, eBay: { rate: 0.13, flat: 0.30 } }

export function strategyPrices(strategy: Strategy): PricingPlan['prices'] {
  return { Etsy: strategies[strategy].prices.Etsy.toFixed(2), eBay: strategies[strategy].prices.eBay.toFixed(2) }
}

export function initialPricingPlan(product: Product): PricingPlan {
  const preferred = product.preferredMarketplaces ?? product.marketplaces
  return { strategy: 'balanced', prices: strategyPrices('balanced'), marketplaces: preferred.length ? preferred : marketplaces }
}

export function validPrice(value: string) {
  const amount = Number(value)
  return Number.isFinite(amount) && amount >= 0.01 && amount <= 999999 && Math.abs(amount * 100 - Math.round(amount * 100)) < 0.000001
}

const roundUpToCents = (value: number) => Math.ceil(value * 100 - 0.0000001) / 100
const roundCents = (value: number) => Math.round(value * 100) / 100

export function priceEstimate(product: Product, marketplace: Marketplace, price: number | null) {
  const fixed = [
    { label: 'Manufacturing', value: product.cost, color: '#2563eb' },
    { label: 'Packaging', value: Number(product.profile?.packaging || 0), color: '#7c3aed' },
    { label: 'Shipping', value: Number(product.profile?.shipping || 0), color: '#059669' },
    { label: 'Other expenses', value: Number(product.profile?.otherExpenses || 0), color: '#64748b' },
  ]
  const base = fixed.reduce((sum, item) => sum + item.value, 0)
  const assumption = feeAssumptions[marketplace]
  const breakEven = roundUpToCents((base + assumption.flat) / (1 - assumption.rate))
  if (price === null) return { costs: fixed, breakEven, total: null, profit: null, margin: null }
  const fee = roundCents(price * assumption.rate + assumption.flat)
  const total = roundCents(base + fee)
  const profit = roundCents(price - total)
  return {
    costs: [...fixed, { label: 'Marketplace fee', value: fee, color: '#a78bfa' }],
    breakEven, total, profit, margin: profit / price * 100,
  }
}
