import { sampleProducts } from './demo'
import type { Category, Product } from './demo'

export const subcategories: Record<Category, string[]> = {
  'Home & Living': ['Sculptures & Figurines', 'Vases', 'Home Accessories'],
  Jewelry: ['Necklaces', 'Bracelets', 'Accessories'],
  Collectibles: ['Vintage Cameras', 'Figurines', 'Memorabilia'],
  Other: ['General'],
}

export const currencies = ['USD', 'EUR', 'GBP', 'LKR'] as const
export const emptyProfile = {
  subcategory: '', color: '', condition: '', length: '', width: '', height: '',
  dimensionUnit: 'cm', weight: '', weightUnit: 'g', production: '',
  packaging: '', shipping: '', otherExpenses: '', currency: 'USD', margin: '',
  targetMarket: '', preferences: '',
}
export type ProductProfile = typeof emptyProfile
export type ProductImage = { id: string; name: string; upload?: string; photo?: Product['photo'] }
export type ProductSuggestions = {
  name: string
  category: string
  subcategory: string
  material: string
  materialConfirmed: boolean
  color: string
  style: string
  attributes: string
  keywords: string
}

export const productBase = '/dashboard/products'
export const addProductPath = productBase + '?add=1'
export const productPath = (product: Product) => productBase + '?product=' + encodeURIComponent(product.id)
export const editProductPath = (product: Product) => productPath(product) + '&edit=1'
export const analysisPath = (product: Product, run = false) => '/dashboard/analysis?product=' + encodeURIComponent(product.id) + (run ? '&run=1' : '')
export const researchPath = (product: Product) => '/dashboard/research?product=' + encodeURIComponent(product.id)

export function imagesFor(product: Product): ProductImage[] {
  if (product.images) return product.images
  if (!product.photo && !product.upload) return []
  return [{ id: 'existing', name: product.name, photo: product.photo, upload: product.upload }]
}

export function makeSample(id: string): Product {
  return {
    ...sampleProducts[0], id, status: 'Draft', name: 'Handmade Wooden Elephant Sculpture',
    cost: 8, price: 20, quantity: 20, dimensions: '15 cm high', materials: 'Mahogany wood',
    description: 'A handmade mahogany elephant sculpture with a carved trunk and a warm wood finish.',
    marketplaces: ['Etsy', 'eBay'],
    profile: {
      ...emptyProfile, subcategory: 'Sculptures & Figurines', height: '15', shipping: '3',
      color: 'Warm brown', condition: 'New', production: 'Hand-carved from mahogany wood',
    },
  }
}

export function suggestionsFor(product: Product): ProductSuggestions {
  const elephant = /elephant/i.test(product.name)
  return {
    name: elephant ? 'Hand-Carved Wooden Elephant Sculpture' : product.name,
    category: product.category,
    subcategory: product.profile?.subcategory || subcategories[product.category][0],
    material: product.materials || 'Needs seller input',
    materialConfirmed: false,
    color: product.profile?.color || 'Needs seller input',
    style: elephant ? 'Rustic, natural finish' : 'Style needs seller input',
    attributes: elephant ? 'Raised trunk, carved ears, freestanding form' : 'Add a distinguishing shape, finish, and construction detail',
    keywords: elephant ? 'wooden elephant, carved elephant, elephant figurine' : [product.name.toLowerCase(), product.category.toLowerCase()].join(', '),
  }
}

export function productMoney(value: number, product: Product) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: product.profile?.currency || 'USD',
  }).format(value)
}
