import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ProductService from '@/services/product.service'
import api from '@/lib/api'
import { Product } from '@/types'
import { ChevronLeft, ChevronRight, DollarSign, MapPin, Package2, Star, Tags, Truck } from 'lucide-react'
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
            <div className="flex items-center px-2 py-1 bg-green-100 text-green-700 rounded">
              <DollarSign className="w-4 h-4 mr-1" />
              Price
            </div>
            <div className="font-semibold text-lg">${Number(p?.price ?? 0).toLocaleString()}</div>
          </div>
          {/* Quantity with indicator */}
          <div className="flex items-center gap-2 text-foreground">
            <div className="flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded">
              <Package2 className="w-4 h-4 mr-1" />
              Quantity
            </div>
            <div className={`flex items-center font-semibold text-lg
               ${(p?.quantity ?? 0) === 0 ? 'text-red-600' : (p?.quantity ?? 0) <= (p?.minStock ?? 0) ? 'text-yellow-500' : 'text-green-600'}
            `}>
              {p?.quantity ?? 0}
              {(p?.quantity ?? 0) === 0 && <div className="ml-2 text-xs bg-red-100 text-red-700 px-2 rounded">Out of Stock</div>}
              {(p?.quantity ?? 0) > 0 && (p?.quantity ?? 0) <= (p?.minStock ?? 0) && (
                <div className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 rounded">Low Stock</div>
              )}
            </div>
          </div>
          {/* Stock Status & Profit */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {p?.stockStatus && (
              <div className="flex items-center gap-2">
                Stock:
                <span
                  className={`
                    flex items-center px-2 py-0.5 rounded text-s font-semibold
                    ${p.stockStatus === 'in_stock' ? 'bg-green-100 text-green-700' : 
                      p.stockStatus === 'out_of_stock' ? 'bg-red-100 text-red-700' : 
                      'bg-yellow-100 text-yellow-800'}
                  `}
                >
                  {String(p.stockStatus).toUpperCase()}
                </span>
              </div>
            )}
            {p?.profitMargin !== undefined && (
              <div className="flex items-center gap-2">
                Profit Margin:
                <div className={`flex items-center px-2 py-0.5 rounded text-s font-semibold ${p.profitMargin > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{Number(p.profitMargin).toFixed(2)}%</div>
              </div>
            )}
          </div>
          {/* Supplier */}
          <div className="flex items-center gap-2 text-foreground">
            <div className="flex items-center px-2 py-1 bg-sky-100 text-sky-700 rounded">
              <Truck className="w-4 h-4 mr-1" />
              Supplier
            </div>
            {p?.supplier && typeof p.supplier === 'object' ? (
              <div className="font-medium">{p.supplier.name}</div>
            ) : (
              <div className="font-medium">{typeof p?.supplier === "string" ? p.supplier : "--"}</div>
            )}
          </div>
          {/* Location */}
          <div className="flex items-center gap-2 text-foreground">
            <div className="flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded">
              <MapPin className="w-4 h-4 mr-1" />
              Location
            </div>
            <div className="font-medium">{p?.location || "--"}</div>
          </div>
          {/* AI/Stats */}
          <div className="flex items-center gap-2 text-foreground">
            <div className="flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded">
              <Star className="w-4 h-4 mr-1" />
              Avg Rating
            </div>
            <div className={`flex items-center font-semibold text-lg ${p?.statistics?.avgRating ?? 0 > 0 ? 'text-green-600' : 'text-red-600'}`}>{p?.statistics?.avgRating ?? "--"}</div>
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


