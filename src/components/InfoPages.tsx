import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, ChevronDown, ChevronRight, Car, Instagram, Facebook, Youtube, Mail, MapPin } from 'lucide-react'

interface InfoPagesProps { page: string; onNavigate: (tab: string) => void }

export function InfoPages({ page, onNavigate }: InfoPagesProps) {
  if (page === 'returns') return <ReturnsPage onNavigate={onNavigate} />
  if (page === 'faq') return <FAQPage onNavigate={onNavigate} />
  if (page === 'sitemap') return <SitemapPage onNavigate={onNavigate} />
  if (page === 'privacy') return <PolicyPage title="Privacy Policy" onNavigate={onNavigate} />
  if (page === 'terms') return <PolicyPage title="Terms of Service" onNavigate={onNavigate} />
  if (page === 'track-order') return <TrackOrderPage onNavigate={onNavigate} />
  return null
}

function BackLink({ onNavigate }: { onNavigate: (t: string) => void }) {
  return <button onClick={() => onNavigate('home')} className="flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition"><ArrowLeft className="w-4 h-4" /> Back to Store</button>
}

function ReturnsPage({ onNavigate }: { onNavigate: (t: string) => void }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <BackLink onNavigate={onNavigate} />
      <h1 className="text-3xl font-black text-white mb-2">Returns & Refunds</h1>
      <p className="text-zinc-400 mb-8">We want you to love your purchase. If something isn't right, we've made returns simple.</p>
      {[
        { title: '2-Week Return Window', desc: 'You have 14 days from the delivery date to initiate a return. Items must be unused, in their original packaging, and in resellable condition.' },
        { title: 'How to Start a Return', desc: 'Email support.drivekit@gmail.com with your order number and the item(s) you would like to return. We will send you a prepaid return label within 24 hours.' },
        { title: 'Fitment Guarantee', desc: 'If a part does not fit your vehicle, we will replace it or give you a full refund -- no restocking fee, no hassle. Just send us a photo and we will take care of it.' },
        { title: 'Refund Timeline', desc: 'Once we receive your return, we inspect it within 2 business days. Refunds are issued to your original payment method within 5-7 business days.' },
      ].map(item => (
        <div key={item.title} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-4">
          <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  )
}

function FAQPage({ onNavigate }: { onNavigate: (t: string) => void }) {
  const [openQ, setOpenQ] = useState<string | null>(null)

  const sections = [
    { title: 'Shipping & Delivery', questions: [
      { q: 'How long does shipping take?', a: 'Standard shipping takes 5-7 business days. Express shipping (2-day) is available for $9.99.' },
      { q: 'How do I track my order?', a: 'You\'ll receive a tracking number via email once your order ships. You can also check your order status in My Orders.' },
      { q: 'Can I change or cancel my order?', a: 'Orders can be modified or cancelled within 2 hours of placement. After that, we begin processing for shipment.' },
      { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, American Express, Discover, Apple Pay, Google Pay, and PayPal.' },
    ]},
    { title: 'Fitment & Compatibility', questions: [
      { q: 'How do I know if a product fits my car?', a: 'Each product page lists compatible vehicles. If you\'re unsure, contact us with your year, make, and model.' },
      { q: 'What if a product doesn\'t fit my vehicle?', a: 'We offer a fitment guarantee. If it doesn\'t fit, we\'ll replace it or give you a full refund.' },
      { q: 'Do you sell universal-fit products?', a: 'Yes! Many of our accessories are universal-fit. Check the product description for details.' },
    ]},
    { title: 'Returns & Refunds', questions: [
      { q: 'What is your return policy?', a: 'You can return unused items within 14 days of delivery. Items must be in original packaging.' },
      { q: 'How long do refunds take?', a: 'Refunds are processed within 5-7 business days after we receive the return.' },
    ]},
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <BackLink onNavigate={onNavigate} />
      <h1 className="text-3xl font-black text-white mb-2">Frequently Asked Questions</h1>
      <p className="text-zinc-400 mb-8">Everything you need to know about DriveKit.</p>
      {sections.map(section => (
        <div key={section.title} className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><span className="text-red-500">•</span> {section.title}</h2>
          {section.questions.map(({ q, a }) => (
            <div key={q} className="border border-zinc-800 rounded-xl mb-2 overflow-hidden">
              <button onClick={() => setOpenQ(openQ === q ? null : q)} className="w-full flex items-center justify-between p-4 text-left text-white hover:bg-zinc-900 transition">
                <span className="font-medium">{q}</span>
                <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform ${openQ === q ? 'rotate-180' : ''}`} />
              </button>
              {openQ === q && <div className="px-4 pb-4 text-sm text-zinc-400 leading-relaxed">{a}</div>}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function SitemapPage({ onNavigate }: { onNavigate: (t: string) => void }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <BackLink onNavigate={onNavigate} />
      <h1 className="text-3xl font-black text-white mb-2">Sitemap</h1>
      <p className="text-zinc-400 mb-8">Find your way around DriveKit</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {[
          { title: 'SHOP', links: ['All Products', 'Trending Now', 'Best Sellers', 'New Arrivals', 'Deals'] },
          { title: 'PAGES', links: ['Home', 'Order Tracking', 'Contact Us', 'Returns & Exchanges'] },
          { title: 'ACCOUNT', links: ['My Orders', 'Privacy Policy', 'Terms of Service'] },
          { title: 'SUPPORT', links: ['Email: support.drivekit@gmail.com', 'Hours: Mon–Fri, 8am–6pm CST'] },
        ].map(col => (
          <div key={col.title}>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">{col.title}</h3>
            <div className="space-y-2.5">
              {col.links.map(link => <p key={link} className="text-sm text-zinc-400 hover:text-white transition cursor-pointer">{link}</p>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TrackOrderPage({ onNavigate }: { onNavigate: (t: string) => void }) {
  const [orderId, setOrderId] = useState('')
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <BackLink onNavigate={onNavigate} />
      <h1 className="text-3xl font-black text-white mb-2">Track Your Order</h1>
      <p className="text-zinc-400 mb-8">Enter your order number to check the status.</p>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <div className="flex gap-3">
          <Input placeholder="Order number (e.g. DK-44704)" value={orderId} onChange={e => setOrderId(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white" />
          <Button className="bg-red-600 hover:bg-red-700">Track</Button>
        </div>
        {orderId && (
          <div className="mt-6 p-4 bg-zinc-800 rounded-xl">
            <p className="text-zinc-400 text-sm">No order found with that number. Please check and try again.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function PolicyPage({ title, onNavigate }: { title: string; onNavigate: (t: string) => void }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <BackLink onNavigate={onNavigate} />
      <h1 className="text-3xl font-black text-white mb-6">{title}</h1>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-400 text-sm leading-relaxed">
        <p>This page is under construction. Please contact support.drivekit@gmail.com for questions.</p>
      </div>
    </div>
  )
}