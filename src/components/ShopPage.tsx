import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, ChevronDown, ShoppingCart, Star, Tag } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const CATEGORIES = [
  { name: 'Interior', subs: ['Seat Covers', 'Floor Mats', 'Steering Wheels', 'Dashboard'] },
  { name: 'Cleaning', subs: ['Car Wash', 'Polish', 'Vacuum', 'Wipes'] },
  { name: 'Electronics', subs: ['Dash Cam', 'GPS Tracker', 'Phone Holder', 'LED', 'Air Compressor'] },
  { name: 'Performance', subs: ['Exhaust', 'Air Filters', 'Suspension', 'Brakes'] },
]

const PRICE_RANGES = ['All', 'Under $25', '$25–$50', '$50–$100', '$100–$200']
const FILTER_TABS = ['All Products', 'Trending Now', 'Best Sellers', 'Top Rated', 'New Arrivals']

interface Product {
  id: string; title: string; price: number; compareAtPrice?: number; category?: string; tags?: string; image?: string; inventory: number; isActive: boolean; isFeatured: boolean
}

interface ShopPageProps {
  products: Product[]
  onAddToCart: (p: Product) => void
  initialCategory?: string | null
}

export function ShopPage({ products, onAddToCart, initialCategory }: ShopPageProps) {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All Products')
  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory || null)
  const [priceRange, setPriceRange] = useState('All')
  const [sortBy, setSortBy] = useState('default')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [expandedCat, setExpandedCat] = useState<string | null>(null)

  const filteredProducts = products.filter(p => {
    if (!p.isActive) return false
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
    if (activeCategory && p.category?.toLowerCase() !== activeCategory.toLowerCase()) return false
    if (inStockOnly && p.inventory <= 0) return false
    if (priceRange !== 'All') {
      if (priceRange === 'Under $25' && p.price >= 25) return false
      if (priceRange === '$25–$50' && (p.price < 25 || p.price > 50)) return false
      if (priceRange === '$50–$100' && (p.price < 50 || p.price > 100)) return false
      if (priceRange === '$100–$200' && (p.price < 100 || p.price > 200)) return false
    }
    return true
  })

  const sorted = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    if (sortBy === 'name') return a.title.localeCompare(b.title)
    return 0
  })

  return (
    <div>
      <div className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <Input placeholder="Search parts, brands, or vehicle model..." value={search} onChange={e => setSearch(e.target.value)} className="pl-12 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 h-12" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-3 text-sm text-zinc-500 mb-6">
          <button onClick={() => setActiveCategory(null)} className="hover:text-white transition">Home</button>
          {activeCategory && <><span>/</span><span className="text-white">{activeCategory}</span></>}
        </div>

        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {FILTER_TABS.map(tab => (
            <button key={tab} onClick={() => setActiveFilter(tab)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${activeFilter === tab ? 'bg-red-600 text-white' : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'}`}>{tab}</button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-500">SORT BY</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-36 bg-zinc-900 border-zinc-800 text-white h-9"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            {PRICE_RANGES.map(range => (
              <button key={range} onClick={() => setPriceRange(range)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${priceRange === range ? 'bg-red-600 text-white' : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'}`}>{range}</button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer ml-2">
            <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} className="rounded border-zinc-700 bg-zinc-800" />
            In Stock
          </label>
        </div>

        {activeCategory && (
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-red-500 font-bold tracking-wider uppercase">{activeCategory}</p>
              <h2 className="text-2xl font-black text-white">{activeCategory}</h2>
            </div>
            <button onClick={() => setActiveCategory(null)} className="text-sm text-zinc-400 hover:text-white flex items-center gap-1">✕ Clear Filter</button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sorted.map(product => (
            <div key={product.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all group">
              <div className="relative h-48 bg-zinc-800">
                {product.image ? <img src={product.image} alt={product.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-600"><ShoppingCart className="w-10 h-10" /></div>}
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg">-{Math.round((1 - product.price / product.compareAtPrice) * 100)}%</span>
                )}
                {product.tags?.toLowerCase().includes('summer') && <span className="absolute top-3 left-3 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-lg"><Tag className="w-3 h-3 inline mr-1" />Summer</span>}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" className="bg-white text-black hover:bg-zinc-200" onClick={() => onAddToCart(product)}><ShoppingCart className="w-4 h-4 mr-1" /> Add to Cart</Button>
                </div>
              </div>
              <div className="p-4">
                <p className="text-[10px] text-red-500 font-bold tracking-wider uppercase">DRIVEKIT</p>
                <h3 className="text-sm font-semibold text-white mt-1 line-clamp-2 min-h-[2.5rem]">{product.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg font-bold text-white">${product.price.toFixed(2)}</span>
                  {product.compareAtPrice && product.compareAtPrice > product.price && <span className="text-sm text-zinc-500 line-through">${product.compareAtPrice.toFixed(2)}</span>}
                </div>
                {product.inventory < 10 && product.inventory > 0 && <p className="text-xs text-orange-400 mt-1">Only {product.inventory} left</p>}
                {product.inventory === 0 && <p className="text-xs text-red-400 mt-1 font-medium">Out of stock</p>}
              </div>
            </div>
          ))}
        </div>

        {sorted.length === 0 && (
          <div className="text-center py-16 bg-zinc-900 rounded-2xl border border-zinc-800 mt-4">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4"><Search className="w-8 h-8 text-red-400" /></div>
            <p className="text-white font-medium">No products available</p>
            <p className="text-sm text-zinc-500 mt-2">Check your Shopify connection and try again.</p>
            {activeCategory && <Button variant="outline" className="mt-4 border-zinc-700 text-zinc-300" onClick={() => setActiveCategory(null)}>Clear Filter</Button>}
          </div>
        )}
      </div>
    </div>
  )
}