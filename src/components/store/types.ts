import {
  Truck, Shield, RotateCcw, Zap, Star, Tag,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ShopifyImage {
  id: number
  src: string
  alt: string
  width: number
  height: number
}

export interface ShopifyVariant {
  id: number
  title: string
  price: number
  compareAtPrice: number | null
  option1: string | null
  option2: string | null
  option3: string | null
  inStock: boolean
  inventoryQuantity: number
  sku: string | null
  imageId: number | null
  weight?: number
  weightUnit?: string
}

export interface ShopifyOption {
  name: string
  values: string[]
}

export interface Product {
  id: number
  title: string
  handle: string
  description: string
  htmlDescription: string
  vendor: string
  productType: string
  tags: string[]
  images: ShopifyImage[]
  variants: ShopifyVariant[]
  options: ShopifyOption[]
  minPrice: number
  inStock: boolean
  hidden?: boolean
}

export interface ReviewData {
  id: string
  productId: string
  displayName: string
  rating: number
  title: string | null
  body: string
  verified: boolean
  createdAt: string
}

export interface ReviewStats {
  reviews: ReviewData[]
  count: number
  average: number
  distribution: number[]
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const PRODUCTS_PER_PAGE = 30

export const NAV_CATEGORIES = [
  {
    label: 'Interior',
    items: ['Sun Shade', 'Seat Organizer', 'Cup Holder', 'Diffuser', 'Air Purifier'],
  },
  {
    label: 'Cleaning',
    items: ['Vacuum', 'Car Wash', 'Foam Gun', 'Glass Washer', 'Microfiber'],
  },
  {
    label: 'Electronics',
    items: ['Dash Cam', 'GPS Tracker', 'Phone Holder', 'LED', 'Air Compressor'],
  },
  {
    label: 'Performance',
    items: ['Oil Cooler', 'Antenna', 'Ice Scraper'],
  },
  {
    label: 'Shop All',
    items: ['All Products', 'Trending Now', 'Best Sellers', 'New Arrivals', 'Deals'],
  },
]

export const CATEGORIES = [
  { icon: Zap, label: 'Trending Now', color: 'from-red-900/40 to-red-800/20', accent: 'text-red-400' },
  { icon: Tag, label: 'Best Sellers', color: 'from-blue-900/40 to-blue-800/20', accent: 'text-blue-400' },
  { icon: Star, label: 'Top Rated', color: 'from-yellow-900/40 to-yellow-800/20', accent: 'text-yellow-400' },
  { icon: RotateCcw, label: 'New Arrivals', color: 'from-emerald-900/40 to-emerald-800/20', accent: 'text-emerald-400' },
  { icon: Tag, label: 'Deals', color: 'from-orange-900/40 to-orange-800/20', accent: 'text-orange-400' },
]

export const TRUST_ITEMS = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over $99. Nationwide coverage with real-time tracking.', color: 'text-red-400' },
  { icon: Shield, title: 'Fitment Guarantee', desc: "If a part doesn't fit your vehicle, we'll replace or refund it. No questions asked.", color: 'text-orange-400' },
  { icon: RotateCcw, title: 'Easy 2-Week Returns', desc: 'Unused parts return within 14 days. Original packaging required.', color: 'text-blue-400' },
]

export const PROMO_CODES: Record<string, { discount: number; label: string }> = {
  DRIVE20: { discount: 0.20, label: '20% off' },
  WELCOME10: { discount: 0.10, label: '10% off' },
  VIP15: { discount: 0.15, label: '15% off' },
  FREEBIE: { discount: 0, label: 'Free shipping' },
}

export const FREE_SHIPPING_THRESHOLD = 99

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function formatPrice(price: number) {
  return price.toFixed(2)
}

export function getCompareAtPrice(variants: ShopifyVariant[]): number | null {
  for (const v of variants) {
    if (v.compareAtPrice !== null) return v.compareAtPrice
  }
  return null
}

export function getDiscountPercent(price: number, compareAt: number | null): number | null {
  if (!compareAt || compareAt <= price) return null
  return Math.round(((compareAt - price) / compareAt) * 100)
}
