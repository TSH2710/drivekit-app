import {
  ShoppingCart, ChevronRight, Star, Truck, Shield, RotateCcw, Gauge,
  Mail, MapPin, ArrowRight, Check, Tag, Loader2, AlertCircle,
  Package, XCircle, CheckCircle, ArrowLeft, X, Minus, Plus,
} from 'lucide-react'
import { Product, PROMO_CODES, FREE_SHIPPING_THRESHOLD, formatPrice } from './types'
import AdminDashboard from '../AdminDashboard'
import MyOrders from '../MyOrders'
import FAQ from '../FAQ'

// ─── Shared Page Header ──────────────────────────────────────────────────────

function PageHeader({ onHome, onShop }: { onHome: () => void; onShop: () => void }) {
  return (
    <>
      <div className="bg-red-600 text-white text-xs font-semibold text-center py-2 tracking-wide">
        🚚 FREE SHIPPING on orders over $99 · Use code <span className="underline cursor-pointer">DRIVE20</span> for 20% off your first order
      </div>
      <header className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            <button onClick={onHome} className="flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center"><Gauge size={20} className="text-white" /></div>
              <span className="text-xl font-black tracking-tight">DRIVE<span className="text-red-500">KIT</span></span>
            </button>
            <div className="flex items-center gap-3">
              <button onClick={onHome} className="text-sm text-zinc-400 hover:text-white transition-colors">Home</button>
              <button onClick={onShop} className="text-sm text-zinc-400 hover:text-white transition-colors">Shop</button>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

function Breadcrumb({ items, onHome }: { items: string[]; onHome: () => void }) {
  return (
    <div className="flex items-center gap-2 text-sm text-zinc-400 mb-8">
      <button onClick={onHome} className="hover:text-red-400 transition-colors">Home</button>
      {items.map((item) => (
        <span key={item} className="flex items-center gap-2"><ChevronRight size={14} /><span className="text-zinc-200">{item}</span></span>
      ))}
    </div>
  )
}

// ─── Order Tracking ──────────────────────────────────────────────────────────

interface OrderTrackingProps {
  onHome: () => void
  onShop: () => void
  trackOrderNum: string
  setTrackOrderNum: (v: string) => void
  trackEmail: string
  setTrackEmail: (v: string) => void
  trackLoading: boolean
  trackError: string
  trackResult: any
  handleTrackOrder: () => void
  onContact: () => void
}

export function OrderTrackingPage({
  onHome, onShop, trackOrderNum, setTrackOrderNum, trackEmail, setTrackEmail,
  trackLoading, trackError, trackResult, handleTrackOrder, onContact,
}: OrderTrackingProps) {
  const TRACKING_STEPS = [
    { key: 'pending', label: 'Order Placed', icon: Package },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { key: 'processing', label: 'Processing', icon: Package },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      <PageHeader onHome={onHome} onShop={onShop} />
      <div className="max-w-xl mx-auto px-4 py-20">
        <Breadcrumb items={['Order Tracking']} onHome={onHome} />
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Truck size={28} className="text-red-400" />
            <h1 className="text-3xl font-black text-white">Track Your Order</h1>
          </div>
          <p className="text-zinc-400 text-sm mb-8">Enter your order number and email to see real-time shipping updates.</p>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2 block">Order Number</label>
              <input type="text" placeholder="e.g. #1001" value={trackOrderNum} onChange={(e) => { setTrackOrderNum(e.target.value) }} onKeyDown={(e) => e.key === 'Enter' && handleTrackOrder()} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors" />
            </div>
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2 block">Email Address</label>
              <input type="email" placeholder="The email used for your order" value={trackEmail} onChange={(e) => { setTrackEmail(e.target.value) }} onKeyDown={(e) => e.key === 'Enter' && handleTrackOrder()} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors" />
            </div>
            <button onClick={handleTrackOrder} disabled={trackLoading} className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors flex items-center justify-center gap-2">
              {trackLoading ? <><Loader2 size={16} className="animate-spin" /> Looking up...</> : 'Track Order'}
            </button>
          </div>
          {trackError && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl"><p className="text-red-400 text-sm">{trackError}</p></div>}
          {trackResult && (
            <div className="mt-6 border-t border-zinc-800 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-bold">{trackResult.orderNumber}</p>
                  <p className="text-xs text-zinc-500">{new Date(trackResult.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${trackResult.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400' : trackResult.status === 'shipped' ? 'bg-cyan-500/10 text-cyan-400' : trackResult.status === 'cancelled' || trackResult.status === 'refunded' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                  {trackResult.status.charAt(0).toUpperCase() + trackResult.status.slice(1)}
                </span>
              </div>
              {!trackResult.isCancelled ? (
                <div className="flex items-center justify-between mb-6 relative">
                  {TRACKING_STEPS.map((step, idx) => {
                    const completed = trackResult.trackingSteps?.[idx]?.completed
                    const isCurrent = completed && (idx === TRACKING_STEPS.length - 1 || !trackResult.trackingSteps?.[idx + 1]?.completed)
                    return (
                      <div key={step.key} className="flex flex-col items-center flex-1 relative">
                        {idx > 0 && <div className={`absolute top-4 right-1/2 w-full h-0.5 -z-0 ${completed ? 'bg-red-500' : 'bg-zinc-800'}`} />}
                        <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${completed ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-600'} ${isCurrent ? 'ring-2 ring-red-500/50 ring-offset-2 ring-offset-zinc-900' : ''}`}><step.icon size={14} /></div>
                        <p className={`text-[10px] mt-2 text-center font-medium ${completed ? 'text-zinc-300' : 'text-zinc-600'}`}>{step.label}</p>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="mb-6 flex items-center gap-2 p-3 bg-red-500/10 rounded-xl">
                  <XCircle size={16} className="text-red-400" />
                  <span className="text-sm text-red-400 font-medium">This order has been {trackResult.status}</span>
                </div>
              )}
              <div className="space-y-2 mb-3">
                {trackResult.items?.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-zinc-300">{item.title}{item.variantTitle && item.variantTitle !== 'Default Title' ? ` / ${item.variantTitle}` : ''} × {item.quantity}</span>
                    <span className="text-zinc-300 font-medium">${item.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-zinc-800 pt-3 mt-3 flex justify-between text-sm font-bold">
                <span>Total</span><span>${trackResult.total.toFixed(2)}</span>
              </div>
            </div>
          )}
          <div className="mt-8 pt-6 border-t border-zinc-800">
            <p className="text-zinc-500 text-sm mb-3">Need help?</p>
            <p className="text-zinc-400 text-sm">Email us at <button onClick={onContact} className="text-red-400 hover:text-red-300 transition-colors">support.drivekit@gmail.com</button> with your order details.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Contact ─────────────────────────────────────────────────────────────────

export function ContactPage({ onHome, onShop }: { onHome: () => void; onShop: () => void }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      <PageHeader onHome={onHome} onShop={onShop} />
      <div className="max-w-3xl mx-auto px-4 py-20">
        <Breadcrumb items={['Contact Us']} onHome={onHome} />
        <div className="text-center mb-12">
          <Mail size={32} className="text-red-400 mx-auto mb-4" />
          <h1 className="text-3xl font-black text-white mb-3">Get in Touch</h1>
          <p className="text-zinc-400 text-sm">Have a question about an order, a product, or just want to say hi? We'd love to hear from you.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {[
            { icon: Mail, title: 'Email', value: 'support.drivekit@gmail.com', href: 'mailto:support.drivekit@gmail.com', desc: 'We reply within 24 hours' },
            { icon: MapPin, title: 'Location', value: 'United States', href: null, desc: 'Ships nationwide' },
          ].map(({ icon: Icon, title, value, href, desc }) => (
            <div key={title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
              <Icon size={22} className="text-red-400 mx-auto mb-3" />
              <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold mb-1">{title}</p>
              {href ? <a href={href} className="text-white font-bold hover:text-red-400 transition-colors">{value}</a> : <p className="text-white font-bold">{value}</p>}
              <p className="text-zinc-500 text-xs mt-1">{desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-xl font-black text-white mb-6">Send Us a Message</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2 block">Name</label><input type="text" placeholder="Your name" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors" /></div>
              <div><label className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2 block">Email</label><input type="email" placeholder="your@email.com" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors" /></div>
            </div>
            <div><label className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2 block">Subject</label><input type="text" placeholder="How can we help?" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors" /></div>
            <div><label className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2 block">Message</label><textarea rows={4} placeholder="Tell us more..." className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors resize-none" /></div>
            <button className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-colors">Send Message</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Returns ─────────────────────────────────────────────────────────────────

export function ReturnsPage({ onHome, onShop, onContact }: { onHome: () => void; onShop: () => void; onContact: () => void }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      <PageHeader onHome={onHome} onShop={onShop} />
      <div className="max-w-3xl mx-auto px-4 py-20">
        <Breadcrumb items={['Returns & Refunds']} onHome={onHome} />
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4"><RotateCcw size={28} className="text-red-400" /><h1 className="text-3xl font-black text-white">Returns & Refunds</h1></div>
          <p className="text-zinc-400 text-sm leading-relaxed">We want you to love your purchase. If something isn't right, we've made returns simple.</p>
        </div>
        <div className="space-y-6">
          {[
            { title: '2-Week Return Window', desc: 'You have 14 days from the delivery date to initiate a return. Items must be unused, in their original packaging, and in resellable condition.' },
            { title: 'How to Start a Return', desc: 'Email support.drivekit@gmail.com with your order number and the item(s) you would like to return. We will send you a prepaid return label within 24 hours.' },
            { title: 'Fitment Guarantee', desc: 'If a part does not fit your vehicle, we will replace it or give you a full refund -- no restocking fee, no hassle. Just send us a photo and we will take care of it.' },
            { title: 'Refund Timeline', desc: 'Once we receive your return, we inspect it within 2 business days. Refunds are issued to your original payment method within 5-7 business days.' },
            { title: 'Exchanges', desc: 'Need a different size, color, or variant? Let us know in your return email and we will ship the replacement as soon as the return is in transit.' },
            { title: 'Non-Returnable Items', desc: 'Custom-painted items, special-order parts, and clearance items marked "Final Sale" cannot be returned unless defective.' },
          ].map(({ title, desc }) => (
            <div key={title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-white font-bold text-base mb-2">{title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
          <p className="text-zinc-400 text-sm mb-3">Still have questions about returns?</p>
          <button onClick={onContact} className="text-red-400 hover:text-red-300 font-bold text-sm transition-colors">Contact Our Team →</button>
        </div>
      </div>
    </div>
  )
}

// ─── Checkout ────────────────────────────────────────────────────────────────

interface CheckoutProps {
  onHome: () => void; onShop: () => void
  cartItems: { product: Product; quantity: number; variantId?: number; variantPrice?: number }[]
  cartTotal: number; cartCount: number
  appliedPromo: { code: string; discount: number; label: string } | null
  promoInput: string; setPromoInput: (v: string) => void
  promoError: string; setPromoError: (v: string) => void
  setAppliedPromo: (v: { code: string; discount: number; label: string } | null) => void
  FREE_SHIPPING_THRESHOLD: number; freeShippingProgress: number; amountToFreeShipping: number
  checkoutFirstName: string; setCheckoutFirstName: (v: string) => void
  checkoutLastName: string; setCheckoutLastName: (v: string) => void
  checkoutEmail: string; setCheckoutEmail: (v: string) => void
  checkoutAddress: string; setCheckoutAddress: (v: string) => void
  checkoutCity: string; setCheckoutCity: (v: string) => void
  checkoutState: string; setCheckoutState: (v: string) => void
  checkoutZip: string; setCheckoutZip: (v: string) => void
  updateCartQuantity: (id: number, qty: number) => void
  removeFromCart: (id: number) => void
  currentUser: any; authToken: string | null
  setLastOrderNumber: (v: string | null) => void
  setCartItems: (v: any) => void
}

export function CheckoutPage({
  onHome, onShop, cartItems, cartTotal, cartCount, appliedPromo,
  promoInput, setPromoInput, promoError, setPromoError, setAppliedPromo,
  freeShippingProgress, amountToFreeShipping,
  checkoutFirstName, setCheckoutFirstName, checkoutLastName, setCheckoutLastName,
  checkoutEmail, setCheckoutEmail, checkoutAddress, setCheckoutAddress,
  checkoutCity, setCheckoutCity, checkoutState, setCheckoutState,
  checkoutZip, setCheckoutZip, updateCartQuantity, removeFromCart,
  currentUser, authToken, setLastOrderNumber, setCartItems,
}: CheckoutProps) {
  const shippingCost = cartTotal >= 99 || (appliedPromo?.code === 'FREEBIE') ? 0 : 9.99
  const discountAmount = appliedPromo ? cartTotal * appliedPromo.discount : 0
  const discountedSubtotal = cartTotal - discountAmount
  const tax = discountedSubtotal * 0.08
  const orderTotal = discountedSubtotal + shippingCost + tax

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      <PageHeader onHome={onHome} onShop={onShop} />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Breadcrumb items={['Checkout']} onHome={onHome} />
        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart size={48} className="text-zinc-700 mx-auto mb-4" />
            <h1 className="text-2xl font-black text-white mb-2">Your cart is empty</h1>
            <p className="text-zinc-500 text-sm mb-6">Add some products before checking out.</p>
            <button onClick={onShop} className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">Browse Products</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <h1 className="text-3xl font-black text-white mb-2">Checkout</h1>
              <p className="text-zinc-500 text-sm mb-8">Fill in your shipping details to complete your order.</p>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
                <h2 className="text-white font-bold mb-4 flex items-center gap-2"><Truck size={18} className="text-red-400" /> Shipping Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2 block">First Name</label><input type="text" placeholder="John" value={checkoutFirstName} onChange={(e) => setCheckoutFirstName(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors" /></div>
                    <div><label className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2 block">Last Name</label><input type="text" placeholder="Doe" value={checkoutLastName} onChange={(e) => setCheckoutLastName(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors" /></div>
                  </div>
                  <div><label className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2 block">Email</label><input type="email" placeholder="john@example.com" value={checkoutEmail} onChange={(e) => setCheckoutEmail(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors" /></div>
                  <div><label className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2 block">Address</label><input type="text" placeholder="123 Main St" value={checkoutAddress} onChange={(e) => setCheckoutAddress(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors" /></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div><label className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2 block">City</label><input type="text" placeholder="Ankeny" value={checkoutCity} onChange={(e) => setCheckoutCity(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors" /></div>
                    <div><label className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2 block">State</label><input type="text" placeholder="IA" value={checkoutState} onChange={(e) => setCheckoutState(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors" /></div>
                    <div><label className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2 block">ZIP</label><input type="text" placeholder="50021" value={checkoutZip} onChange={(e) => setCheckoutZip(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors" /></div>
                  </div>
                  <div><label className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2 block">Phone (optional)</label><input type="tel" placeholder="(555) 123-4567" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors" /></div>
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h2 className="text-white font-bold mb-4 flex items-center gap-2"><Tag size={18} className="text-red-400" /> Promo Code</h2>
                <div className="flex gap-2">
                  <input type="text" placeholder="Enter code" value={promoInput} onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError('') }} className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors" />
                  <button onClick={() => {
                    const code = promoInput.trim().toUpperCase()
                    if (!code) { setPromoError('Please enter a code'); return }
                    if (appliedPromo?.code === code) { setPromoError('Code already applied'); return }
                    const match = PROMO_CODES[code]
                    if (match) { setAppliedPromo({ code, ...match }); setPromoError('') } else { setPromoError('Invalid promo code'); setAppliedPromo(null) }
                  }} className="bg-zinc-800 border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-bold px-5 py-3 rounded-xl text-sm transition-colors whitespace-nowrap">Apply</button>
                </div>
                {promoError && <p className="text-red-400 text-xs mt-2">{promoError}</p>}
                {appliedPromo && (
                  <div className="flex items-center justify-between mt-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /><span className="text-emerald-400 text-xs font-semibold">{appliedPromo.code}</span><span className="text-emerald-300/70 text-xs">— {appliedPromo.label}</span></div>
                    <button onClick={() => { setAppliedPromo(null); setPromoInput(''); setPromoError('') }} className="text-zinc-500 hover:text-red-400 transition-colors"><X size={14} /></button>
                  </div>
                )}
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-24">
                <h2 className="text-white font-bold mb-4">Order Summary</h2>
                {cartCount > 0 && (
                  <div className="mb-6 bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4">
                    {freeShippingProgress >= 1 ? (
                      <div className="flex items-center gap-2"><div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center"><Check size={14} className="text-emerald-400" /></div><span className="text-emerald-400 text-sm font-semibold">You've unlocked FREE shipping! 🎉</span></div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between text-sm mb-2"><span className="text-zinc-400">Add <span className="text-white font-bold">${amountToFreeShipping.toFixed(2)}</span> for FREE shipping</span><span className="text-zinc-500 text-xs">${cartTotal.toFixed(2)} / {FREE_SHIPPING_THRESHOLD}</span></div>
                        <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-500 ease-out" style={{ width: `${freeShippingProgress * 100}%` }} /></div>
                        <div className="flex items-center gap-1 mt-2"><Truck size={12} className="text-zinc-500" /><span className="text-zinc-600 text-xs">Free shipping on orders over ${FREE_SHIPPING_THRESHOLD}</span></div>
                      </>
                    )}
                  </div>
                )}
                <div className="space-y-4 mb-6 max-h-72 overflow-y-auto pr-1">
                  {cartItems.map(({ product, quantity, variantPrice }) => {
                    const itemPrice = variantPrice ?? product.minPrice
                    return (
                      <div key={product.id} className="flex gap-3 items-start">
                        <div className="w-14 h-14 bg-zinc-800 rounded-lg shrink-0 flex items-center justify-center overflow-hidden">
                          {product.images && product.images.length > 0 ? <img src={product.images[0].src} alt="" className="w-full h-full object-cover" /> : <span className="text-xl">🏎️</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{product.title}</p>
                          <p className="text-zinc-500 text-xs">${itemPrice.toFixed(2)} each</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <button onClick={() => updateCartQuantity(product.id, quantity - 1)} className="w-6 h-6 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 flex items-center justify-center text-xs transition-colors"><Minus size={12} /></button>
                            <span className="text-white text-xs font-bold w-5 text-center">{quantity}</span>
                            <button onClick={() => updateCartQuantity(product.id, quantity + 1)} className="w-6 h-6 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 flex items-center justify-center text-xs transition-colors"><Plus size={12} /></button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <p className="text-white text-sm font-bold">${(itemPrice * quantity).toFixed(2)}</p>
                          <button onClick={() => removeFromCart(product.id)} className="text-zinc-600 hover:text-red-400 transition-colors p-0.5"><X size={13} /></button>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="border-t border-zinc-800 pt-4 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-zinc-400">Subtotal</span><span className="text-zinc-200">${cartTotal.toFixed(2)}</span></div>
                  {appliedPromo && appliedPromo.discount > 0 && <div className="flex justify-between text-sm"><span className="text-emerald-400">Discount ({appliedPromo.code})</span><span className="text-emerald-400 font-semibold">-${discountAmount.toFixed(2)}</span></div>}
                  <div className="flex justify-between text-sm"><span className="text-zinc-400">Shipping</span><span className="text-zinc-200">{shippingCost === 0 ? <span className="text-emerald-400 font-semibold">FREE</span> : `$${shippingCost.toFixed(2)}`}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-zinc-400">Tax (est.)</span><span className="text-zinc-200">${tax.toFixed(2)}</span></div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-zinc-800"><span className="text-white">Total</span><span className="text-white">${orderTotal.toFixed(2)}</span></div>
                </div>
                <button
                  onClick={async () => {
                    const orderItems = cartItems.filter((item) => item.variantId).map((item) => ({ productId: String(item.product.id), variantId: String(item.variantId), title: item.product.title, variantTitle: item.product.variants.find((v) => v.id === item.variantId)?.title, quantity: item.quantity, price: item.variantPrice ?? item.product.minPrice }))
                    if (orderItems.length === 0) { alert('Some items are missing variant information. Please remove and re-add them.'); return }
                    const shipping = { name: `${checkoutFirstName} ${checkoutLastName}`.trim(), address1: checkoutAddress, city: checkoutCity, state: checkoutState, zip: checkoutZip, country: 'US' }
                    const orderEmail = checkoutEmail || currentUser?.email || ''
                    if (!orderEmail) { alert('Please enter your email address.'); return }
                    let placedOrderNumber: string | null = null
                    try {
                      const res = await fetch('/api/orders/place', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) }, body: JSON.stringify({ email: orderEmail, items: orderItems, shipping, promoCode: appliedPromo?.code, discount: discountAmount, total: orderTotal }) })
                      const orderData = await res.json()
                      placedOrderNumber = orderData?.order?.orderNumber ?? orderData?.orderNumber ?? null
                    } catch {}
                    const cart = cartItems.filter((item) => item.variantId).map((item) => ({ variantId: item.variantId!, quantity: item.quantity }))
                    const promoParam = appliedPromo ? `&promo=${encodeURIComponent(appliedPromo.code)}` : ''
                    try {
                      const res = await fetch(`/api/shopify/checkout?cart=${encodeURIComponent(JSON.stringify(cart))}${promoParam}`)
                      const body = await res.json()
                      if (body.url) { window.location.href = body.url; return }
                    } catch {}
                    setLastOrderNumber(placedOrderNumber)
                    // Need to set view — caller handles this via callback
                  }}
                  className="w-full mt-6 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-base transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={18} /> Place Order
                </button>
                <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-zinc-800">
                  <Shield size={16} className="text-zinc-600" />
                  <p className="text-zinc-600 text-xs">Secure checkout · SSL encrypted</p>
                </div>
                <div className="flex items-center justify-center gap-2 mt-3">
                  {[{ name: 'Visa', color: '#1A1F71', letters: 'VISA' }, { name: 'Mastercard', color: '#EB001B', letters: 'MC' }, { name: 'Amex', color: '#006FCF', letters: 'AMEX' }, { name: 'Discover', color: '#FF6000', letters: 'DISC' }].map((card) => (
                    <div key={card.name} className="bg-zinc-800 border border-zinc-700 rounded-md px-2.5 py-1.5 flex items-center justify-center" title={card.name}>
                      <span className="text-[10px] font-black tracking-wider" style={{ color: card.color }}>{card.letters}</span>
                    </div>
                  ))}
                  <div className="bg-zinc-800 border border-zinc-700 rounded-md px-2.5 py-1.5 flex items-center justify-center" title="Apple Pay"><span className="text-[10px] font-bold text-zinc-300"> Pay</span></div>
                  <div className="bg-zinc-800 border border-zinc-700 rounded-md px-2.5 py-1.5 flex items-center justify-center" title="Google Pay"><span className="text-[10px] font-bold text-zinc-300">GPay</span></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Order Confirmation ──────────────────────────────────────────────────────

interface OrderConfirmationProps {
  onHome: () => void; onShop: () => void
  lastOrderNumber: string | null
  cartItems: { product: Product; quantity: number }[]
  setSelectedProduct: (p: Product) => void
  setCurrentView: (v: any) => void
  setCartItems: (v: any) => void
  setAppliedPromo: (v: any) => void
  setPromoInput: (v: string) => void
}

export function OrderConfirmationPage({
  onHome, onShop, lastOrderNumber, cartItems,
  setSelectedProduct, setCurrentView, setCartItems, setAppliedPromo, setPromoInput,
}: OrderConfirmationProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      <PageHeader onHome={onHome} onShop={onShop} />
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-emerald-400" />
        </div>
        <h1 className="text-4xl font-black text-white mb-3">Order Confirmed!</h1>
        <p className="text-zinc-400 text-lg mb-2">Thank you for your purchase.</p>
        {lastOrderNumber && <p className="text-zinc-500 text-sm mb-8">Your order number is <span className="text-white font-bold">{lastOrderNumber}</span></p>}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8 text-left">
          <h2 className="text-white font-bold mb-3 flex items-center gap-2"><Mail size={16} className="text-red-400" /> What happens next?</h2>
          <ul className="space-y-3 text-sm text-zinc-400">
            <li className="flex items-start gap-3"><CheckCircle size={16} className="text-emerald-400 mt-0.5 shrink-0" /><span>You'll receive an order confirmation email shortly</span></li>
            <li className="flex items-start gap-3"><Package size={16} className="text-blue-400 mt-0.5 shrink-0" /><span>We'll process your order within 1-2 business days</span></li>
            <li className="flex items-start gap-3"><Truck size={16} className="text-cyan-400 mt-0.5 shrink-0" /><span>You'll get tracking info once your order ships</span></li>
          </ul>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => setCurrentView('order-tracking')} className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors"><Truck size={16} /> Track Order</button>
          <button onClick={() => setCurrentView('my-orders')} className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors"><Package size={16} /> My Orders</button>
          <button onClick={() => { setCurrentView('products'); setCartItems([]); setAppliedPromo(null); setPromoInput('') }} className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">Continue Shopping</button>
        </div>
        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
          <Star size={24} className="text-yellow-400 mx-auto mb-3" />
          <h3 className="text-white font-bold text-base mb-1">Love your purchase?</h3>
          <p className="text-zinc-500 text-sm mb-4">Share your experience — help other drivers make the right choice.</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {cartItems.map(({ product }) => (
              <button key={product.id} onClick={() => { setSelectedProduct(product); setCurrentView('home') }} className="text-sm bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-red-500 text-zinc-300 hover:text-white px-4 py-2 rounded-lg transition-colors">
                Review {product.title.length > 30 ? product.title.slice(0, 30) + '…' : product.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Terms / Privacy / Sitemap / NotFound ────────────────────────────────────

function InfoPage({ title, children, onHome }: { title: string; children: React.ReactNode; onHome: () => void }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <button onClick={onHome} className="flex items-center gap-2 text-zinc-500 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Store
        </button>
        <h1 className="text-3xl font-black mb-6">{title}</h1>
        <div className="space-y-6 text-zinc-400 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  )
}

export function TermsPage({ onHome }: { onHome: () => void }) {
  return (
    <InfoPage title="Terms of Service" onHome={onHome}>
      <p><strong className="text-zinc-200">Last updated:</strong> June 9, 2026</p>
      <div><h2 className="text-lg font-bold text-zinc-200 mb-2">1. Acceptance of Terms</h2><p>By accessing and using DriveKit, you accept and agree to be bound by these Terms of Service.</p></div>
      <div><h2 className="text-lg font-bold text-zinc-200 mb-2">2. Products and Purchases</h2><p>All products displayed on DriveKit are automotive lighting and accessories. Prices are listed in USD and are subject to change without notice.</p></div>
      <div><h2 className="text-lg font-bold text-zinc-200 mb-2">3. Orders and Payment</h2><p>By placing an order, you represent that all information provided is accurate. Payment is processed through Shopify's secure checkout system.</p></div>
      <div><h2 className="text-lg font-bold text-zinc-200 mb-2">4. Shipping and Delivery</h2><p>Free shipping is available on orders over $99. Standard shipping times vary by location.</p></div>
      <div><h2 className="text-lg font-bold text-zinc-200 mb-2">5. Returns and Exchanges</h2><p>Products may be returned within 14 days of purchase in their original packaging. Items must be unused and in resalable condition.</p></div>
      <div><h2 className="text-lg font-bold text-zinc-200 mb-2">6. Contact</h2><p>Questions about these Terms? Contact us at <span className="text-red-400">support.drivekit@gmail.com</span>.</p></div>
    </InfoPage>
  )
}

export function PrivacyPage({ onHome }: { onHome: () => void }) {
  return (
    <InfoPage title="Privacy Policy" onHome={onHome}>
      <p><strong className="text-zinc-200">Last updated:</strong> June 9, 2026</p>
      <div><h2 className="text-lg font-bold text-zinc-200 mb-2">1. Information We Collect</h2><p>We collect information you provide directly: name, email address, shipping address, and payment information.</p></div>
      <div><h2 className="text-lg font-bold text-zinc-200 mb-2">2. How We Use Your Information</h2><p>We use your information to process and fulfill orders, send order confirmations, provide customer support, and improve our services.</p></div>
      <div><h2 className="text-lg font-bold text-zinc-200 mb-2">3. Information Sharing</h2><p>We do not sell your personal information. We share data only with Shopify, shipping carriers, and analytics providers.</p></div>
      <div><h2 className="text-lg font-bold text-zinc-200 mb-2">4. Contact</h2><p>Questions about this policy? Contact us at <span className="text-red-400">support.drivekit@gmail.com</span>.</p></div>
    </InfoPage>
  )
}

export function SitemapPage({ onHome, setCurrentView, setSearchQuery, setActiveCategory, currentUser }: {
  onHome: () => void; setCurrentView: (v: any) => void; setSearchQuery: (v: string) => void; setActiveCategory: (v: string | null) => void; currentUser: any
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <button onClick={onHome} className="flex items-center gap-2 text-zinc-500 hover:text-white text-sm mb-8 transition-colors"><ArrowLeft size={16} /> Back to Store</button>
        <h1 className="text-3xl font-black mb-2">Sitemap</h1>
        <p className="text-zinc-500 text-sm mb-8">Find your way around DriveKit</p>
        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Shop</h2>
            <div className="space-y-2">
              {['All Products', 'Trending Now', 'Best Sellers', 'New Arrivals', 'Deals'].map((item) => (
                <button key={item} onClick={() => { setSearchQuery(''); setActiveCategory(item === 'All Products' ? null : item); setCurrentView('products'); window.scrollTo(0, 0) }} className="block text-sm text-zinc-500 hover:text-red-400 transition-colors">{item}</button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Pages</h2>
            <div className="space-y-2">
              {[{ label: 'Home', view: 'home' as const }, { label: 'Order Tracking', view: 'order-tracking' as const }, { label: 'Contact Us', view: 'contact' as const }, { label: 'Returns', view: 'returns' as const }].map((item) => (
                <button key={item.label} onClick={() => { setCurrentView(item.view); window.scrollTo(0, 0) }} className="block text-sm text-zinc-500 hover:text-red-400 transition-colors">{item.label}</button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Account</h2>
            <div className="space-y-2">
              {[
                currentUser ? { label: 'My Orders', view: 'my-orders' as const } : { label: 'Sign In', view: 'home' as const },
                { label: 'Privacy Policy', view: 'privacy' as const },
                { label: 'Terms of Service', view: 'terms' as const },
              ].map((item) => (
                <button key={item.label} onClick={() => { setCurrentView(item.view); window.scrollTo(0, 0) }} className="block text-sm text-zinc-500 hover:text-red-400 transition-colors">{item.label}</button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Support</h2>
            <div className="space-y-2">
              <p className="text-sm text-zinc-500">Email: <span className="text-zinc-300">support.drivekit@gmail.com</span></p>
              <p className="text-sm text-zinc-500">Hours: <span className="text-zinc-300">Mon–Fri, 8am–6pm CST</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function NotFoundPage({ onHome, onShop }: { onHome: () => void; onShop: () => void }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex items-center justify-center">
      <div className="text-center px-4 max-w-md">
        <div className="text-[120px] font-black text-zinc-800 leading-none select-none">404</div>
        <h1 className="text-2xl font-black text-white mb-2 -mt-4">Page Not Found</h1>
        <p className="text-zinc-500 text-sm mb-8 leading-relaxed">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button onClick={() => { onHome(); window.history.pushState({}, '', '/') }} className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors w-full sm:w-auto">← Back to Home</button>
          <button onClick={() => { onShop(); window.history.pushState({}, '', '/products') }} className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors w-full sm:w-auto">Browse Products</button>
        </div>
      </div>
    </div>
  )
}
