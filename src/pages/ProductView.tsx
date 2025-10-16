import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ProductService from '@/services/product.service'
import api from '@/lib/api'
import { Product } from '@/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const ProductView: React.FC = () => {
  const { productId } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [images, setImages] = useState<string[]>([])
  const [current, setCurrent] = useState(0)
  const [raw, setRaw] = useState<any>(null)
  const [userRating, setUserRating] = useState<number>(5)
  const [ratingSubmitting, setRatingSubmitting] = useState<boolean>(false)

  useEffect(() => {
    (async () => {
      try {
        if (!productId) return
        const mapped = await ProductService.getById(productId)
        setProduct(mapped.data)
        const rawRes = await api.get(`/products/${productId}`)
        setRaw(rawRes.data?.data || null)
        const imgs: string[] = Array.isArray(rawRes.data?.data?.images) ? rawRes.data.data.images : []
        setImages(imgs)
        setCurrent(0)
      } finally {
        setLoading(false)
      }
    })()
  }, [productId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!product) return null

  // Prefer detailed raw payload when available
  const p: any = raw || product

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{p?.name}</h1>
        <p className="text-muted-foreground">SKU: {p?.sku}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="aspect-square bg-muted rounded-lg overflow-hidden relative flex items-center justify-center">
          {images.length > 0 ? (
            <>
              <img src={images[current]} alt={`image-${current + 1}`} className="w-full h-full object-cover" />
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded"
                    onClick={() => setCurrent((prev) => (prev - 1 + images.length) % images.length)}
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded"
                    onClick={() => setCurrent((prev) => (prev + 1) % images.length)}
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {current + 1} / {images.length}
                  </div>
                </>
              )}
            </>
          ) : p?.imageUrl ? (
            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
          )}
        </div>
        <div className="space-y-4">
          {/* Price */}
          <div className="flex items-center gap-2 text-foreground">
            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M12 8v8m0 0a4 4 0 01-4-4c0-2.21 1.79-4 4-4s4 1.79 4 4a4 4 0 01-4 4z" />
              </svg>
              Price
            </span>
            <span className="font-semibold text-lg">${Number(p?.price ?? 0).toLocaleString()}</span>
          </div>
          {/* Quantity with indicator */}
          <div className="flex items-center gap-2 text-foreground">
            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8M12 8v8" />
              </svg>
              Quantity
            </span>
            <span className={`font-semibold text-lg
               ${(p?.quantity ?? 0) === 0 ? 'text-red-600' : (p?.quantity ?? 0) <= (p?.minStock ?? 0) ? 'text-yellow-500' : 'text-green-600'}
            `}>
              {p?.quantity ?? 0}
              {(p?.quantity ?? 0) === 0 && <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 rounded">Out of Stock</span>}
              {(p?.quantity ?? 0) > 0 && (p?.quantity ?? 0) <= (p?.minStock ?? 0) && (
                <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 rounded">Low Stock</span>
              )}
            </span>
          </div>
          {/* Stock Status & Profit */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {p?.stockStatus && <span>Stock: <span className="text-foreground font-medium">{String(p.stockStatus).replace('_', ' ')}</span></span>}
            {p?.profitMargin !== undefined && <span>Profit Margin: <span className="text-foreground font-medium">{Number(p.profitMargin).toFixed(2)}%</span></span>}
          </div>
          {/* Category */}
          <div className="flex items-center gap-2 text-foreground">
            <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M16 2v4M8 2v4" />
              </svg>
              Category
            </span>
            {p?.category && typeof p.category === 'object' ? (
              <span className="font-medium flex items-center gap-2">
                {p.category && typeof p.category === 'object' && (
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={typeof p.category === 'object' && 'color' in p.category && p.category.color && !String(p.category.color).startsWith('bg-') ? { background: p.category.color } : undefined}
                  >
                    {typeof p.category === 'object' && 'color' in p.category && p.category.color && String(p.category.color).startsWith('bg-') && (
                      <span className={`${p.category.color} w-3 h-3 rounded-full inline-block`} />
                    )}
                  </span>
                )}
                <span>{p.category.name}</span>
                {p.category.icon && (
                  <span className="ml-1">
                    <i className={`lucide lucide-${String(p.category.icon).toLowerCase()}`} />
                  </span>
                )}
              </span>
            ) : (
              <span className="font-medium">{typeof p?.category === "string" ? p.category : "--"}</span>
            )}
          </div>
          {/* Supplier */}
          <div className="flex items-center gap-2 text-foreground">
            <span className="inline-flex items-center px-2 py-1 bg-sky-100 text-sky-700 rounded">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M3 7v8a2 2 0 002 2h3v2a1 1 0 002 0v-2h2v2a1 1 0 002 0v-2h3a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                <path d="M21 7l-9 6-9-6" />
              </svg>
              Supplier
            </span>
            {p?.supplier && typeof p.supplier === 'object' ? (
              <span className="font-medium">{p.supplier.name}</span>
            ) : (
              <span className="font-medium">{typeof p?.supplier === "string" ? p.supplier : "--"}</span>
            )}
          </div>
          {/* Location */}
          <div className="flex items-center gap-2 text-foreground">
            <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M12 2C8 2 5 5.1 5 9.3c0 5.1 7 12.7 7 12.7s7-7.6 7-12.7C19 5.1 16 2 12 2z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              Location
            </span>
            <span className="font-medium">{p?.location || "--"}</span>
          </div>
          {/* AI/Stats */}
          <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded bg-muted">
              <div className="text-muted-foreground">Avg Rating</div>
              <div className="text-foreground font-semibold">{p?.statistics?.avgRating ?? '--'}</div>
            </div>
            <div className="p-3 rounded bg-muted">
              <div className="text-muted-foreground">Total Sold</div>
              <div className="text-foreground font-semibold">{p?.statistics?.totalSold ?? '--'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Movements */}
      {Array.isArray(p?.recentMovements) && p.recentMovements.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Recent Movements</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Qty</th>
                  <th className="py-2 pr-4">Reason</th>
                </tr>
              </thead>
              <tbody>
                {p.recentMovements.map((m: any) => (
                  <tr key={m._id} className="border-b border-border/60">
                    <td className="py-2 pr-4">{new Date(m.createdAt).toLocaleString()}</td>
                    <td className="py-2 pr-4">{m.type}</td>
                    <td className="py-2 pr-4">{m.quantity}</td>
                    <td className="py-2 pr-4">{m.reason || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Performance and Rating */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance metrics (derived) */}
        <div className="space-y-3 p-4 rounded bg-muted">
          <h3 className="font-semibold text-foreground">Performance Metrics</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-muted-foreground">Revenue</div>
              <div className="text-foreground font-semibold">${Number(p?.statistics?.totalRevenue ?? 0).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Avg Rating</div>
              <div className="text-foreground font-semibold">{p?.statistics?.avgRating ?? '--'}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Total Ratings</div>
              <div className="text-foreground font-semibold">{p?.statistics?.totalRatingCount ?? 0}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Views</div>
              <div className="text-foreground font-semibold">{p?.statistics?.viewCount ?? 0}</div>
            </div>
          </div>
        </div>

        {/* Rate product */}
        <div className="space-y-3 p-4 rounded bg-muted">
          <h3 className="font-semibold text-foreground">Rate Product</h3>
          <div className="flex items-center gap-2">
            <Input type="number" min={1} max={5} value={userRating} onChange={(e) => setUserRating(Math.max(1, Math.min(5, Number(e.target.value))))} className="w-24" />
            <Button disabled={ratingSubmitting} onClick={async () => {
              try {
                setRatingSubmitting(true)
                if (!productId) return
                await ProductService.rate(productId, userRating)
                // Refresh basic view after rating
                const mapped = await ProductService.getById(productId)
                setProduct(mapped.data)
              } finally {
                setRatingSubmitting(false)
              }
            }}>Submit</Button>
          </div>
          <p className="text-xs text-muted-foreground">Enter a rating from 1 (lowest) to 5 (highest).</p>
        </div>
      </div>
    </div>
  )
}

export default ProductView


