import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ProductService from '@/services/product.service'
import { Product } from '@/types'

const ProductView: React.FC = () => {
  const { productId } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        if (!productId) return
        const res = await ProductService.getById(productId)
        setProduct(res.data)
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
        <div className="aspect-square bg-muted rounded-lg overflow-hidden">
          {product.imageUrl ? (
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


