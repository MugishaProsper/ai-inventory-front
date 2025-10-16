import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ProductService from '@/services/product.service'
import api from '@/lib/api'
import { Product } from '@/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const ProductView: React.FC = () => {
  const { productId } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [images, setImages] = useState<string[]>([])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    (async () => {
      try {
        if (!productId) return
        const mapped = await ProductService.getById(productId)
        setProduct(mapped.data)
        const raw = await api.get(`/products/${productId}`)
        const imgs: string[] = Array.isArray(raw.data?.data?.images) ? raw.data.data.images : []
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{product.name}</h1>
        <p className="text-muted-foreground">SKU: {product.sku}</p>
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
          ) : product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
          )}
        </div>
        <div className="space-y-3">
          <div className="text-foreground">Price: <span className="font-medium">{product.price}</span></div>
          <div className="text-foreground">Quantity: <span className="font-medium">{product.quantity}</span></div>
          <div className="text-foreground">Category: <span className="font-medium">{product.category}</span></div>
          <div className="text-foreground">Supplier: <span className="font-medium">{product.supplier}</span></div>
          <div className="text-foreground">Location: <span className="font-medium">{product.location}</span></div>
        </div>
      </div>
    </div >
  )
}

export default ProductView


