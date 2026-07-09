import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  ShoppingCart, Search, Menu, X, ChevronDown, Star, Truck, Shield,
  RotateCcw, Zap, ChevronRight, Mail, MapPin, Instagram,
  Facebook, Youtube, ArrowRight, Check, Tag, Gauge,
  Heart, ChevronLeft, Loader2, AlertCircle,
  UserRound, Package, GitCompareArrows, Columns,
} from 'lucide-react'

import {
  Product, Product as ProductType, ShopifyVariant,
  PRODUCTS_PER_PAGE, NAV_CATEGORIES, CATEGORIES, TRUST_ITEMS, PROMO_CODES, FREE_SHIPPING_THRESHOLD,
  formatPrice, getCompareAtPrice, getDiscountPercent,
} from './store/types'
import { ProductCard } from './store/ProductCard'
import ProductDetail from './store/ProductDetail'
import {
  OrderTrackingPage, ContactPage, ReturnsPage, CheckoutPage,
  OrderConfirmationPage, TermsPage, PrivacyPage, SitemapPage, NotFoundPage,
} from './store/PageViews'
import AdminDashboard from './AdminDashboard'
import MyOrders from './MyOrders'
import FAQ from './FAQ'

export default function DriveKitStore() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeNav, setActiveNav] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const trackRecentlyViewed = useCallback((product: Product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id)
      return [product, ...filtered].slice(0, 10)
    })
  }, [])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [siteContent, setSiteContent] = useState<Record<string, string>>({})
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false)
  const [newsletterLoading, setNewsletterLoading] = useState(false)
  const [newsletterError, setNewsletterError] = useState('')
  const [mobileExpandedNav, setMobileExpandedNav] = useState<string | null>(null)
  const [signInOpen, setSignInOpen] = useState(false)
  const [signUpOpen, setSignUpOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; name: string | null; role: string } | null>(null)
  const [authToken, setAuthToken] = useState<string | null>(null)
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authName, setAuthName] = useState('')
  const [authEmailOptIn, setAuthEmailOptIn] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [signupStep, setSignupStep] = useState<1 | 2>(1)
  const [verificationCode, setVerificationCode] = useState('')
  const [codeSentTo, setCodeSentTo] = useState('')
  const [currentView, setCurrentView] = useState<'home' | 'products' | 'order-tracking' | 'contact' | 'returns' | 'checkout' | 'admin' | 'my-orders' | 'terms' | 'privacy' | 'sitemap' | 'order-confirmation' | 'faq' | 'not-found'>('home')
  const [lastOrderNumber, setLastOrderNumber] = useState<string | null>(null)
  const [cartItems, setCartItems] = useState<{ product: Product; quantity: number; variantId?: number; variantPrice?: number }[]>(() => {
    try {
      const saved = localStorage.getItem('drivekit_cart')
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [promoInput, setPromoInput] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; label: string } | null>(null)
  const [promoError, setPromoError] = useState('')
  const [checkoutFirstName, setCheckoutFirstName] = useState('')
  const [checkoutLastName, setCheckoutLastName] = useState('')
  const [checkoutEmail, setCheckoutEmail] = useState('')
  const [checkoutAddress, setCheckoutAddress] = useState('')
  const [checkoutCity, setCheckoutCity] = useState('')
  const [checkoutState, setCheckoutState] = useState('')
  const [checkoutZip, setCheckoutZip] = useState('')
  const [waitlistEmail, setWaitlistEmail] = useState('')
  const [waitlistSubmitted, setWaitlistSubmitted] = useState<Record<string, boolean>>({})
  const [waitlistCounts, setWaitlistCounts] = useState<Record<string, number>>({})
  const [waitlistLoading, setWaitlistLoading] = useState(false)
  const [waitlistError, setWaitlistError] = useState('')
  const [wishlistedIds, setWishlistedIds] = useState<Set<number>>(new Set())
  const [trackOrderNum, setTrackOrderNum] = useState('')
  const [trackEmail, setTrackEmail] = useState('')
  const [trackLoading, setTrackLoading] = useState(false)
  const [trackError, setTrackError] = useState('')
  const [trackResult, setTrackResult] = useState<any>(null)
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'newest' | 'best-selling' | 'rating'>('default')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200])
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('drivekit_recently_viewed')
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })

  const [searchFocused, setSearchFocused] = useState(false)
  const [comparedIds, setComparedIds] = useState<Set<number>>(new Set())
  const [showComparison, setShowComparison] = useState(false)

  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const path = window.location.pathname.replace(/^\/+/, '').toLowerCase()
    const knownViews = ['products', 'checkout', 'order-tracking', 'contact', 'returns', 'admin', 'my-orders', 'terms', 'privacy', 'sitemap', 'faq']
    if (path && !knownViews.some((v) => path.startsWith(v)) && !/^\d+$/.test(path)) {
      setCurrentView('not-found')
    }
  }, [])
  const toggleWishlist = useCallback((productId: number) => {
    setWishlistedIds((prev) => {
      const next = new Set(prev)
      if (next.has(productId)) next.delete(productId)
      else next.add(productId)
      return next
    })
  }, [])

  const authHeaders = authToken ? { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' } : {}
  const toggleCompare = useCallback((productId: number) => {
    setComparedIds((prev) => {
      const next = new Set(prev)
      if (next.has(productId)) {
        next.delete(productId)
      } else {
        if (next.size >= 4) return prev
        next.add(productId)
      }
      return next
    })
  }, [])


  useEffect(() => {
    const savedToken = localStorage.getItem('drivekit_token')
    const savedUser = localStorage.getItem('drivekit_user')
    if (savedToken && savedUser) {
      try {
        setAuthToken(savedToken)
        setCurrentUser(JSON.parse(savedUser))
      } catch { localStorage.removeItem('drivekit_token'); localStorage.removeItem('drivekit_user') }
    }
  }, [])

  useEffect(() => {
    if (selectedProduct) trackRecentlyViewed(selectedProduct)
  }, [selectedProduct])

  useEffect(() => {
    try { localStorage.setItem('drivekit_recently_viewed', JSON.stringify(recentlyViewed)) } catch {}
  }, [recentlyViewed])

  const resetAuthForm = () => { setAuthEmail(''); setAuthPassword(''); setAuthName(''); setAuthEmailOptIn(true); setAuthError(''); setSignupStep(1); setVerificationCode(''); setCodeSentTo('') }

  const handleNewsletterSubscribe = async () => {
    if (!newsletterEmail.includes('@')) return
    setNewsletterLoading(true)
    setNewsletterError('')
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      })
      const data = await res.json()
      if (!res.ok) { setNewsletterError(data.error || 'Failed to subscribe'); return }
      setNewsletterSubmitted(true)
    } catch {
      setNewsletterError('Network error. Please try again.')
    } finally {
      setNewsletterLoading(false)
    }
  }

  const handleSignIn = async () => {
    setAuthLoading(true); setAuthError('')
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) { setAuthError(data.error || 'Sign in failed'); return }
      setAuthToken(data.token); setCurrentUser(data.user)
      localStorage.setItem('drivekit_token', data.token)
      localStorage.setItem('drivekit_user', JSON.stringify(data.user))
      setSignInOpen(false); resetAuthForm()
    } catch { setAuthError('Network error. Please try again.') }
    finally { setAuthLoading(false) }
  }

  const handleSignUp = async () => {
    setAuthLoading(true); setAuthError('')
    try {
      const res = await fetch('/api/auth/request-code', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword, name: authName || undefined, emailOptIn: authEmailOptIn }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) { setAuthError(data.error || 'Failed to send verification code'); return }
      setCodeSentTo(data.email || authEmail)
      setSignupStep(2)
    } catch { setAuthError('Network error. Please try again.') }
    finally { setAuthLoading(false) }
  }

  const handleConfirmSignup = async () => {
    setAuthLoading(true); setAuthError('')
    try {
      const res = await fetch('/api/auth/confirm-signup', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, code: verificationCode }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) { setAuthError(data.error || 'Verification failed'); return }
      setAuthToken(data.token); setCurrentUser(data.user)
      localStorage.setItem('drivekit_token', data.token)
      localStorage.setItem('drivekit_user', JSON.stringify(data.user))
      setSignUpOpen(false); resetAuthForm()
    } catch { setAuthError('Network error. Please try again.') }
    finally { setAuthLoading(false) }
  }

  const handleSignOut = async () => {
    if (authToken) {
      try { await fetch('/api/auth/signout', { method: 'POST', headers: { 'Authorization': `Bearer ${authToken}` } }) } catch {}
    }
    setCurrentUser(null); setAuthToken(null)
    localStorage.removeItem('drivekit_token'); localStorage.removeItem('drivekit_user')
  }

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const getCartItemPrice = (item: { product: Product; variantPrice?: number }) => item.variantPrice ?? item.product.minPrice
  const cartTotal = cartItems.reduce((sum, item) => sum + getCartItemPrice(item) * item.quantity, 0)
  const freeShippingProgress = Math.min(cartTotal / FREE_SHIPPING_THRESHOLD, 1)
  const amountToFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - cartTotal, 0)

  const addToCart = useCallback((product: Product, quantity: number = 1, variantId?: number, variantPrice?: number) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.variantId === variantId)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.variantId === variantId
            ? { ...item, quantity: Math.min(item.quantity + quantity, 10) }
            : item
        )
      }
      return [...prev, { product, quantity: Math.min(quantity, 10), variantId, variantPrice }]
    })
  }, [])

  const removeFromCart = useCallback((productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId))
  }, [])

  const updateCartQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.product.id !== productId))
      return
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, 10) }
          : item
      )
    )
  }, [])

  const joinWaitlist = useCallback(async (product: Product) => {
    const email = waitlistEmail.trim()
    if (!email) { setWaitlistError('Please enter your email'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setWaitlistError('Invalid email address'); return }
    setWaitlistLoading(true)
    setWaitlistError('')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase(), productId: String(product.id), productTitle: product.title }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) { setWaitlistError(body.error ?? `Failed (${res.status})`); return }
      setWaitlistSubmitted((prev) => ({ ...prev, [product.id]: true }))
      setWaitlistCounts((prev) => ({ ...prev, [product.id]: body.waitlistCount ?? 0 }))
    } catch {
      setWaitlistError('Network error — please try again')
    } finally {
      setWaitlistLoading(false)
    }
  }, [waitlistEmail])

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchProducts() {
      try {
        const res = await fetch('/api/shopify/products')
        const body = await res.json().catch(() => ({}))
        if (!res.ok) { setError(body.error ?? `HTTP ${res.status}`); return }
        if (!cancelled) setProducts(body.products ?? [])
      } catch (e) {
        if (!cancelled) setError('Failed to load products')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchProducts()

    return () => { cancelled = true }
  }, [])

  useEffect(() => { setCurrentPage(1) }, [searchQuery, activeCategory, priceRange])

  useEffect(() => {
    try { localStorage.setItem('drivekit_cart', JSON.stringify(cartItems)) } catch {}
  }, [cartItems])

  useEffect(() => {
    fetch('/api/site-content').then(r => r.json()).then(d => {
      if (d.content) setSiteContent(d.content)
    }).catch(() => {})
  }, [])

  const filteredProducts = (() => {
    let list = products.filter((p) => !p.hidden)
    if (activeCategory === 'Trending Now') list = [...list].sort(() => Math.random() - 0.5).slice(0, 12)
    else if (activeCategory === 'Best Sellers') list = [...list].sort((a, b) => b.variants.reduce((s, v) => s + v.inventoryQuantity, 0) - a.variants.reduce((s, v) => s + v.inventoryQuantity, 0)).slice(0, 15)
    else if (activeCategory === 'Top Rated') list = [...list].filter(p => p.inStock).sort((a, b) => { const aScore = a.variants.reduce((s, v) => s + v.inventoryQuantity, 0) + (getCompareAtPrice(a.variants) ? 50 : 0); const bScore = b.variants.reduce((s, v) => s + v.inventoryQuantity, 0) + (getCompareAtPrice(b.variants) ? 50 : 0); return bScore - aScore }).slice(0, 12)
    else if (activeCategory === 'New Arrivals') list = [...list].sort((a, b) => b.id - a.id).slice(0, 12)
    else if (activeCategory === 'Deals') list = list.filter((p) => getCompareAtPrice(p.variants) !== null && getCompareAtPrice(p.variants)! > p.minPrice)
    else if (activeCategory) {
      const catLower = activeCategory.toLowerCase()
      const subCatItems = NAV_CATEGORIES.find((c) => c.label === activeCategory)?.items ?? []
      list = list.filter((p) => {
        const haystack = [
          p.title,
          p.vendor,
          p.description,
          p.productType || '',
          ...p.tags,
        ].join(' ').toLowerCase()
        if (haystack.includes(catLower)) return true
        return subCatItems.some((item) => haystack.includes(item.toLowerCase()))
      })
    }
    list = list.filter((p) => p.minPrice >= priceRange[0] && p.minPrice <= priceRange[1])
    if (sortBy === 'price-asc') list = [...list].sort((a, b) => a.minPrice - b.minPrice)
    else if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.minPrice - a.minPrice)
    else if (sortBy === 'newest') list = [...list].reverse()
    else if (sortBy === 'best-selling') list = [...list].sort((a, b) => b.variants.reduce((s, v) => s + v.inventoryQuantity, 0) - a.variants.reduce((s, v) => s + v.inventoryQuantity, 0))
    const q = (searchQuery || '').toLowerCase().trim()
    if (!q) return list
    const words = q.split(/\s+/)
    return list.filter(
      (p) => {
        const haystack = [
          p.title,
          p.vendor,
          p.description,
          p.productType || '',
          ...p.tags,
        ].join(' ').toLowerCase()
        return words.every((w) => haystack.includes(w))
      }
    )
  })()

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE))
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE)

  const searchSuggestions = useMemo(() => {
    const q = (searchQuery || '').toLowerCase().trim()
    if (!q || q.length < 2) return []
    const words = q.split(/\s+/)
    const matches = products.filter((p) => {
      if (p.hidden) return false
      const haystack = [p.title, p.vendor, p.productType || '', ...p.tags].join(' ').toLowerCase()
      return words.every((w) => haystack.includes(w))
    })
    return matches.slice(0, 8)
  }, [searchQuery, products])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [selectedProduct?.id])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentView])

  const navigateHome = () => setCurrentView('home')
  const navigateShop = () => { setCurrentView('products'); setActiveCategory(null); setSearchQuery('') }

  // ── Product Detail View ──
  if (selectedProduct) {
    return <>
      <ProductDetail product={selectedProduct} onBack={() => setSelectedProduct(null)} addToCart={addToCart} onCheckout={() => { setSelectedProduct(null); setCurrentView('checkout') }} waitlistSubmitted={waitlistSubmitted} waitlistEmail={waitlistEmail} setWaitlistEmail={setWaitlistEmail} waitlistError={waitlistError} setWaitlistError={setWaitlistError} waitlistLoading={waitlistLoading} waitlistCounts={waitlistCounts} joinWaitlist={joinWaitlist} isWishlisted={wishlistedIds.has(selectedProduct.id)} onToggleWishlist={toggleWishlist} allProducts={products} onViewProduct={(p) => setSelectedProduct(p)} />
      {showBackToTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-6 right-6 z-[80] w-12 h-12 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/30 flex items-center justify-center transition-all duration-300 hover:scale-110" aria-label="Back to top">
          <ChevronLeft size={20} className="rotate-90" />
        </button>
      )}
    </>
  }

  // ── Page Views ──
  if (currentView === 'order-tracking') {
    return <OrderTrackingPage onHome={navigateHome} onShop={navigateShop} trackOrderNum={trackOrderNum} setTrackOrderNum={setTrackOrderNum} trackEmail={trackEmail} setTrackEmail={setTrackEmail} trackLoading={trackLoading} trackError={trackError} trackResult={trackResult} handleTrackOrder={async () => {
      if (!trackOrderNum.trim() || !trackEmail.trim()) { setTrackError('Please enter both order number and email.'); return }
      setTrackLoading(true); setTrackError(''); setTrackResult(null)
      try {
        const params = new URLSearchParams({ order_number: trackOrderNum.trim(), email: trackEmail.trim() })
        const res = await fetch(`/api/track-order?${params}`)
        const data = await res.json()
        if (!res.ok) { setTrackError(data.error ?? 'Order not found.'); return }
        setTrackResult(data.order)
      } catch { setTrackError('Network error — please try again.') } finally { setTrackLoading(false) }
    }} onContact={() => setCurrentView('contact')} />
  }
  if (currentView === 'contact') return <ContactPage onHome={navigateHome} onShop={navigateShop} />
  if (currentView === 'returns') return <ReturnsPage onHome={navigateHome} onShop={navigateShop} onContact={() => setCurrentView('contact')} />
  if (currentView === 'checkout') return <CheckoutPage onHome={navigateHome} onShop={navigateShop} cartItems={cartItems} cartTotal={cartTotal} cartCount={cartCount} appliedPromo={appliedPromo} promoInput={promoInput} setPromoInput={setPromoInput} promoError={promoError} setPromoError={setPromoError} setAppliedPromo={setAppliedPromo} FREE_SHIPPING_THRESHOLD={FREE_SHIPPING_THRESHOLD} freeShippingProgress={freeShippingProgress} amountToFreeShipping={amountToFreeShipping} checkoutFirstName={checkoutFirstName} setCheckoutFirstName={setCheckoutFirstName} checkoutLastName={checkoutLastName} setCheckoutLastName={setCheckoutLastName} checkoutEmail={checkoutEmail} setCheckoutEmail={setCheckoutEmail} checkoutAddress={checkoutAddress} setCheckoutAddress={setCheckoutAddress} checkoutCity={checkoutCity} setCheckoutCity={setCheckoutCity} checkoutState={checkoutState} setCheckoutState={setCheckoutState} checkoutZip={checkoutZip} setCheckoutZip={setCheckoutZip} updateCartQuantity={updateCartQuantity} removeFromCart={removeFromCart} currentUser={currentUser} authToken={authToken} setLastOrderNumber={setLastOrderNumber} setCartItems={setCartItems} />
  if (currentView === 'order-confirmation') return <OrderConfirmationPage onHome={navigateHome} onShop={navigateShop} lastOrderNumber={lastOrderNumber} cartItems={cartItems} setSelectedProduct={setSelectedProduct} setCurrentView={setCurrentView} setCartItems={setCartItems} setAppliedPromo={setAppliedPromo} setPromoInput={setPromoInput} />
  if (currentView === 'admin') return <AdminDashboard token={authToken} onBack={navigateHome} />
  if (currentView === 'my-orders') return <MyOrders token={authToken} onBack={navigateHome} />
  if (currentView === 'terms') return <TermsPage onHome={navigateHome} />
  if (currentView === 'privacy') return <PrivacyPage onHome={navigateHome} />
  if (currentView === 'sitemap') return <SitemapPage onHome={navigateHome} setCurrentView={setCurrentView} setSearchQuery={setSearchQuery} setActiveCategory={setActiveCategory} currentUser={currentUser} />
  if (currentView === 'faq') return <FAQ onBack={navigateHome} />
  if (currentView === 'not-found') return <NotFoundPage onHome={navigateHome} onShop={navigateShop} />

  // ── Main Layout ──
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[300] focus:bg-red-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:text-sm">Skip to main content</a>

      {/* ── Top Banner ── */}
      <div className="bg-red-600 text-white text-xs font-semibold text-center py-2 tracking-wide" role="banner">
        {siteContent['banner.text'] || '🚚 FREE SHIPPING on orders over $99 · Use code DRIVE20 for 20% off your first order'}
      </div>

      {/* ── Header / Nav ── */}
      <header className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            <button onClick={navigateHome} className="flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center"><Gauge size={20} className="text-white" /></div>
              <span className="text-xl font-black tracking-tight">DRIVE<span className="text-red-500">KIT</span></span>
            </button>

            <nav className="hidden lg:flex items-center gap-0 h-full" aria-label="Main navigation">
              <button onClick={navigateHome} className={`px-4 h-full text-sm font-semibold transition-colors hover:text-red-400 ${currentView === 'home' ? 'text-red-400' : 'text-zinc-300'}`}>Home</button>
              <button onClick={navigateShop} className={`px-4 h-full text-sm font-semibold transition-colors hover:text-red-400 ${currentView === 'products' ? 'text-red-400' : 'text-zinc-300'}`}>Shop</button>
              {NAV_CATEGORIES.map((cat) => (
                <div key={cat.label} className="relative h-full flex items-center">
                  <button onMouseEnter={() => setActiveNav(cat.label)} onMouseLeave={() => setActiveNav(null)} className={`flex items-center gap-1 px-4 h-full text-sm font-semibold transition-colors hover:text-red-400 ${activeNav === cat.label ? 'text-red-400' : 'text-zinc-300'}`}>
                    {cat.label}
                    <ChevronDown size={13} className={`transition-transform ${activeNav === cat.label ? 'rotate-180' : ''}`} />
                  </button>
                  {activeNav === cat.label && (
                    <div onMouseEnter={() => setActiveNav(cat.label)} onMouseLeave={() => setActiveNav(null)} className="absolute top-full left-0 w-52 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl py-2 z-50">
                      {cat.items.map((item) => (
                        <button key={item} onClick={() => { setSearchQuery(''); if (item === 'All Products') setActiveCategory(null); else setActiveCategory(item); setCurrentView('products'); setActiveNav(null) }} className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors">{item}</button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <button onClick={() => setCurrentView('order-tracking')} className="px-4 h-full text-sm font-semibold transition-colors hover:text-red-400 text-zinc-300">Track Order</button>
            </nav>

            <div className="flex items-center gap-3">
              <button onClick={() => setSearchOpen(!searchOpen)} aria-label={searchOpen ? 'Close search' : 'Open search'} aria-expanded={searchOpen} className="p-2 text-zinc-400 hover:text-white transition-colors"><Search size={19} /></button>
              <button onClick={() => setCurrentView('checkout')} aria-label={`Shopping cart, ${cartCount} items`} className="relative p-2 text-zinc-400 hover:text-white transition-colors">
                <ShoppingCart size={19} />
                {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-600 rounded-full text-white text-[10px] font-bold flex items-center justify-center" aria-hidden="true">{cartCount}</span>}
              </button>
              <button className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenuOpen}>
                {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
              </button>
              {currentUser ? (
                <div className="hidden lg:flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2">
                    <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center"><UserRound size={13} className="text-white" /></div>
                    <span className="text-sm text-zinc-300 font-medium max-w-[120px] truncate">{currentUser.name || currentUser.email}</span>
                  </div>
                  <button onClick={() => setCurrentView('my-orders')} className="text-zinc-500 hover:text-zinc-300 text-sm font-medium transition-colors">My Orders</button>
                  {(currentUser.role === 'OWNER' || currentUser.role === 'ADMIN') && <button onClick={() => setCurrentView('admin')} className="text-zinc-500 hover:text-red-400 text-sm font-medium transition-colors">Admin</button>}
                  <button onClick={handleSignOut} className="text-zinc-500 hover:text-red-400 text-sm font-medium transition-colors">Sign Out</button>
                </div>
              ) : (
                <button onClick={() => { resetAuthForm(); setSignInOpen(true) }} className="hidden lg:block bg-red-600 hover:bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">Sign In</button>
              )}
            </div>
          </div>

          {searchOpen && (
            <div className="pb-4 pt-1 relative">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input autoFocus type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); if (e.target.value && currentView !== 'products') setCurrentView('products') }} onInput={(e) => { const v = (e.target as HTMLInputElement).value; setSearchQuery(v); if (v && currentView !== 'products') setCurrentView('products') }} onFocus={() => setSearchFocused(true)} onBlur={() => setTimeout(() => setSearchFocused(false), 200)} placeholder="Search parts, brands, or vehicle model…" aria-label="Search products, brands, or vehicle model" aria-autocomplete="list" aria-controls={searchSuggestions.length > 0 ? 'search-suggestions' : undefined} className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors" />
              </div>
              {searchFocused && searchSuggestions.length > 0 && (
                <div id="search-suggestions" role="listbox" aria-label="Search suggestions" className="absolute left-4 right-4 mt-1 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl py-2 z-50 max-h-80 overflow-y-auto">
                  <p className="px-4 py-1.5 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Suggestions</p>
                  {searchSuggestions.map((p) => (
                    <button key={p.id} role="option" onMouseDown={() => { setSelectedProduct(p); setSearchOpen(false); setSearchQuery('') }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-800 transition-colors text-left">
                      <div className="w-10 h-10 bg-zinc-800 rounded-lg shrink-0 flex items-center justify-center overflow-hidden">
                        {p.images[0] ? <img src={p.images[0].src} alt="" className="w-full h-full object-contain p-0.5" /> : <span className="text-sm">🏎️</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{p.title}</p>
                        <p className="text-zinc-500 text-xs">{p.vendor} · ${formatPrice(p.minPrice)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-800 bg-zinc-900">
            <div className="px-4 py-3 border-b border-zinc-800/50">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && searchQuery.trim()) { setCurrentView('products'); setMobileMenuOpen(false) } }} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors" />
              </div>
            </div>
            <button onClick={() => { navigateHome(); setMobileMenuOpen(false) }} className="w-full text-left px-5 py-4 text-sm font-semibold text-zinc-200 border-b border-zinc-800/50 hover:bg-zinc-800">Home</button>
            <button onClick={() => { navigateShop(); setMobileMenuOpen(false) }} className="w-full text-left px-5 py-4 text-sm font-semibold text-zinc-200 border-b border-zinc-800/50 hover:bg-zinc-800">Shop All Products</button>
            {NAV_CATEGORIES.map((cat) => (
              <div key={cat.label} className="border-b border-zinc-800/50 last:border-0">
                <button onClick={() => setMobileExpandedNav(mobileExpandedNav === cat.label ? null : cat.label)} className="w-full text-left px-5 py-4 text-sm font-semibold text-zinc-200 flex items-center justify-between">
                  {cat.label}
                  <ChevronDown size={15} className={`text-zinc-500 transition-transform ${mobileExpandedNav === cat.label ? 'rotate-180' : ''}`} />
                </button>
                {mobileExpandedNav === cat.label && (
                  <div className="bg-zinc-950 border-t border-zinc-800/50 px-5 py-2">
                    {cat.items.map((item) => (
                      <button key={item} onClick={() => { setSearchQuery(''); if (item === 'All Products') setActiveCategory(null); else setActiveCategory(item); setCurrentView('products'); setMobileMenuOpen(false) }} className="w-full text-left py-2.5 text-sm text-zinc-400 hover:text-red-400 transition-colors">{item}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="border-t border-zinc-800/50 px-5 py-4">
              {currentUser ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-3"><div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center"><UserRound size={12} className="text-white" /></div><span className="text-sm text-zinc-300 font-medium truncate">{currentUser.name || currentUser.email}</span></div>
                  <button onClick={() => { setCurrentView('my-orders'); setMobileMenuOpen(false) }} className="w-full text-left py-2.5 text-sm text-zinc-400 hover:text-red-400 transition-colors">My Orders</button>
                  {(currentUser.role === 'OWNER' || currentUser.role === 'ADMIN') && <button onClick={() => { setCurrentView('admin'); setMobileMenuOpen(false) }} className="w-full text-left py-2.5 text-sm text-zinc-400 hover:text-red-400 transition-colors">Admin Dashboard</button>}
                  <button onClick={() => { handleSignOut(); setMobileMenuOpen(false) }} className="w-full text-left py-2.5 text-sm text-red-400 hover:text-red-300 transition-colors">Sign Out</button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button onClick={() => { resetAuthForm(); setSignInOpen(true); setMobileMenuOpen(false) }} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl text-sm transition-colors">Sign In</button>
                  <button onClick={() => { resetAuthForm(); setSignUpOpen(true); setMobileMenuOpen(false) }} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl text-sm transition-colors">Create Account</button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ── Hero ── */}
      {currentView === 'home' && (
      <section className="relative overflow-hidden bg-zinc-950 min-h-[580px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-transparent z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(220,38,38,0.15),transparent_60%)]" />
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-zinc-900 to-transparent" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[240px] leading-none opacity-10 select-none pointer-events-none z-0">🏎️</div>
        <div className="relative z-20 max-w-7xl mx-auto px-4 py-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-8 h-0.5 bg-red-500" />
              <span className="text-red-400 text-xs font-bold uppercase tracking-[0.3em]">{siteContent['hero.badge'] || 'Performance. Precision. Power.'}</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6 whitespace-pre-line">
              {(siteContent['hero.headline'] || 'BUILT FOR\nSERIOUS\nDRIVERS.').split('\n').map((line, i, arr) => (
                i === 1 ? <span key={i}><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">{line}</span><br /></span> : <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
              ))}
            </h1>
            <p className="text-zinc-400 text-lg leading-relaxed mb-8 max-w-lg">{siteContent['hero.description'] || "Premium car accessories for every ride. From interior comfort to exterior style, we've got what your car needs."}</p>
            <div className="flex flex-wrap gap-4">
              <button onClick={navigateShop} className="group bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-4 rounded-xl text-base transition-all flex items-center gap-2">{siteContent['hero.cta1'] || 'Shop Now'}<ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></button>
              <button onClick={() => { setSearchOpen(true); setCurrentView('products') }} className="border-2 border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-bold px-8 py-4 rounded-xl text-base transition-all">{siteContent['hero.cta2'] || 'Browse Catalog'}</button>
            </div>
            <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-zinc-800/50">
              {[{ value: `${products.length}`, label: 'Products Available' }, { value: `${products.filter(p => p.inStock).length}`, label: 'In Stock Now' }, { value: '100%', label: 'Fitment Guarantee' }].map(({ value, label }) => (
                <div key={label}><p className="text-white font-black text-2xl">{value}</p><p className="text-zinc-500 text-xs uppercase tracking-widest mt-0.5">{label}</p></div>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ── Promo Strip ── */}
      {currentView === 'home' && (
      <div className="bg-zinc-900 border-y border-zinc-800 overflow-hidden">
        <div className="flex items-center justify-center py-4 gap-12 px-4 max-w-7xl mx-auto">
          {['🚚 FREE SHIPPING on Orders Over $99', '✅ Fitment Guaranteed — We Verify Before We Ship', '🔄 2-Week Hassle-Free Returns'].map((item) => (
            <span key={item} className="text-zinc-400 text-sm whitespace-nowrap flex items-center gap-2">{item}</span>
          ))}
        </div>
      </div>
      )}

      {/* ── Shop By Category ── */}
      {currentView === 'home' && (
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-10">
          <div><p className="text-red-400 text-xs font-bold uppercase tracking-[0.3em] mb-2">Browse</p><h2 className="text-3xl font-black text-white">Shop by Category</h2></div>
          <button onClick={navigateShop} className="hidden sm:flex items-center gap-2 text-zinc-400 hover:text-red-400 transition-colors text-sm font-semibold group">All Categories <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map(({ icon: Icon, label, color, accent }) => (
            <button key={label} onClick={() => { setActiveCategory(activeCategory === label ? null : label); setCurrentView('products') }} className={`group relative bg-gradient-to-br ${color} border ${activeCategory === label ? 'border-red-500' : 'border-zinc-800 hover:border-zinc-600'} rounded-2xl p-6 text-left transition-all duration-300 hover:shadow-lg overflow-hidden`}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-white/5 to-transparent transition-opacity" />
              <Icon size={32} className={`${accent} mb-4`} />
              <h3 className="text-white font-bold text-lg leading-tight">{label}</h3>
              <p className="text-zinc-500 text-sm mt-1">Explore →</p>
              <ChevronRight size={16} className="absolute bottom-5 right-5 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
        <div className="mt-6 bg-gradient-to-r from-zinc-900 to-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="flex items-center gap-3 shrink-0"><Zap size={24} className="text-red-400" /><div><p className="text-white font-bold">Quick Shop</p><p className="text-zinc-500 text-sm">Jump straight to what you need</p></div></div>
            <div className="flex flex-wrap gap-2">
              {['Sun Shade', 'Dash Cam', 'Vacuum', 'Phone Holder', 'Oil Cooler', 'Air Compressor'].map((item) => (
                <button key={item} onClick={() => { setSearchQuery(item); setCurrentView('products') }} className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:border-red-500 hover:text-white text-sm font-medium transition-colors">{item}</button>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ── New Arrivals ── */}
      {currentView === 'home' && products.length > 0 && (() => {
        const newArrivals = [...products].filter(p => !p.hidden).sort((a, b) => b.id - a.id).slice(0, 6)
        if (newArrivals.length === 0) return null
        return (
          <section className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-8">
              <div><p className="text-emerald-400 text-xs font-bold uppercase tracking-[0.3em] mb-2">Just Dropped</p><h2 className="text-3xl font-black text-white">New Arrivals</h2></div>
              <button onClick={() => { setActiveCategory('New Arrivals'); setCurrentView('products'); window.scrollTo(0, 0) }} className="hidden sm:flex items-center gap-2 text-zinc-400 hover:text-emerald-400 transition-colors text-sm font-semibold group">View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {newArrivals.map((p) => (
                <button key={p.id} onClick={() => setSelectedProduct(p)} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-emerald-600/50 transition-all text-left group">
                  <div className="h-32 bg-zinc-800 flex items-center justify-center overflow-hidden">
                    {p.images[0] ? <img src={p.images[0].src} alt={p.images[0].alt} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform" loading="lazy" /> : <span className="text-3xl text-zinc-600">🏎️</span>}
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider mb-0.5">{p.vendor}</p>
                    <p className="text-white text-xs font-medium line-clamp-2 group-hover:text-emerald-100 transition-colors">{p.title}</p>
                    <p className="text-white font-bold text-sm mt-1">${formatPrice(p.minPrice)}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )
      })()}

      {/* ── Top Rated ── */}
      {currentView === 'home' && products.length > 0 && (() => {
        const topRated = [...products].filter(p => !p.hidden && p.inStock).sort((a, b) => {
          const aScore = a.variants.reduce((s, v) => s + v.inventoryQuantity, 0) + (getCompareAtPrice(a.variants) ? 50 : 0)
          const bScore = b.variants.reduce((s, v) => s + v.inventoryQuantity, 0) + (getCompareAtPrice(b.variants) ? 50 : 0)
          return bScore - aScore
        }).slice(0, 6)
        if (topRated.length === 0) return null
        return (
          <section className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-8">
              <div><p className="text-yellow-400 text-xs font-bold uppercase tracking-[0.3em] mb-2">Customer Favorites</p><h2 className="text-3xl font-black text-white">Top Rated</h2></div>
              <button onClick={() => { setActiveCategory('Top Rated'); setCurrentView('products'); window.scrollTo(0, 0) }} className="hidden sm:flex items-center gap-2 text-zinc-400 hover:text-yellow-400 transition-colors text-sm font-semibold group">View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {topRated.map((p) => {
                const compareAt = getCompareAtPrice(p.variants)
                const discount = getDiscountPercent(p.minPrice, compareAt)
                return (
                  <button key={p.id} onClick={() => setSelectedProduct(p)} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-yellow-600/50 transition-all text-left group">
                    <div className="relative h-32 bg-zinc-800 flex items-center justify-center overflow-hidden">
                      {p.images[0] ? <img src={p.images[0].src} alt={p.images[0].alt} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform" loading="lazy" /> : <span className="text-3xl text-zinc-600">🏎️</span>}
                      {discount && discount > 0 && <span className="absolute top-1.5 right-1.5 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">-{discount}%</span>}
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] text-yellow-400 font-semibold uppercase tracking-wider mb-0.5">{p.vendor}</p>
                      <p className="text-white text-xs font-medium line-clamp-2 group-hover:text-yellow-100 transition-colors">{p.title}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-white font-bold text-sm">${formatPrice(p.minPrice)}</span>
                        {compareAt && compareAt > p.minPrice && <span className="text-zinc-600 text-[10px] line-through">${formatPrice(compareAt)}</span>}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        )
      })()}

      {/* ── Recently Viewed ── */}
      {currentView === 'home' && recentlyViewed.length > 0 && (
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8"><div><p className="text-red-400 text-xs font-bold uppercase tracking-[0.3em] mb-2">Continue Browsing</p><h2 className="text-2xl font-black text-white">Recently Viewed</h2></div></div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {recentlyViewed.slice(0, 6).map((p) => (
            <button key={p.id} onClick={() => setSelectedProduct(p)} className="flex-shrink-0 w-48 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-red-600/50 transition-all text-left group">
              <div className="h-32 bg-zinc-800 flex items-center justify-center overflow-hidden">
                {p.images[0] ? <img src={p.images[0].src} alt={p.images[0].alt} className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform" loading="lazy" /> : <span className="text-3xl text-zinc-600">🏎️</span>}
              </div>
              <div className="p-3">
                <p className="text-xs text-red-400 font-semibold uppercase tracking-wider mb-0.5">{p.vendor}</p>
                <p className="text-white text-sm font-medium line-clamp-2 group-hover:text-red-100 transition-colors">{p.title}</p>
                <p className="text-white font-bold text-sm mt-1">${formatPrice(p.minPrice)}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
      )}

      {/* ── Featured Products ── */}
      {currentView === 'products' && (
      <section id="main-content" className="max-w-7xl mx-auto px-4 py-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-zinc-400">
            <li><button onClick={navigateHome} className="hover:text-red-400 transition-colors">Home</button></li>
            <li aria-hidden="true"><ChevronRight size={14} /></li>
            <li aria-current="page"><span className="text-zinc-200">{activeCategory ?? 'All Products'}</span></li>
          </ol>
        </nav>
        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." aria-label="Search products" className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-12 pr-10 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors" />
          {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"><X size={18} /></button>}
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => setActiveCategory(null)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeCategory === null ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700'}`}>All Products</button>
          {CATEGORIES.map(({ label }) => (
            <button key={label} onClick={() => setActiveCategory(activeCategory === label ? null : label)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeCategory === label ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700'}`}>{label}</button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-3">
            <label className="text-xs text-zinc-500 uppercase tracking-widest font-bold whitespace-nowrap">Sort by</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500 transition-colors">
              <option value="default">Default</option><option value="price-asc">Price: Low → High</option><option value="price-desc">Price: High → Low</option><option value="newest">Newest First</option><option value="best-selling">Best Selling</option>
            </select>
          </div>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <label className="text-xs text-zinc-500 uppercase tracking-widest font-bold whitespace-nowrap">Price</label>
            <div className="flex items-center gap-2 flex-1">
              <span className="text-zinc-400 text-sm">${priceRange[0]}</span>
              <input type="range" min={0} max={200} step={5} value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} className="flex-1 h-1.5 bg-zinc-700 rounded-full appearance-none cursor-pointer accent-red-500" />
              <span className="text-zinc-400 text-sm">${priceRange[1]}</span>
            </div>
            {priceRange[1] < 200 && <button onClick={() => setPriceRange([0, 200])} className="text-zinc-500 hover:text-red-400 transition-colors"><X size={14} /></button>}
          </div>
        </div>
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-red-400 text-xs font-bold uppercase tracking-[0.3em] mb-2">{activeCategory ?? 'All Products'}</p>
            <h2 className="text-3xl font-black text-white">{activeCategory ?? 'All Products'}</h2>
            {searchQuery && <p className="text-zinc-500 text-sm mt-1">{filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for "{searchQuery}"</p>}
          </div>
          <div className="flex items-center gap-3">
            {activeCategory && <button onClick={() => setActiveCategory(null)} className="text-zinc-400 hover:text-red-400 transition-colors text-sm font-semibold flex items-center gap-1"><X size={14} /> Clear Filter</button>}
            {searchQuery && <button onClick={() => setSearchQuery('')} className="text-zinc-400 hover:text-red-400 transition-colors text-sm font-semibold">Clear Search</button>}
          </div>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden animate-pulse">
                <div className="h-52 bg-zinc-800" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-zinc-800 rounded w-1/4" /><div className="h-4 bg-zinc-800 rounded w-3/4" /><div className="h-3 bg-zinc-800 rounded w-1/3" /><div className="h-6 bg-zinc-800 rounded w-1/3 mt-2" /><div className="h-10 bg-zinc-800 rounded-lg w-full mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4"><AlertCircle size={32} className="text-red-400" /><p className="text-red-400 text-sm font-semibold">{error}</p><p className="text-zinc-500 text-xs">Check your Shopify connection and try again.</p></div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4"><Search size={32} className="text-zinc-600" /><p className="text-zinc-400 text-sm">No products found.</p></div>
        ) : (
          <>
          <div key={`grid-${searchQuery}-${activeCategory}-${currentPage}`} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedProducts.map((p) => (
              <ProductCard key={p.handle || `product-${p.id}`} product={p} onClick={() => setSelectedProduct(p)} isWishlisted={wishlistedIds.has(p.id)} onToggleWishlist={toggleWishlist} isCompared={comparedIds.has(p.id)} onToggleCompare={toggleCompare} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-2 rounded-lg text-sm font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">← Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-lg text-sm font-bold transition-colors ${page === currentPage ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'}`}>{page}</button>
              ))}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-2 rounded-lg text-sm font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Next →</button>
            </div>
          )}
          {totalPages > 1 && <p className="text-center text-zinc-600 text-xs mt-3">Page {currentPage} of {totalPages} · Showing {paginatedProducts.length} of {filteredProducts.length} products</p>}
          </>
        )}
      </section>
      )}

      {/* ── Trust / Features Strip ── */}
      {currentView === 'home' && (
      <section className="bg-zinc-900 border-y border-zinc-800 py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12"><p className="text-red-400 text-xs font-bold uppercase tracking-[0.3em] mb-2">{siteContent['why.badge'] || 'Why DriveKit'}</p><h2 className="text-3xl font-black text-white">{siteContent['why.headline'] || 'The DriveKit Difference'}</h2></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_ITEMS.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="text-center p-6 rounded-2xl bg-zinc-950/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto mb-5"><Icon size={26} className={color} /></div>
                <h3 className="text-white font-bold text-base mb-2">{title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ── Newsletter ── */}
      {currentView === 'home' && (
      <section className="bg-gradient-to-br from-red-950/40 to-zinc-900 border-y border-zinc-800 py-14">
        <div className="max-w-xl mx-auto px-4 text-center">
          <Tag size={28} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-2">Get Exclusive Deals</h2>
          <p className="text-zinc-400 text-sm mb-6">Get early access to new products, exclusive discounts, and car accessory inspiration.</p>
          {newsletterSubmitted ? (
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold py-3"><Check size={18} /> You're on the list! Check your inbox.</div>
          ) : (
            <div className="flex gap-2">
              <input type="email" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && newsletterEmail.includes('@')) handleNewsletterSubscribe() }} placeholder="Your email address" className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors" />
              <button onClick={handleNewsletterSubscribe} disabled={!newsletterEmail.includes('@') || newsletterLoading} className="bg-red-600 hover:bg-red-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-bold px-5 py-3 rounded-xl text-sm transition-colors whitespace-nowrap">{newsletterLoading ? 'Subscribing…' : 'Subscribe'}</button>
            </div>
          )}
          {newsletterError && <p className="text-red-400 text-xs mt-2">{newsletterError}</p>}
          <p className="text-zinc-600 text-xs mt-3">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
      )}

      {/* ── Footer ── */}
      <footer className="bg-zinc-950 border-t border-zinc-800 pt-14 pb-8" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center"><Gauge size={17} className="text-white" /></div>
                <span className="font-black tracking-tight text-lg">DRIVE<span className="text-red-500">KIT</span></span>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed mb-4">Premium car accessories for every build. From interior upgrades to exterior enhancements.</p>
              <div className="flex gap-3">
                {[Instagram, Facebook, Youtube].map((Icon, i) => (
                  <button key={i} className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"><Icon size={16} /></button>
                ))}
              </div>
            </div>
            {[
              { title: 'Shop', links: ['Trending Now', 'Best Sellers', 'Top Rated', 'New Arrivals', 'All Products'] },
              { title: 'Help', links: ['Order Tracking', 'Returns & Refunds', 'Contact Us', 'FAQ'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">{title}</h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <button onClick={() => {
                        if (title === 'Shop') { if (link === 'All Products') { setActiveCategory(null); setSearchQuery('') } else setActiveCategory(link); setCurrentView('products') }
                        else if (link === 'Order Tracking') setCurrentView('order-tracking')
                        else if (link === 'Returns & Refunds') setCurrentView('returns')
                        else if (link === 'Contact Us') setCurrentView('contact')
                        else if (link === 'FAQ') setCurrentView('faq')
                      }} className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors text-left">{link}</button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-6 py-6 border-t border-zinc-800 border-b mb-6">
            {[{ icon: Mail, text: 'support.drivekit@gmail.com', href: 'mailto:support.drivekit@gmail.com' }, { icon: MapPin, text: 'Based in the U.S. — Ships Nationwide', href: null }].map(({ icon: Icon, text, href }) => (
              href ? <a key={text} href={href} className="flex items-center gap-2.5 text-zinc-500 hover:text-zinc-300 text-sm transition-colors"><Icon size={15} className="text-red-400" />{text}</a> : <div key={text} className="flex items-center gap-2.5 text-zinc-500 text-sm"><Icon size={15} className="text-red-400" />{text}</div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
            <p>{siteContent['footer.copyright'] || '© 2026 DriveKit. All rights reserved.'}</p>
            <div className="flex gap-5">
              {['Privacy Policy', 'Terms of Service', 'Sitemap'].map((link) => (
                <button key={link} onClick={() => { if (link === 'Privacy Policy') setCurrentView('privacy'); else if (link === 'Terms of Service') setCurrentView('terms'); else if (link === 'Sitemap') setCurrentView('sitemap'); window.scrollTo(0, 0) }} className="hover:text-zinc-400 transition-colors">{link}</button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ── Sign In Modal ── */}
      {signInOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={() => setSignInOpen(false)} />
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <button onClick={() => setSignInOpen(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 transition-colors"><X size={20} /></button>
            <div className="flex items-center gap-2.5 mb-6"><div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center"><Gauge size={16} className="text-white" /></div><span className="font-black tracking-tight">DRIVE<span className="text-red-500">KIT</span></span></div>
            <h2 className="text-2xl font-black text-white mb-1">Welcome back</h2>
            <p className="text-zinc-500 text-sm mb-6">Sign in to track orders, save builds, and get exclusive deals.</p>
            {authError && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl"><p className="text-red-400 text-sm">{authError}</p></div>}
            <div className="space-y-3">
              <input type="email" placeholder="Email address" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSignIn()} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors" />
              <input type="password" placeholder="Password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSignIn()} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors" />
              <button onClick={handleSignIn} disabled={authLoading} className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                {authLoading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : 'Sign In'}
              </button>
            </div>
            <div className="flex items-center gap-3 my-4"><div className="flex-1 h-px bg-zinc-800" /><span className="text-zinc-600 text-xs">or</span><div className="flex-1 h-px bg-zinc-800" /></div>
            <p className="text-center text-zinc-500 text-sm">Don't have an account? <button onClick={() => { setSignInOpen(false); resetAuthForm(); setSignUpOpen(true) }} className="text-red-400 hover:text-red-300 font-semibold transition-colors">Create one free</button></p>
          </div>
        </div>
      )}

      {/* ── Sign Up Modal ── */}
      {signUpOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={() => setSignUpOpen(false)} />
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <button onClick={() => setSignUpOpen(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 transition-colors"><X size={20} /></button>
            <div className="flex items-center gap-2.5 mb-6"><div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center"><Gauge size={16} className="text-white" /></div><span className="font-black tracking-tight">DRIVE<span className="text-red-500">KIT</span></span></div>
            {signupStep === 1 ? <><h2 className="text-2xl font-black text-white mb-1">Create your account</h2><p className="text-zinc-500 text-sm mb-6">Join DriveKit for exclusive deals, order tracking, and custom builds.</p></> : <><h2 className="text-2xl font-black text-white mb-1">Check your email ✉️</h2><p className="text-zinc-500 text-sm mb-6">We sent a 6-digit code to <span className="text-zinc-300 font-medium">{codeSentTo}</span>. Enter it below to verify your account.</p></>}
            {authError && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl"><p className="text-red-400 text-sm">{authError}</p></div>}
            {signupStep === 1 ? (
              <div className="space-y-3">
                <input type="text" placeholder="Your name (optional)" value={authName} onChange={(e) => setAuthName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSignUp()} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors" />
                <input type="email" placeholder="Email address" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSignUp()} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors" />
                <input type="password" placeholder="Password (min 6 characters)" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSignUp()} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors" />
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={authEmailOptIn} onChange={(e) => setAuthEmailOptIn(e.target.checked)} className="mt-0.5 w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-red-600 focus:ring-red-500 focus:ring-offset-0 cursor-pointer" />
                  <span className="text-xs text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">Send me exclusive deals, new product announcements, and car accessory tips. You can unsubscribe anytime.</span>
                </label>
                <button onClick={handleSignUp} disabled={authLoading} className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                  {authLoading ? <><Loader2 size={16} className="animate-spin" /> Sending code...</> : 'Continue'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <input type="text" inputMode="numeric" maxLength={6} placeholder="Enter 6-digit code" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))} onKeyDown={(e) => e.key === 'Enter' && handleConfirmSignup()} autoFocus className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors text-center text-2xl tracking-[0.5em] font-mono" />
                <button onClick={handleConfirmSignup} disabled={authLoading || verificationCode.length !== 6} className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                  {authLoading ? <><Loader2 size={16} className="animate-spin" /> Verifying...</> : 'Verify & Create Account'}
                </button>
                <button onClick={() => { setSignupStep(1); setVerificationCode(''); setAuthError('') }} className="w-full text-center text-zinc-500 hover:text-zinc-300 text-xs font-medium transition-colors py-1">← Back to sign up form</button>
              </div>
            )}
            <div className="flex items-center gap-3 my-4"><div className="flex-1 h-px bg-zinc-800" /><span className="text-zinc-600 text-xs">or</span><div className="flex-1 h-px bg-zinc-800" /></div>
            <p className="text-center text-zinc-500 text-sm">Already have an account? <button onClick={() => { setSignUpOpen(false); resetAuthForm(); setSignInOpen(true) }} className="text-red-400 hover:text-red-300 font-semibold transition-colors">Sign in</button></p>
          </div>
        </div>
      )}

      {/* ── Comparison Bar ── */}
      {comparedIds.size > 0 && !showComparison && (
        <div className="fixed bottom-0 left-0 right-0 z-[75] bg-zinc-900/95 backdrop-blur border-t border-zinc-800 shadow-2xl" role="complementary" aria-label="Product comparison bar">
          <div className="max-w-7xl mx-auto px-3 md:px-4 py-2.5 md:py-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <GitCompareArrows size={18} className="text-blue-400 shrink-0" />
                <span className="text-xs sm:text-sm text-zinc-300 font-medium">
                  <span className="text-white font-bold">{comparedIds.size}</span> product{comparedIds.size !== 1 ? 's' : ''} selected
                  {comparedIds.size < 2 && <span className="text-zinc-500 hidden sm:inline"> — select at least 2</span>}
                </span>
                <div className="hidden sm:flex items-center gap-2 ml-2">
                  {Array.from(comparedIds).map((id) => {
                    const p = products.find((x) => x.id === id)
                    if (!p) return null
                    return (
                      <div key={id} className="relative group/chip">
                        <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center overflow-hidden">
                          {p.images[0] ? <img src={p.images[0].src} alt="" className="w-full h-full object-contain p-0.5" /> : <span className="text-sm">🏎️</span>}
                        </div>
                        <button onClick={() => toggleCompare(id)} className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover/chip:opacity-100 transition-opacity" aria-label={`Remove ${p.title} from comparison`}>
                          <X size={10} className="text-white" />
                        </button>
                      </div>
                    )
                  })}
                  {comparedIds.size < 4 && <span className="text-zinc-600 text-xs">+{4 - comparedIds.size}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => setComparedIds(new Set())} className="text-zinc-500 hover:text-zinc-300 text-xs sm:text-sm font-medium px-2 sm:px-3 py-2 transition-colors">Clear</button>
                <button onClick={() => setShowComparison(true)} disabled={comparedIds.size < 2} className="bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-bold px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-2">
                  <Columns size={15} /> Compare
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Comparison Modal ── */}
      {showComparison && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto" role="dialog" aria-modal="true" aria-label="Product comparison">
          <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-sm" onClick={() => setShowComparison(false)} />
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-5xl my-4 md:my-8 mx-2 md:mx-4 shadow-2xl">
            <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between rounded-t-2xl z-10">
              <div className="flex items-center gap-2 md:gap-3"><Columns size={18} className="text-blue-400" /><h2 className="text-base md:text-xl font-black text-white">Compare</h2><span className="text-zinc-500 text-xs md:text-sm">({comparedIds.size})</span></div>
              <button onClick={() => setShowComparison(false)} className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors" aria-label="Close comparison"><X size={20} /></button>
            </div>
            <div className="p-3 md:p-6 overflow-x-auto -mx-2 md:mx-0 px-2 md:px-6">
              {(() => {
                const compared = Array.from(comparedIds).map((id) => products.find((x) => x.id === id)).filter(Boolean) as Product[]
                if (compared.length === 0) return <p className="text-zinc-500 text-sm text-center py-8">No products selected.</p>
                const allSpecs = ['Price', 'Brand', 'Product Type', 'SKU', 'In Stock', 'Variants', 'Weight', 'Tags']
                const getSpecValue = (p: Product, spec: string) => {
                  switch (spec) {
                    case 'Price': return `$${formatPrice(p.minPrice)}`
                    case 'Brand': return p.vendor
                    case 'Product Type': return p.productType || 'N/A'
                    case 'SKU': return p.variants[0]?.sku ?? 'N/A'
                    case 'In Stock': return p.inStock ? 'Yes' : 'No'
                    case 'Variants': return `${p.variants.length}`
                    case 'Weight': return p.variants[0]?.weight ? `${p.variants[0].weight} ${p.variants[0].weightUnit}` : 'N/A'
                    case 'Tags': return p.tags.join(', ') || 'None'
                    default: return 'N/A'
                  }
                }
                return (
                  <table className="w-full text-xs md:text-sm" role="table">
                    <thead>
                      <tr>
                        <th className="text-left text-zinc-500 uppercase tracking-widest text-[10px] md:text-xs font-bold py-2 md:py-3 pr-2 md:pr-4 w-16 md:w-32" scope="col">Spec</th>
                        {compared.map((p) => (
                          <th key={p.id} className="text-center py-2 md:py-3 px-2 md:px-3 min-w-[130px] md:min-w-[180px]" scope="col">
                            <div className="space-y-1.5 md:space-y-2">
                              <div className="w-14 h-14 md:w-20 md:h-20 bg-zinc-800 border border-zinc-700 rounded-lg md:rounded-xl mx-auto flex items-center justify-center overflow-hidden">
                                {p.images[0] ? <img src={p.images[0].src} alt={p.images[0].alt} className="w-full h-full object-contain p-0.5 md:p-1" /> : <span className="text-lg md:text-2xl">🏎️</span>}
                              </div>
                              <p className="text-white font-bold text-[10px] md:text-xs leading-tight line-clamp-2">{p.title}</p>
                              <button onClick={() => { setSelectedProduct(p); setShowComparison(false) }} className="text-red-400 hover:text-red-300 text-xs font-semibold transition-colors">View Details →</button>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {allSpecs.map((spec, idx) => (
                        <tr key={spec} className={idx % 2 === 0 ? 'bg-zinc-800/30' : ''}>
                          <td className="text-zinc-400 font-semibold py-2 md:py-3 pr-2 md:pr-4 text-[10px] md:text-xs uppercase tracking-wider">{spec}</td>
                          {compared.map((p) => {
                            const val = getSpecValue(p, spec)
                            const isLowest = spec === 'Price' && compared.every((x) => x.minPrice >= p.minPrice)
                            const isHighest = spec === 'Price' && compared.every((x) => x.minPrice <= p.minPrice)
                            return (
                              <td key={p.id} className="text-center py-2 md:py-3 px-2 md:px-3">
                                <span className={`font-medium ${spec === 'In Stock' ? (val === 'Yes' ? 'text-emerald-400' : 'text-red-400') : isLowest && compared.length > 1 ? 'text-emerald-400 font-bold' : isHighest && compared.length > 1 ? 'text-red-400' : 'text-zinc-200'}`}>{val}</span>
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ── Back to Top ── */}
      {showBackToTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`fixed right-4 md:right-6 z-[80] w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/30 flex items-center justify-center transition-all duration-300 hover:scale-110 ${comparedIds.size > 0 && !showComparison ? 'bottom-20 md:bottom-24' : 'bottom-4 md:bottom-6'}`} aria-label="Back to top">
          <ChevronLeft size={20} className="rotate-90" />
        </button>
      )}
    </div>
  )
}
