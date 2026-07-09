import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Car, Shield, Minus, Plus, X, CreditCard } from 'lucide-react'

interface CartItem { id: string; title: string; price: number; quantity: number; image?: string }

interface CheckoutPageProps {
  items: CartItem[]
  onUpdateQuantity: (id: string, qty: number) => void
  onRemoveItem: (id: string) => void
  onPlaceOrder: (order: any) => void
}

export function CheckoutPage({ items, onUpdateQuantity, onRemoveItem, onPlaceOrder }: CheckoutPageProps) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', address: '', city: '', state: '', zip: '', phone: '' })
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const shipping = subtotal >= 99 ? 0 : 9.99
  const freeShippingProgress = Math.min(100, (subtotal / 99) * 100)
  const amountToFreeShipping = Math.max(0, 99 - subtotal)
  const discount = promoApplied ? subtotal * 0.2 : 0
  const tax = (subtotal - discount) * 0.08
  const total = subtotal - discount + shipping + tax

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-6">Shipping Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs font-bold uppercase tracking-wider">First Name</Label>
                <Input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white" placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Last Name</Label>
                <Input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <Label className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Email</Label>
              <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white" placeholder="john@example.com" />
            </div>
            <div className="space-y-2 mt-4">
              <Label className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Address</Label>
              <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white" placeholder="123 Main St" />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs font-bold uppercase tracking-wider">City</Label>
                <Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs font-bold uppercase tracking-wider">State</Label>
                <Input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Zip</Label>
                <Input value={form.zip} onChange={e => setForm({ ...form, zip: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white" />
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <Label className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Phone (Optional)</Label>
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white" placeholder="(555) 123-4567" />
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">🏷️ Promo Code</h2>
            <div className="flex gap-3">
              <Input placeholder="Enter code" value={promoCode} onChange={e => setPromoCode(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white" />
              <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800" onClick={() => { if (promoCode.toUpperCase() === 'DRIVE20') setPromoApplied(true) }}>Apply</Button>
            </div>
            {promoApplied && <p className="text-sm text-green-400 mt-2">✓ DRIVE20 applied — 20% off!</p>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-24">
            <h2 className="text-lg font-bold text-white mb-4">Order Summary</h2>

            {amountToFreeShipping > 0 ? (
              <div className="mb-4">
                <p className="text-sm text-zinc-300">Add <span className="text-white font-bold">${amountToFreeShipping.toFixed(2)}</span> for <span className="text-green-400 font-bold">FREE shipping</span></p>
                <p className="text-xs text-zinc-500 mt-1">${subtotal.toFixed(2)} / $99</p>
                <div className="w-full h-2 bg-zinc-800 rounded-full mt-2"><div className="h-full bg-red-600 rounded-full transition-all" style={{ width: `${freeShippingProgress}%` }} /></div>
              </div>
            ) : (
              <div className="mb-4 flex items-center gap-2 text-sm text-green-400"><Car className="w-4 h-4" /> Free shipping on orders over $99</div>
            )}

            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-600"><Car className="w-5 h-5" /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{item.title}</p>
                    <p className="text-xs text-zinc-500">${item.price.toFixed(2)} each</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))} className="w-6 h-6 bg-zinc-800 rounded flex items-center justify-center text-zinc-400 hover:text-white"><Minus className="w-3 h-3" /></button>
                      <span className="text-sm text-white w-6 text-center">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 bg-zinc-800 rounded flex items-center justify-center text-zinc-400 hover:text-white"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                    <button onClick={() => onRemoveItem(item.id)} className="text-zinc-600 hover:text-red-400 mt-1"><X className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-800 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-zinc-400"><span>Subtotal</span><span className="text-white">${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-zinc-400"><span>Shipping</span><span className="text-white">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-400"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
              <div className="flex justify-between text-zinc-400"><span>Tax (est.)</span><span className="text-white">${tax.toFixed(2)}</span></div>
              <div className="flex justify-between text-lg font-bold border-t border-zinc-800 pt-2"><span className="text-white">Total</span><span className="text-white">${total.toFixed(2)}</span></div>
            </div>

            <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12 mt-6" onClick={() => onPlaceOrder({ ...form, total, items })}>
              ✓ Place Order
            </Button>

            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-zinc-500">
              <Shield className="w-3 h-3" /> Secure checkout · SSL encrypted
            </div>

            <div className="flex items-center justify-center gap-2 mt-3">
              {['VISA', 'MC', 'AMEX', 'DISC', 'Pay', 'GPay'].map(p => (
                <span key={p} className="px-2 py-1 bg-zinc-800 rounded text-[10px] text-zinc-400 font-bold">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}