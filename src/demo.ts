import type { ProductImage, ProductProfile, ProductSuggestions } from './productWorkflow'
import {
  BarChart3, ChartNoAxesCombined, CircleHelp, LayoutDashboard, ListChecks,
  Package, Plug, PlusCircle, Search, Settings, Sparkles, Tags,
} from 'lucide-react'

export const categories = ['Home & Living', 'Jewelry', 'Collectibles', 'Other'] as const
export type Category = typeof categories[number]
export type Marketplace = 'Etsy' | 'eBay'
export type Product = {
  id: string
  name: string
  category: Category
  status: 'Active' | 'Draft'
  price: number
  quantity: number
  cost: number
  dimensions: string
  materials: string
  description: string
  marketplaces: Marketplace[]
  photo?: 'elephant' | 'necklace' | 'vase' | 'camera'
  upload?: string
  preferredMarketplaces?: Marketplace[]
  profile?: ProductProfile
  images?: ProductImage[]
  suggestions?: ProductSuggestions
}

export const sampleProducts: Product[] = [
  {
    id: 'wooden-elephant', name: 'Handmade Wooden Elephant Sculpture', category: 'Home & Living',
    status: 'Active', price: 48, quantity: 18, cost: 19, dimensions: '16 × 8 × 13 cm', materials: 'Walnut wood',
    description: 'A hand-carved walnut elephant with a natural oil finish. Each piece has its own grain pattern.',
    marketplaces: ['Etsy'], photo: 'elephant',
  },
  {
    id: 'amber-necklace', name: 'Handmade Amber Pendant Necklace', category: 'Jewelry',
    status: 'Active', price: 36, quantity: 24, cost: 12, dimensions: '45 cm chain', materials: 'Amber, gold-filled brass',
    description: 'An oval amber pendant on a fine gold-filled chain with a spring-ring clasp.',
    marketplaces: ['Etsy', 'eBay'], photo: 'necklace',
  },
  {
    id: 'ceramic-vase', name: 'Decorative Ceramic Vase', category: 'Home & Living',
    status: 'Active', price: 42, quantity: 12, cost: 16, dimensions: '14 × 14 × 19 cm', materials: 'Glazed stoneware',
    description: 'A wheel-thrown stoneware vase with a soft slate-blue matte glaze.',
    marketplaces: ['Etsy'], photo: 'vase',
  },
  {
    id: 'film-camera', name: 'Vintage Film Camera Collectible', category: 'Collectibles',
    status: 'Draft', price: 89, quantity: 3, cost: 40, dimensions: '13 × 6 × 9 cm', materials: 'Aluminum, leatherette, glass',
    description: 'A vintage 35 mm camera with a brushed metal body, offered as a display collectible.',
    marketplaces: [], photo: 'camera',
  },
]

export const workspaceLinks = [
  { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { label: 'My Products', path: '/dashboard/products', icon: Package },
  { label: 'Add Product', path: '/dashboard/products?add=1', icon: PlusCircle },
  { label: 'AI Analysis', path: '/dashboard/analysis', icon: Sparkles, description: 'Review simulated demand, customer feedback, quality signals, and suggestions for improving product listings.' },
  { label: 'Market Research', path: '/dashboard/research', icon: Search, description: 'Compare fictional Etsy and eBay products, review summaries, and competition signals.' },
  { label: 'Pricing Studio', path: '/dashboard/pricing', icon: Tags, description: 'Explore simulated pricing ranges, costs, and margin scenarios.' },
  { label: 'Listings', path: '/dashboard/listings', icon: ListChecks, description: 'Preview marketplace listing drafts and a simulated seller approval and publishing workflow.' },
  { label: 'Analytics', path: '/dashboard/analytics', icon: BarChart3, description: 'Explore demo revenue trends and marketplace performance.' },
]

export const preferenceLinks = [
  { label: 'Integrations', path: '/dashboard/integrations', icon: Plug, description: 'Explore how Etsy and eBay connections could appear in the workspace using simulated account data.' },
  { label: 'Settings', path: '/dashboard/settings', icon: Settings, description: 'Preview workspace and seller preferences in a later prototype phase.' },
  { label: 'Help and Support', path: '/dashboard/help', icon: CircleHelp, description: 'Explore guidance for the product, pricing, and listing workflows in a later prototype phase.' },
]

export const recommendations = [
  {
    title: 'Test a higher price for the wooden elephant',
    text: 'Comparable Etsy demo listings suggest a price range of $48–$56.',
    detail: 'In the fictional Etsy comparison, the $48–$56 range reflects hand-carved walnut pieces of a similar size. A $52 price would leave $33 after the example $19 manufacturing cost, before fees and shipping.',
    product: 'wooden-elephant',
  },
  {
    title: 'Add a scale photo to the ceramic vase',
    text: 'Sample buyer reviews mention uncertainty about its size.',
    detail: 'The simulated review summary suggests adding a side-by-side image with a familiar object and showing the 19 cm height in the first few listing photos.',
    product: 'ceramic-vase',
  },
]

export const activities = [
  { title: 'Product analysis completed', detail: 'Wooden Elephant Sculpture', time: 'Today', icon: Sparkles, color: 'violet' },
  { title: 'Demo listing marked active', detail: 'Amber Pendant Necklace · eBay', time: 'Yesterday', icon: ChartNoAxesCombined, color: 'green' },
  { title: 'Draft created', detail: 'Vintage Film Camera Collectible', time: '2 days ago', icon: Package, color: 'blue' },
]

const dollars = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
export const money = (value: number, decimals = true) => decimals ? dollars.format(value) : dollars.format(value).replace(/\.00$/, '')
