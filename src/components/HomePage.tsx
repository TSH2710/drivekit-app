import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Truck, Shield, RotateCcw, Instagram, Facebook, Youtube, Mail, MapPin, Car, ArrowRight, ChevronUp } from 'lucide-react'

const CATEGORIES = [
  { name: 'Interior', icon: Car, subs: ['Seat Covers', 'Floor Mats', 'Steering Wheels', 'Dashboard'] },
  { name: 'Cleaning', icon: Car, subs: ['Car Wash', 'Polish', 'Vacuum', 'Wipes'] },
  { name: 'Electronics', icon: Car, subs: ['Dash Cam', 'GPS Tracker', 'Phone Holder', 'LED', 'Air Compressor'] },
  { name: 'Performance', icon: Car, subs: ['Exhaust', 'Air Filters', 'Suspension', 'Brakes'] },
]

interface Product {
  id: string
  title: string
  price: number
  compareAtPrice?: number
  image?: string
  category?: string
  tags?: string
  inventory: number
  isActive: boolean
  isFeatured: boolean
}

interface HomePageProps {
  products: Product[]
  onAddToCart: (p: Product) => void
  onNavigate: (tab: string, category?: string) => void
}

export function HomePage({ products, onAddToCart, onNavigate }: HomePageProps) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const activeProducts = products.filter(p => p.isActive)
  const totalStock = activeProducts.reduce((s, p) => s + (p.inventory || 0), 0)

  return (
    <div>
      <section className="relative overflow-hidden bg-zinc-900">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-900/80 to-transparent z-10" />
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-15">
          <svg viewBox="0 0 600 400" className="w-full h-full">
            <path d="M100 300 Q200 200 350 250 Q450 280 500 220 L520 230 Q480 310 350 340 Q200 360 100 300Z" fill="#e63946" opacity="0.3" />
            <path d="M150 310 Q250 240 380 270 Q440 285 470 250" fill="none" stroke="#e63946" strokeWidth="2" opacity="0.5" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-20">
          <p className="text-red-500 font-bold text-sm tracking-[0.3em] uppercase mb-4">Performance. Precision. Power.</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight mb-6">
            BUILT FOR<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500">SERIOUS</span><br />
            DRIVERS.
          </h1>
          <p className="text-lg text-zinc-400 mb-8 max-w-md">Premium car accessories for every ride.</p>
          <div className="flex flex-wrap gap-4 mb-12">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8" onClick={() => onNavigate('shop')}>
              Shop Now <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-zinc-600 text-white hover:bg-zinc-800" onClick={() => onNavigate('shop')}>
              Browse Catalog
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-8 max-w-lg border-t border-zinc-800 pt-8">
            <div>
              <p className="text-3xl font-black text-white">{activeProducts.length}</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Products Available</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">{totalStock}</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">In Stock Now</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">100%</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Fitment Guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {activeProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-red-500 font-bold text-xs tracking-[0.2em] uppercase mb-2">Featured</p>
              <h2 className="text-2xl font-black text-white">TOP PICKS</h2>
            </div>
            <Button variant="ghost" className="text-zinc-400 hover:text-white" onClick={() => onNavigate('shop')}>View All <ArrowRight className="w-4 h-4 ml-1" /></Button>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {activeProducts.slice(0, 8).map(product => (
              <div key={product.id} className="min-w-[220px] max-w-[220px] bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition flex-shrink-0">
                <div className="h-40 bg-zinc-800">
                  {product.image ? <img src={product.image} alt={product.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-600"><Car className="w-8 h-8" /></div>}
                </div>
                <div className="p-4">
                  <p className="text-[10px] text-red-500 font-bold tracking-wider uppercase">DRIVEKIT</p>
                  <h3 className="text-sm font-semibold text-white mt-1 line-clamp-2 min-h-[2.5rem]">{product.title}</h3>
                  <p className="text-lg font-bold text-white mt-2">${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeProducts.length === 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center bg-zinc-900 rounded-2xl border border-zinc-800 py-16">
            <Car className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400 text-lg">No products yet</p>
            <p className="text-zinc-600 text-sm mt-2">Click "Sync Shopify" in Admin to import products</p>
          </div>
        </section>
      )}

      <section className="border-t border-zinc-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-red-500 font-bold text-xs tracking-[0.2em] uppercase mb-3">WHY DRIVEKIT</p>
            <h2 className="text-3xl font-black text-white">The DriveKit Difference</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over $99. Nationwide coverage with real-time tracking.', color: 'text-red-500' },
              { icon: Shield, title: 'Fitment Guarantee', desc: "If a part doesn't fit your vehicle, we'll replace or refund it. No questions asked.", color: 'text-yellow-500' },
              { icon: RotateCcw, title: 'Easy 2-Week Returns', desc: 'Unused parts return within 14 days. Original packaging required.', color: 'text-blue-500' },
            ].map(item => (
              <div key={item.title} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center hover:border-zinc-700 transition">
                <div className="w-14 h-14 bg-zinc-800 rounded-xl flex items-center justify-center mx-auto mb-5">
                  <item.icon className={`w-7 h-7 ${item.color}`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800 py-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-500 font-bold text-xs tracking-[0.2em] uppercase mb-3">Stay in the Loop</p>
          <h2 className="text-2xl font-black text-white mb-3">GET EXCLUSIVE DEALS</h2>
          <p className="text-zinc-400 mb-6">Get early access to new products, exclusive discounts, and car accessory inspiration.</p>
          {subscribed ? (
            <p className="text-green-400 font-medium">Thanks for subscribing! 🎉</p>
          ) : (
            <div className="flex gap-3">
              <Input placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)} className="flex-1 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500" />
              <Button className="bg-red-600 hover:bg-red-700 px-6" onClick={() => { if (email) { setSubscribed(true); setEmail('') } }}>Subscribe</Button>
            </div>
          )}
          <p className="text-xs text-zinc-600 mt-3">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      <footer className="border-t border-zinc-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center"><Car className="w-4 h-4 text-white" /></div>
                <span className="font-black text-white text-lg">DRIVEKIT</span>
              </div>
              <p className="text-sm text-zinc-400 mb-4">Premium car accessories for every build. From interior upgrades to exterior enhancements.</p>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition"><Instagram className="w-4 h-4" /></a>
                <a href="#" className="w-9 h-9 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition"><Facebook className="w-4 h-4" /></a>
                <a href="#" className="w-9 h-9 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition"><Youtube className="w-4 h-4" /></a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Shop</h4>
              <div className="space-y-2.5">
                {['Trending Now', 'Best Sellers', 'Top Rated', 'New Arrivals', 'All Products'].map(link => (
                  <button key={link} onClick={() => onNavigate('shop')} className="block text-sm text-zinc-400 hover:text-white transition">{link}</button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Help</h4>
              <div className="space-y-2.5">
                {['Order Tracking', 'Returns & Refunds', 'Contact Us', 'FAQ'].map(link => (
                  <button key={link} onClick={() => onNavigate(link.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'))} className="block text-sm text-zinc-400 hover:text-white transition">{link}</button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Contact</h4>
              <div className="space-y-3 text-sm text-zinc-400">
                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-zinc-500" /> support.drivekit@gmail.com</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-zinc-500" /> Based in the U.S. — Ships Nationwide</div>
              </div>
            </div>
          </div>
          <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-zinc-600">© 2026 DriveKit. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-zinc-500">
              <button onClick={() => onNavigate('privacy')} className="hover:text-white transition">Privacy Policy</button>
              <button onClick={() => onNavigate('terms')} className="hover:text-white transition">Terms of Service</button>
              <button onClick={() => onNavigate('sitemap')} className="hover:text-white transition">Sitemap</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}