import { useState, useEffect, useMemo } from 'react'
import {
  ShoppingCart, ChevronRight, Star, Heart, Share2, Minus, Plus,
  ChevronLeft, Loader2, AlertCircle, Check, Eye, ChevronDown, Car,
} from 'lucide-react'
import { Product, ReviewStats, formatPrice, getCompareAtPrice, getDiscountPercent } from './types'
import { ShareMenu } from './ProductCard'

const VEHICLE_DATA: Record<string, Record<string, string[]>> = {
  '2024': { 'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma'], 'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'HR-V'], 'Ford': ['F-150', 'Mustang', 'Explorer', 'Bronco', 'Escape'], 'Chevrolet': ['Silverado', 'Equinox', 'Traverse', 'Malibu', 'Camaro'], 'BMW': ['3 Series', '5 Series', 'X3', 'X5', 'M4'], 'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE', 'A-Class'], 'Tesla': ['Model 3', 'Model Y', 'Model S', 'Model X'], 'Hyundai': ['Tucson', 'Sonata', 'Elantra', 'Santa Fe', 'Kona'], 'Kia': ['Sportage', 'Forte', 'Sorento', 'Telluride', 'Seltos'], 'Jeep': ['Wrangler', 'Grand Cherokee', 'Cherokee', 'Gladiator', 'Compass'] },
  '2023': { 'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma'], 'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'HR-V'], 'Ford': ['F-150', 'Mustang', 'Explorer', 'Bronco', 'Escape'], 'Chevrolet': ['Silverado', 'Equinox', 'Traverse', 'Malibu', 'Camaro'], 'BMW': ['3 Series', '5 Series', 'X3', 'X5', 'M4'], 'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE', 'A-Class'], 'Tesla': ['Model 3', 'Model Y', 'Model S', 'Model X'], 'Hyundai': ['Tucson', 'Sonata', 'Elantra', 'Santa Fe', 'Kona'], 'Kia': ['Sportage', 'Forte', 'Sorento', 'Telluride', 'Seltos'], 'Jeep': ['Wrangler', 'Grand Cherokee', 'Cherokee', 'Gladiator', 'Compass'] },
  '2022': { 'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma'], 'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'HR-V'], 'Ford': ['F-150', 'Mustang', 'Explorer', 'Bronco', 'Escape'], 'Chevrolet': ['Silverado', 'Equinox', 'Traverse', 'Malibu', 'Camaro'], 'BMW': ['3 Series', '5 Series', 'X3', 'X5', 'M4'], 'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE', 'A-Class'], 'Tesla': ['Model 3', 'Model Y', 'Model S', 'Model X'], 'Hyundai': ['Tucson', 'Sonata', 'Elantra', 'Santa Fe', 'Kona'], 'Kia': ['Sportage', 'Forte', 'Sorento', 'Telluride', 'Seltos'], 'Jeep': ['Wrangler', 'Grand Cherokee', 'Cherokee', 'Gladiator', 'Compass'] },
  '2021': { 'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma'], 'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'HR-V'], 'Ford': ['F-150', 'Mustang', 'Explorer', 'Bronco', 'Escape'], 'Chevrolet': ['Silverado', 'Equinox', 'Traverse', 'Malibu', 'Camaro'], 'BMW': ['3 Series', '5 Series', 'X3', 'X5', 'M4'], 'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE', 'A-Class'], 'Tesla': ['Model 3', 'Model Y', 'Model S', 'Model X'], 'Hyundai': ['Tucson', 'Sonata', 'Elantra', 'Santa Fe', 'Kona'], 'Kia': ['Sportage', 'Forte', 'Sorento', 'Telluride', 'Seltos'], 'Jeep': ['Wrangler', 'Grand Cherokee', 'Cherokee', 'Gladiator', 'Compass'] },
  '2020': { 'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma'], 'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'HR-V'], 'Ford': ['F-150', 'Mustang', 'Explorer', 'Escape'], 'Chevrolet': ['Silverado', 'Equinox', 'Traverse', 'Malibu', 'Camaro'], 'BMW': ['3 Series', '5 Series', 'X3', 'X5'], 'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE'], 'Tesla': ['Model 3', 'Model Y', 'Model S', 'Model X'], 'Hyundai': ['Tucson', 'Sonata', 'Elantra', 'Santa Fe'], 'Kia': ['Sportage', 'Forte', 'Sorento', 'Telluride'], 'Jeep': ['Wrangler', 'Grand Cherokee', 'Cherokee', 'Gladiator'] },
  '2019': { 'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma'], 'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot'], 'Ford': ['F-150', 'Mustang', 'Explorer', 'Escape'], 'Chevrolet': ['Silverado', 'Equinox', 'Traverse', 'Malibu'], 'BMW': ['3 Series', '5 Series', 'X3', 'X5'], 'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE'], 'Tesla': ['Model 3', 'Model S', 'Model X'], 'Hyundai': ['Tucson', 'Sonata', 'Elantra', 'Santa Fe'], 'Kia': ['Sportage', 'Forte', 'Sorento'], 'Jeep': ['Wrangler', 'Grand Cherokee', 'Cherokee'] },
  '2018': { 'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma'], 'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot'], 'Ford': ['F-150', 'Mustang', 'Explorer', 'Escape'], 'Chevrolet': ['Silverado', 'Equinox', 'Traverse', 'Malibu'], 'BMW': ['3 Series', '5 Series', 'X3', 'X5'], 'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE'], 'Tesla': ['Model 3', 'Model S', 'Model X'], 'Hyundai': ['Tucson', 'Sonata', 'Elantra', 'Santa Fe'], 'Kia': ['Sportage', 'Forte', 'Sorento'], 'Jeep': ['Wrangler', 'Grand Cherokee', 'Cherokee'] },
  '2017': { 'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma'], 'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot'], 'Ford': ['F-150', 'Mustang', 'Explorer', 'Escape'], 'Chevrolet': ['Silverado', 'Equinox', 'Traverse', 'Malibu'], 'BMW': ['3 Series', '5 Series', 'X3', 'X5'], 'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE'], 'Hyundai': ['Tucson', 'Sonata', 'Elantra', 'Santa Fe'], 'Kia': ['Sportage', 'Forte', 'Sorento'], 'Jeep': ['Wrangler', 'Grand Cherokee', 'Cherokee'] },
  '2016': { 'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma'], 'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot'], 'Ford': ['F-150', 'Mustang', 'Explorer', 'Escape'], 'Chevrolet': ['Silverado', 'Equinox', 'Traverse', 'Malibu'], 'Hyundai': ['Tucson', 'Sonata', 'Elantra', 'Santa Fe'], 'Kia': ['Sportage', 'Forte', 'Sorento'], 'Jeep': ['Wrangler', 'Grand Cherokee', 'Cherokee'] },
  '2015': { 'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma'], 'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot'], 'Ford': ['F-150', 'Mustang', 'Explorer', 'Escape'], 'Chevrolet': ['Silverado', 'Equinox', 'Traverse', 'Malibu'], 'Hyundai': ['Tucson', 'Sonata', 'Elantra', 'Santa Fe'], 'Kia': ['Sportage', 'Forte', 'Sorento'], 'Jeep': ['Wrangler', 'Grand Cherokee', 'Cherokee'] },
}
const VEHICLE_YEARS = Object.keys(VEHICLE_DATA).sort((a, b) => Number(b) - Number(a))

interface ProductDetailProps {
  product: Product
  onBack: () => void
  addToCart: (product: Product, qty: number, variantId?: number, variantPrice?: number) => void
  onCheckout: () => void
  waitlistSubmitted: Record<string, boolean>
  waitlistEmail: string
  setWaitlistEmail: (v: string) => void
  waitlistError: string
  setWaitlistError: (v: string) => void
  waitlistLoading: boolean
  waitlistCounts: Record<string, number>
  joinWaitlist: (product: Product) => void
  isWishlisted: boolean
  onToggleWishlist: (id: number) => void
  allProducts: Product[]
  onViewProduct: (p: Product) => void
}

export default function ProductDetail({
  product, onBack, addToCart, onCheckout,
  waitlistSubmitted, waitlistEmail, setWaitlistEmail,
  waitlistError, setWaitlistError, waitlistLoading,
  waitlistCounts, joinWaitlist,
  isWishlisted, onToggleWishlist,
  allProducts, onViewProduct,
}: ProductDetailProps) {
  const [qty, setQty] = useState(1)
  const [activeImgIdx, setActiveImgIdx] = useState(0)
  const [shareOpen, setShareOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'specs' | 'fitment' | 'reviews'>('specs')
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewHoverRating, setReviewHoverRating] = useState(0)
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewBody, setReviewBody] = useState('')
  const [reviewName, setReviewName] = useState('')
  const [reviewEmail, setReviewEmail] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [reviewSuccess, setReviewSuccess] = useState(false)
  const [lightBoxOpen, setLightBoxOpen] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const [isZooming, setIsZooming] = useState(false)
  const [viewerCount] = useState(() => Math.floor(Math.random() * 12) + 4)
  const [viewerFluctuation, setViewerFluctuation] = useState(0)
  const [recentPurchase, setRecentPurchase] = useState<{ name: string; city: string } | null>(null)
  const [showPurchaseToast, setShowPurchaseToast] = useState(false)
  const [addedToCart, setAddedToCart] = useState<number | null>(null)
  const [fitmentOpen, setFitmentOpen] = useState(false)
  const [fitmentYear, setFitmentYear] = useState('')
  const [fitmentMake, setFitmentMake] = useState('')
  const [fitmentModel, setFitmentModel] = useState('')

  useEffect(() => {
    if (addedToCart === null) return
    const t = setTimeout(() => setAddedToCart(null), 2000)
    return () => clearTimeout(t)
  }, [addedToCart])

  useEffect(() => {
    const interval = setInterval(() => {
      setViewerFluctuation(Math.floor(Math.random() * 5) - 2)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const names = ['Alex M.', 'Jordan K.', 'Sam T.', 'Casey R.', 'Morgan P.', 'Riley D.', 'Quinn L.']
      const cities = ['Dallas, TX', 'Phoenix, AZ', 'Denver, CO', 'Miami, FL', 'Seattle, WA', 'Chicago, IL', 'Atlanta, GA']
      setRecentPurchase({ name: names[Math.floor(Math.random() * names.length)], city: cities[Math.floor(Math.random() * cities.length)] })
      setShowPurchaseToast(true)
      setTimeout(() => setShowPurchaseToast(false), 5000)
    }, 12000 + Math.random() * 15000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    setQty(1)
    setActiveImgIdx(0)
    setActiveTab('specs')
    setShowReviewForm(false)
    setReviewSuccess(false)
    setReviewError('')
    setFitmentYear('')
    setFitmentMake('')
    setFitmentModel('')
    setFitmentOpen(false)
  }, [product.id])

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    product.options.forEach((opt) => { if (opt.values.length > 0) initial[opt.name] = opt.values[0] })
    return initial
  })

  const matchedVariant = useMemo(() => {
    return product.variants.find((v) => {
      return product.options.every((opt, i) => {
        const selected = selectedOptions[opt.name]
        const vOption = i === 0 ? v.option1 : i === 1 ? v.option2 : v.option3
        return !selected || vOption === selected
      })
    }) ?? product.variants[0]
  }, [product, selectedOptions])

  useEffect(() => {
    if (!matchedVariant) return
    const imgIdx = product.images.findIndex((img) => img.id === matchedVariant.imageId)
    if (imgIdx >= 0) setActiveImgIdx(imgIdx)
  }, [matchedVariant, product.images])

  useEffect(() => {
    let cancelled = false
    async function loadReviews() {
      setReviewLoading(true)
      try {
        const res = await fetch(`/api/reviews/${product.id}`)
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled) setReviewStats(data)
      } catch {} finally {
        if (!cancelled) setReviewLoading(false)
      }
    }
    loadReviews()
    return () => { cancelled = true }
  }, [product.id])

  const displayPrice = matchedVariant?.price ?? product.minPrice
  const displayCompareAt = getCompareAtPrice(product.variants)
  const displayDiscount = getDiscountPercent(displayPrice, displayCompareAt)
  const displayInStock = matchedVariant?.inStock ?? product.inStock

  const handleSubmitReview = async () => {
    if (!reviewRating || !reviewBody.trim()) { setReviewError('Rating and review text are required.'); return }
    if (!reviewEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reviewEmail)) { setReviewError('Valid email is required.'); return }
    setReviewSubmitting(true); setReviewError('')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: String(product.id), rating: reviewRating, title: reviewTitle.trim() || null, body: reviewBody.trim(), displayName: reviewName.trim() || 'Anonymous', email: reviewEmail.trim() }),
      })
      const data = await res.json()
      if (!res.ok) { setReviewError(data.error ?? 'Failed to submit review.'); return }
      setReviewSuccess(true)
      setReviewRating(0); setReviewTitle(''); setReviewBody(''); setReviewName(''); setReviewEmail('')
      const statsRes = await fetch(`/api/reviews/${product.id}`)
      if (statsRes.ok) setReviewStats(await statsRes.json())
    } catch { setReviewError('Network error — please try again.') } finally { setReviewSubmitting(false) }
  }

  const viewerDisplay = viewerCount + viewerFluctuation

  return (
    <>
      <div className="min-h-screen bg-zinc-950 text-white font-sans">
        <div className="bg-red-600 text-white text-xs font-semibold text-center py-2 tracking-wide">
          🚚 FREE SHIPPING on orders over $99 · Use code <span className="underline cursor-pointer">DRIVE20</span> for 20% off your first order
        </div>
        <header className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur border-b border-zinc-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16 gap-4">
              <button onClick={onBack} className="flex items-center gap-2.5 shrink-0">
                <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center">
                  <ChevronLeft size={20} className="text-white" />
                </div>
                <span className="text-xl font-black tracking-tight">DRIVE<span className="text-red-500">KIT</span></span>
              </button>
              <div className="flex items-center gap-3">
                <button onClick={onBack} className="text-sm text-zinc-400 hover:text-white transition-colors">Back to Store</button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-sm text-zinc-400 mb-8">
            <button onClick={onBack} className="hover:text-red-400 transition-colors">Home</button>
            <ChevronRight size={14} />
            <button onClick={() => { onBack(); setTimeout(() => {}, 0) }} className="hover:text-red-400 transition-colors">Products</button>
            <ChevronRight size={14} />
            <span className="text-zinc-200">{product.title.length > 60 ? product.title.slice(0, 60) + '…' : product.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
            {/* Image Gallery */}
            <div>
              <div
                className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden cursor-zoom-in aspect-square"
                onClick={() => setLightBoxOpen(true)}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  setZoomPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 })
                  setIsZooming(true)
                }}
                onMouseLeave={() => setIsZooming(false)}
              >
                {product.images[activeImgIdx] ? (
                  <img
                    src={product.images[activeImgIdx].src}
                    alt={product.images[activeImgIdx].alt}
                    className="w-full h-full object-contain p-6"
                    style={isZooming ? { transform: 'scale(2)', transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><span className="text-[120px]">🏎️</span></div>
                )}
                {!displayInStock && (
                  <div className="absolute inset-0 bg-zinc-900/70 flex items-center justify-center">
                    <span className="text-zinc-300 text-sm font-semibold tracking-widest uppercase">Out of Stock</span>
                  </div>
                )}
                {displayDiscount && displayDiscount > 0 && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                    Save {displayDiscount}%
                  </div>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id) }}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-zinc-900/80 border border-zinc-700 flex items-center justify-center hover:border-red-500 transition-colors"
                >
                  <Heart size={18} className={isWishlisted ? 'text-red-500 fill-red-500' : 'text-zinc-400'} />
                </button>
                <div className="absolute bottom-4 right-4 z-30">
                  <div className="relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); setShareOpen(!shareOpen) }}
                      className="w-10 h-10 rounded-full bg-zinc-900/80 border border-zinc-700 flex items-center justify-center hover:border-zinc-500 transition-colors"
                    >
                      <Share2 size={16} className="text-zinc-400" />
                    </button>
                    <ShareMenu product={product} isOpen={shareOpen} onClose={() => setShareOpen(false)} />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 bg-zinc-900/80 border border-zinc-700 rounded-full px-3 py-1.5 flex items-center gap-1.5">
                  <Eye size={13} className="text-zinc-400" />
                  <span className="text-zinc-300 text-xs font-medium">{viewerDisplay} viewing</span>
                </div>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {product.images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImgIdx(i)}
                      className={`w-16 h-16 rounded-lg border-2 overflow-hidden shrink-0 ${activeImgIdx === i ? 'border-red-500' : 'border-zinc-800 hover:border-zinc-600'}`}
                    >
                      <img src={img.src} alt="" className="w-full h-full object-contain p-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <p className="text-xs text-red-400 font-semibold uppercase tracking-widest mb-2">{product.vendor}</p>
              <h1 className="text-3xl font-black text-white mb-4 leading-tight">{product.title}</h1>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} className={i < Math.round(reviewStats?.average ?? 4) ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-700'} />
                  ))}
                </div>
                <span className="text-zinc-400 text-sm">({reviewStats?.count ?? 0} reviews)</span>
                {viewerFluctuation > 0 && <span className="text-emerald-400 text-xs font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />Trending</span>}
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-black text-white">${formatPrice(displayPrice)}</span>
                {displayCompareAt && displayCompareAt > displayPrice && (
                  <span className="text-zinc-500 text-lg line-through">${formatPrice(displayCompareAt)}</span>
                )}
                {displayDiscount && displayDiscount > 0 && (
                  <span className="text-emerald-400 text-sm font-bold">Save {displayDiscount}%</span>
                )}
              </div>

              {/* Options */}
              {product.options.length > 0 && product.options.some((o) => o.values.length > 1) && (
                <div className="space-y-4 mb-6">
                  {product.options.filter((opt) => opt.values.length > 1).map((opt) => (
                    <div key={opt.name}>
                      <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2">{opt.name}</p>
                      <div className="flex flex-wrap gap-2">
                        {opt.values.map((val) => (
                          <button
                            key={val}
                            onClick={() => setSelectedOptions((prev) => ({ ...prev, [opt.name]: val }))}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                              selectedOptions[opt.name] === val
                                ? 'bg-red-600 border-red-600 text-white'
                                : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500'
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity + Add to Cart */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-xl">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-11 h-11 flex items-center justify-center text-zinc-400 hover:text-white transition-colors rounded-l-xl"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center text-white font-bold text-sm">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(10, qty + 1))}
                    className="w-11 h-11 flex items-center justify-center text-zinc-400 hover:text-white transition-colors rounded-r-xl"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-zinc-500 text-sm hidden sm:inline">Max 10 per order</span>
                <button
                  onClick={() => { addToCart(product, qty, matchedVariant?.id, displayPrice); setAddedToCart(product.id) }}
                  disabled={!displayInStock}
                  className="flex-1 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} />
                  {addedToCart === product.id ? '✓ Added!' : `Add to Cart — $${(displayPrice * qty).toFixed(2)}`}
                </button>
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${
                    isWishlisted ? 'bg-red-600/10 border-red-600/50 text-red-500' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white'
                  }`}
                >
                  <Heart size={20} className={isWishlisted ? 'fill-red-500' : ''} />
                </button>
              </div>

              {displayInStock && (
                <div className="flex items-center gap-2 text-emerald-400 text-sm mb-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  In Stock — Ships within 24 hours
                </div>
              )}

              <div className="flex items-center gap-2 text-sm mb-6">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-zinc-300">{viewerDisplay} people viewing this right now</span>
              </div>

              {/* Waitlist */}
              {!displayInStock && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6">
                  {waitlistSubmitted[product.id] ? (
                    <div className="text-center">
                      <Check size={24} className="text-emerald-400 mx-auto mb-2" />
                      <p className="text-emerald-400 font-bold text-sm">You're on the waitlist!</p>
                      <p className="text-zinc-500 text-xs mt-1">We'll notify you when {product.title} is back ({waitlistCounts[product.id] ?? 0} people ahead)</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-white font-bold text-sm mb-1">Out of Stock — Join the Waitlist</p>
                      <p className="text-zinc-500 text-xs mb-3">Be the first to know when this item is available again.</p>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          placeholder="Your email"
                          value={waitlistEmail}
                          onChange={(e) => { setWaitlistEmail(e.target.value); setWaitlistError('') }}
                          onKeyDown={(e) => { if (e.key === 'Enter') joinWaitlist(product) }}
                          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
                        />
                        <button
                          onClick={() => joinWaitlist(product)}
                          disabled={waitlistLoading}
                          className="bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2"
                        >
                          {waitlistLoading ? <Loader2 size={14} className="animate-spin" /> : null}
                          Notify Me
                        </button>
                      </div>
                      {waitlistError && <p className="text-red-400 text-xs mt-2">{waitlistError}</p>}
                    </>
                  )}
                </div>
              )}

              {/* Trust signals */}
              <div className="grid grid-cols-3 gap-3 mt-auto">
                {[
                  { label: 'Free Shipping', sub: 'Over $99' },
                  { label: 'Fitment Guarantee', sub: 'Or full refund' },
                  { label: '2-Week Returns', sub: 'Hassle-free' },
                ].map(({ label, sub }) => (
                  <div key={label} className="text-center p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                    <p className="text-white text-xs font-bold">{label}</p>
                    <p className="text-zinc-500 text-[10px] mt-0.5">{sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Will this fit my car? */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl mb-8 overflow-hidden">
            <button
              onClick={() => setFitmentOpen(!fitmentOpen)}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-600/10 border border-red-600/30 rounded-xl flex items-center justify-center">
                  <Car size={24} className="text-red-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Will this fit my car?</h3>
                  <p className="text-zinc-500 text-sm">Check compatibility with your vehicle</p>
                </div>
              </div>
              <ChevronDown size={20} className={`text-zinc-400 transition-transform duration-300 ${fitmentOpen ? 'rotate-180' : ''}`} />
            </button>
            {fitmentOpen && (
              <div className="px-6 pb-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2 block">Year</label>
                    <select
                      value={fitmentYear}
                      onChange={(e) => { setFitmentYear(e.target.value); setFitmentMake(''); setFitmentModel('') }}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors appearance-none"
                    >
                      <option value="">Year</option>
                      {VEHICLE_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2 block">Make</label>
                    <select
                      value={fitmentMake}
                      onChange={(e) => { setFitmentMake(e.target.value); setFitmentModel('') }}
                      disabled={!fitmentYear}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors appearance-none disabled:opacity-40"
                    >
                      <option value="">Make</option>
                      {fitmentYear && Object.keys(VEHICLE_DATA[fitmentYear] ?? {}).sort().map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2 block">Model</label>
                    <select
                      value={fitmentModel}
                      onChange={(e) => setFitmentModel(e.target.value)}
                      disabled={!fitmentMake}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors appearance-none disabled:opacity-40"
                    >
                      <option value="">Model</option>
                      {fitmentMake && (VEHICLE_DATA[fitmentYear]?.[fitmentMake] ?? []).map((md) => <option key={md} value={md}>{md}</option>)}
                    </select>
                  </div>
                </div>
                {(fitmentYear || fitmentMake || fitmentModel) && (
                  <button
                    onClick={() => { setFitmentYear(''); setFitmentMake(''); setFitmentModel('') }}
                    className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
                  >
                    Reset selection
                  </button>
                )}
                {fitmentYear && fitmentMake && fitmentModel && (
                  <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Check size={16} className="text-emerald-400" />
                      <span className="text-emerald-400 font-bold text-sm">This product fits your vehicle</span>
                    </div>
                    <p className="text-emerald-400/70 text-sm">This accessory is compatible with your {fitmentYear} {fitmentMake} {fitmentModel}. Covered by our Fitment Guarantee.</p>
                  </div>
                )}
                {fitmentYear && fitmentMake && !fitmentModel && (
                  <div className="mt-4 p-4 bg-zinc-800 border border-zinc-700 rounded-xl">
                    <p className="text-zinc-400 text-sm">Select a model to check fitment.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="border-b border-zinc-800 mb-8">
            <div className="flex gap-0">
              {(['specs', 'fitment', 'reviews'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
                    activeTab === tab ? 'border-red-500 text-red-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {tab === 'specs' ? 'SPECS' : tab === 'fitment' ? 'FITMENT' : `REVIEWS (${reviewStats?.count ?? 0})`}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'specs' && (
            <div className="mb-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2">Brand</p>
                  <p className="text-white text-lg font-bold">{product.vendor}</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2">Product Type</p>
                  <p className="text-white text-lg font-bold">{product.productType || 'Automotive Part'}</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2">Color</p>
                  <p className="text-white text-lg font-bold">{matchedVariant?.option1 || matchedVariant?.option2 || 'N/A'}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2">Variants</p>
                  <p className="text-white text-lg font-bold">{product.variants.length} variants</p>
                  <p className="text-emerald-400 text-sm mt-1">{product.variants.filter(v => v.inStock).length} in stock</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2">SKU</p>
                  <p className="text-white text-lg font-bold">{matchedVariant?.sku || 'N/A'}</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2">Weight</p>
                  <p className="text-white text-lg font-bold">{matchedVariant?.weight ? `${matchedVariant.weight} ${matchedVariant.weightUnit}` : 'N/A'}</p>
                </div>
              </div>
              {product.tags.length > 0 && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-3">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-zinc-400 text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'fitment' && (
            <div className="mb-16">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-red-600/10 border border-red-600/30 rounded-xl flex items-center justify-center">
                    <Car size={24} className="text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Vehicle Fitment</h3>
                    <p className="text-zinc-500 text-sm">Check if this product fits your car</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2 block">Year</label>
                    <select
                      value={fitmentYear}
                      onChange={(e) => { setFitmentYear(e.target.value); setFitmentMake(''); setFitmentModel('') }}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors appearance-none"
                    >
                      <option value="">Select Year</option>
                      {VEHICLE_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2 block">Make</label>
                    <select
                      value={fitmentMake}
                      onChange={(e) => { setFitmentMake(e.target.value); setFitmentModel('') }}
                      disabled={!fitmentYear}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors appearance-none disabled:opacity-40"
                    >
                      <option value="">Select Make</option>
                      {fitmentYear && Object.keys(VEHICLE_DATA[fitmentYear] ?? {}).sort().map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2 block">Model</label>
                    <select
                      value={fitmentModel}
                      onChange={(e) => setFitmentModel(e.target.value)}
                      disabled={!fitmentMake}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors appearance-none disabled:opacity-40"
                    >
                      <option value="">Select Model</option>
                      {fitmentMake && (VEHICLE_DATA[fitmentYear]?.[fitmentMake] ?? []).map((md) => <option key={md} value={md}>{md}</option>)}
                    </select>
                  </div>
                </div>
                {(fitmentYear || fitmentMake || fitmentModel) && (
                  <button
                    onClick={() => { setFitmentYear(''); setFitmentMake(''); setFitmentModel('') }}
                    className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors mb-4"
                  >
                    Reset selection
                  </button>
                )}
                {fitmentYear && fitmentMake && fitmentModel && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Check size={16} className="text-emerald-400" />
                      <span className="text-emerald-400 font-bold text-sm">This product fits your vehicle</span>
                    </div>
                    <p className="text-emerald-400/70 text-sm">This accessory is compatible with your {fitmentYear} {fitmentMake} {fitmentModel}. Covered by our Fitment Guarantee.</p>
                  </div>
                )}
                <div className="mt-6 pt-6 border-t border-zinc-800">
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    This product is designed to fit most vehicles. If it doesn't fit your specific car, we'll replace it or give you a full refund — no questions asked. All products come with our Fitment Guarantee.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="mb-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
                  <p className="text-4xl font-black text-white mb-1">{reviewStats?.average?.toFixed(1) ?? '—'}</p>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className={i < Math.round(reviewStats?.average ?? 0) ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-700'} />
                    ))}
                  </div>
                  <p className="text-zinc-500 text-sm">{reviewStats?.count ?? 0} reviews</p>
                </div>
                <div className="md:col-span-2 space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviewStats?.distribution?.[star - 1] ?? 0
                    const total = reviewStats?.count ?? 1
                    return (
                      <div key={star} className="flex items-center gap-3">
                        <span className="text-zinc-400 text-sm w-8">{star}★</span>
                        <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${(count / total) * 100}%` }} />
                        </div>
                        <span className="text-zinc-500 text-xs w-8 text-right">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-bold">Customer Reviews</h3>
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Write a Review
                  </button>
                </div>

                {showReviewForm && (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
                    <h4 className="text-white font-bold mb-4">Write Your Review</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2">Rating *</p>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onMouseEnter={() => setReviewHoverRating(star)}
                              onMouseLeave={() => setReviewHoverRating(0)}
                              onClick={() => setReviewRating(star)}
                            >
                              <Star
                                size={24}
                                className={`transition-colors ${
                                  star <= (reviewHoverRating || reviewRating) ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-700'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2">Title (optional)</p>
                        <input
                          type="text"
                          value={reviewTitle}
                          onChange={(e) => setReviewTitle(e.target.value)}
                          placeholder="Summarize your experience"
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2">Review *</p>
                        <textarea
                          value={reviewBody}
                          onChange={(e) => setReviewBody(e.target.value)}
                          placeholder="Tell others about your experience with this product..."
                          rows={4}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2">Name</p>
                          <input
                            type="text"
                            value={reviewName}
                            onChange={(e) => setReviewName(e.target.value)}
                            placeholder="Your name"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
                          />
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2">Email *</p>
                          <input
                            type="email"
                            value={reviewEmail}
                            onChange={(e) => setReviewEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
                          />
                        </div>
                      </div>
                      {reviewError && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                          <p className="text-red-400 text-sm">{reviewError}</p>
                        </div>
                      )}
                      {reviewSuccess && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                          <p className="text-emerald-400 text-sm">Review submitted successfully! It may take a moment to appear.</p>
                        </div>
                      )}
                      <button
                        onClick={handleSubmitReview}
                        disabled={reviewSubmitting || !reviewRating || !reviewBody.trim()}
                        className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        {reviewSubmitting ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : 'Submit Review'}
                      </button>
                    </div>
                  </div>
                )}

                {reviewLoading ? (
                  <div className="text-center py-12">
                    <Loader2 size={24} className="text-zinc-600 animate-spin mx-auto" />
                    <p className="text-zinc-500 text-sm mt-3">Loading reviews...</p>
                  </div>
                ) : reviewStats?.reviews && reviewStats.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviewStats.reviews.map((review) => (
                      <div key={review.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center">
                              <span className="text-zinc-400 text-xs font-bold">{review.displayName.charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                              <p className="text-white text-sm font-medium">{review.displayName}</p>
                              <p className="text-zinc-500 text-xs">{new Date(review.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={12} className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-700'} />
                            ))}
                          </div>
                        </div>
                        {review.title && <p className="text-white font-bold text-sm mb-1">{review.title}</p>}
                        <p className="text-zinc-400 text-sm leading-relaxed">{review.body}</p>
                        {review.verified && (
                          <div className="flex items-center gap-1 mt-2">
                            <Check size={12} className="text-emerald-400" />
                            <span className="text-emerald-400 text-xs font-medium">Verified Purchase</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Star size={32} className="text-zinc-700 mx-auto mb-3" />
                    <p className="text-zinc-500 text-sm">No reviews yet. Be the first to review this product!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Related Products */}
          {(() => {
            const related = allProducts
              .filter((p) => p.id !== product.id && (p.productType === product.productType || p.tags.some((t) => product.tags.includes(t))))
              .slice(0, 4)
            if (related.length === 0) return null
            return (
              <div className="mb-16">
                <h3 className="text-white font-bold text-lg mb-6">Related Products</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {related.map((p) => {
                    const pCompareAt = getCompareAtPrice(p.variants)
                    const pDiscount = getDiscountPercent(p.minPrice, pCompareAt)
                    return (
                      <button
                        key={p.id}
                        onClick={() => onViewProduct(p)}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-red-600/50 transition-all text-left group"
                      >
                        <div className="h-32 bg-zinc-800 flex items-center justify-center overflow-hidden">
                          {p.images[0] ? (
                            <img src={p.images[0].src} alt={p.images[0].alt} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform" loading="lazy" />
                          ) : (
                            <span className="text-3xl text-zinc-600">🏎️</span>
                          )}
                          {pDiscount && pDiscount > 0 && (
                            <span className="absolute top-1.5 right-1.5 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">-{pDiscount}%</span>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-[10px] text-red-400 font-semibold uppercase tracking-wider mb-0.5">{p.vendor}</p>
                          <p className="text-white text-xs font-medium line-clamp-2 group-hover:text-red-100 transition-colors">{p.title}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-white font-bold text-sm">${formatPrice(p.minPrice)}</span>
                            {pCompareAt && pCompareAt > p.minPrice && (
                              <span className="text-zinc-600 text-[10px] line-through">${formatPrice(pCompareAt)}</span>
                            )}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })()}

          {/* Bundle */}
          {(() => {
            const related = allProducts
              .filter((p) => p.id !== product.id && (p.productType === product.productType || p.tags.some((t) => product.tags.includes(t))))
              .slice(0, 2)
            if (related.length === 0 || !displayInStock) return null
            return (
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-16">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingCart size={18} className="text-red-400" />
                  <h3 className="text-white font-bold">Bundle & Save</h3>
                </div>
                <p className="text-zinc-500 text-sm mb-4">Get this product with popular accessories at a discount.</p>
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="bg-zinc-800 border border-red-500/50 rounded-lg px-3 py-2 flex items-center gap-2">
                    <span className="text-white text-sm font-medium">{product.title.length > 30 ? product.title.slice(0, 30) + '…' : product.title}</span>
                    <span className="text-zinc-400 text-xs">${formatPrice(displayPrice)}</span>
                  </div>
                  {related.map((p) => (
                    <div key={p.id} className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 flex items-center gap-2">
                      <span className="text-zinc-300 text-sm">{p.title.length > 30 ? p.title.slice(0, 30) + '…' : p.title}</span>
                      <span className="text-zinc-500 text-xs">${formatPrice(p.minPrice)}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    addToCart(product, 1, matchedVariant?.id, displayPrice)
                    related.forEach((p) => addToCart(p, 1))
                  }}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors"
                >
                  Add Bundle to Cart
                </button>
              </div>
            )
          })()}
        </div>
      </div>

      {/* Lightbox */}
      {lightBoxOpen && (
        <div className="fixed inset-0 z-[200] bg-zinc-950/95 flex items-center justify-center p-4" onClick={() => setLightBoxOpen(false)}>
          <button onClick={() => setLightBoxOpen(false)} className="absolute top-4 right-4 text-white hover:text-zinc-300 transition-colors z-10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
          {product.images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveImgIdx((prev) => (prev === 0 ? product.images.length - 1 : prev - 1)) }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-zinc-800/80 hover:bg-zinc-700 rounded-full flex items-center justify-center text-white transition-colors z-10"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveImgIdx((prev) => (prev === product.images.length - 1 ? 0 : prev + 1)) }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-zinc-800/80 hover:bg-zinc-700 rounded-full flex items-center justify-center text-white transition-colors z-10"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
          <img
            src={product.images[activeImgIdx]?.src}
            alt={product.images[activeImgIdx]?.alt}
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {product.images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={(e) => { e.stopPropagation(); setActiveImgIdx(i) }}
                  className={`w-2 h-2 rounded-full transition-colors ${activeImgIdx === i ? 'bg-white' : 'bg-zinc-600 hover:bg-zinc-400'}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Purchase Toast */}
      {showPurchaseToast && recentPurchase && (
        <div className="fixed bottom-24 left-4 z-[90] bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3 animate-in slide-in-from-left">
          <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center shrink-0">
            <Check size={14} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">{recentPurchase.name} from {recentPurchase.city}</p>
            <p className="text-zinc-500 text-xs">just purchased this item</p>
          </div>
        </div>
      )}
    </>
  )
}
