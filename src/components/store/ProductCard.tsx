import { useState } from 'react'
import {
  Heart, Eye, GitCompareArrows, Share2, Check, Mail, Facebook,
} from 'lucide-react'
import { Product, formatPrice, getCompareAtPrice, getDiscountPercent } from './types'

// ─── ProductMeta ─────────────────────────────────────────────────────────────

export function ProductMeta({ product }: { product: Product }) {
  const totalStock = product.variants.reduce((s, v) => s + v.inventoryQuantity, 0)
  return (
    <div className="flex items-center gap-3 text-xs text-zinc-500">
      <span>{totalStock} in stock</span>
      {product.productType && (
        <>
          <span>·</span>
          <span>{product.productType}</span>
        </>
      )}
    </div>
  )
}

// ─── ProductCard ─────────────────────────────────────────────────────────────

interface ProductCardProps {
  product: Product
  onClick: () => void
  isWishlisted: boolean
  onToggleWishlist: (id: number) => void
  isCompared: boolean
  onToggleCompare: (id: number) => void
}

export function ProductCard({ product, onClick, isWishlisted, onToggleWishlist, isCompared, onToggleCompare }: ProductCardProps) {
  const compareAt = getCompareAtPrice(product.variants)
  const discount = getDiscountPercent(product.minPrice, compareAt)
  const firstImage = product.images[0]
  const badge = product.tags[0] ?? null

  return (
    <div
      role="article"
      aria-label={`${product.title} - $${formatPrice(product.minPrice)}`}
      className={`group relative bg-zinc-900 border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-red-900/20 cursor-pointer ${isCompared ? 'border-blue-500 ring-1 ring-blue-500/30' : 'border-zinc-800 hover:border-red-600/50'}`}
      onClick={onClick}
    >
      <div className="relative bg-zinc-800 h-52 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-700/30 to-transparent" />
        {firstImage ? (
          <img
            src={firstImage.src}
            alt={firstImage.alt}
            className="relative z-10 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <span className="text-6xl text-zinc-600 relative z-10">🏎️</span>
        )}
        {badge && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide z-20">
            {badge}
          </span>
        )}
        {discount && discount > 0 && (
          <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full z-20">
            -{discount}%
          </span>
        )}
        <div className="product-card-actions">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id) }}
            className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-zinc-900/80 border border-zinc-700 flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:border-red-500 z-20"
          >
            <Heart size={14} className={isWishlisted ? 'text-red-500 fill-red-500' : 'text-zinc-400'} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleCompare(product.id) }}
            aria-label={isCompared ? `Remove ${product.title} from comparison` : `Add ${product.title} to comparison`}
            aria-pressed={isCompared}
            className={`absolute bottom-3 left-3 w-8 h-8 rounded-full bg-zinc-900/80 border flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-20 ${isCompared ? 'border-blue-500 hover:border-blue-400' : 'border-zinc-700 hover:border-blue-500'}`}
          >
            <GitCompareArrows size={14} className={isCompared ? 'text-blue-400' : 'text-zinc-400'} />
          </button>
        </div>
        {!product.inStock && (
          <div className="absolute inset-0 bg-zinc-900/70 flex items-center justify-center z-20">
            <span className="text-zinc-300 text-sm font-semibold tracking-widest uppercase">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs text-red-400 font-semibold uppercase tracking-widest mb-1">{product.vendor}</p>
        <h3 className="text-white font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-red-100 transition-colors">
          {product.title}
        </h3>
        <ProductMeta product={product} />

        <div className="flex items-center gap-2 mt-3">
          <span className="text-white font-bold text-lg">${formatPrice(product.minPrice)}</span>
          {compareAt && compareAt > product.minPrice && (
            <span className="text-zinc-500 text-sm line-through">${formatPrice(compareAt)}</span>
          )}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onClick() }}
          disabled={!product.inStock}
          className="mt-3 w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
        >
          <Eye size={15} />
          View Details
        </button>
      </div>
    </div>
  )
}

// ─── ShareMenu ───────────────────────────────────────────────────────────────

interface ShareMenuProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export function ShareMenu({ product, isOpen, onClose }: ShareMenuProps) {
  const [copied, setCopied] = useState(false)
  if (!isOpen) return null

  const productUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = `Check out ${product.title} on DriveKit!`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl)
      setCopied(true)
      setTimeout(() => { setCopied(false); onClose() }, 1200)
    } catch {
      const input = document.createElement('input')
      input.value = productUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => { setCopied(false); onClose() }, 1200)
    }
  }

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: product.title, text: shareText, url: productUrl })
      } catch {}
      onClose()
    }
  }

  const openUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=500')
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 z-[90]" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 w-56 bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl py-2 z-[91]">
        <button
          onClick={copyLink}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-200 hover:bg-zinc-700 transition-colors"
        >
          {copied ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} className="text-zinc-400" />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            onClick={nativeShare}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-200 hover:bg-zinc-700 transition-colors"
          >
            <Share2 size={16} className="text-zinc-400" />
            Share…
          </button>
        )}
        <div className="border-t border-zinc-700 my-1" />
        <button
          onClick={() => openUrl(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productUrl)}`)}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-200 hover:bg-zinc-700 transition-colors"
        >
          <span className="text-lg leading-none">𝕏</span>
          Share on X
        </button>
        <button
          onClick={() => openUrl(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`)}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-200 hover:bg-zinc-700 transition-colors"
        >
          <Facebook size={16} className="text-blue-400" />
          Share on Facebook
        </button>
        <button
          onClick={() => openUrl(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${productUrl}`)}`)}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-200 hover:bg-zinc-700 transition-colors"
        >
          <span className="text-lg leading-none">💬</span>
          Share on WhatsApp
        </button>
        <button
          onClick={() => openUrl(`mailto:?subject=${encodeURIComponent(product.title)}&body=${encodeURIComponent(`${shareText}\n\n${productUrl}`)}`)}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-200 hover:bg-zinc-700 transition-colors"
        >
          <Mail size={16} className="text-zinc-400" />
          Share via Email
        </button>
      </div>
    </>
  )
}
