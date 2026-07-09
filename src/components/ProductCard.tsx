import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Eye, Star, Tag } from 'lucide-react'

interface Product {
  id: string
  title: string
  description?: string
  price: number
  compareAtPrice?: number
  costPrice?: number
  category?: string
  tags?: string
  image?: string
  inventory: number
  isActive: boolean
  isFeatured: boolean
}

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  onViewDetails?: (product: Product) => void
  showAdmin?: boolean
}

export function ProductCard({ product, onAddToCart, onViewDetails, showAdmin = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const tags = product.tags ? product.tags.split(',').map(t => t.trim()) : []
  const isSummer = tags.some(t => t.toLowerCase() === 'summer')
  const discountPercent = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0

  return (
    <Card
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {discountPercent > 0 && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-red-500 text-white font-bold">-{discountPercent}%</Badge>
        </div>
      )}
      {isSummer && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-yellow-500 text-black font-bold">
            <Tag className="w-3 h-3 mr-1" />
            Summer
          </Badge>
        </div>
      )}
      {product.isFeatured && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-purple-600 text-white">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        </div>
      )}

      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <ShoppingCart className="w-12 h-12" />
          </div>
        )}
        <div
          className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-2 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Button
            size="sm"
            className="bg-white text-black hover:bg-slate-100"
            onClick={() => onViewDetails?.(product)}
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          {!showAdmin && (
            <Button
              size="sm"
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => onAddToCart?.(product)}
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Add to Cart
            </Button>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          {product.category && (
            <p className="text-xs text-slate-500 uppercase tracking-wide">{product.category}</p>
          )}
          <h3 className="font-semibold text-slate-900 line-clamp-2 min-h-[2.5rem]">{product.title}</h3>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
            {discountPercent > 0 && (
              <span className="text-sm text-slate-400 line-through">${product.compareAtPrice?.toFixed(2)}</span>
            )}
          </div>
          {product.inventory < 10 && product.inventory > 0 && (
            <p className="text-xs text-orange-500">Only {product.inventory} left in stock</p>
          )}
          {product.inventory === 0 && (
            <p className="text-xs text-red-500 font-medium">Out of stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}