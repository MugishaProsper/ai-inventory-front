import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useProducts } from '@/context/ProductContext'
import { useNavigate } from 'react-router-dom'
import { useCategories } from '@/context/CategoriesContext'
import { useSuppliers } from '@/context/SupplierContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  Package,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal
} from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { Link } from 'react-router-dom'

const Products: React.FC = () => {
  const { products, loading, deleteProduct } = useProducts()
  const navigate = useNavigate()
  const { categories } = useCategories()
  const { suppliers } = useSuppliers()
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID')
  const [searchTerm, setSearchTerm] = useState('')
  // legacy modal state removed; using dedicated form routes now

  const filteredProducts = products

  const getStockStatus = (product: any) => {
    if (product.quantity === 0) {
      return { label: 'Out of Stock', variant: 'destructive' as const, color: 'text-red-600' }
    } else if (product.quantity <= product.minStock) {
      return { label: 'Low Stock', variant: 'warning' as const, color: 'text-yellow-600' }
    } else {
      return { label: 'In Stock', variant: 'success' as const, color: 'text-green-600' }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Products</h1>
            <p className="text-muted-foreground">
              Manage your inventory with AI-powered insights
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link to="/products/new">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>

                {/* View Mode */}
                <div className="flex items-center bg-muted rounded-lg p-1">
                  <Button
                    variant={viewMode === 'GRID' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('GRID')}
                    className="h-8 px-3"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'LIST' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('LIST')}
                    className="h-8 px-3"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{filteredProducts.length}</p>
                <p className="text-sm text-muted-foreground">Total Products</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {filteredProducts.filter(p => p.quantity > p.minStock).length}
                </p>
                <p className="text-sm text-muted-foreground">In Stock</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {filteredProducts.filter(p => p.quantity <= p.minStock && p.quantity > 0).length}
                </p>
                <p className="text-sm text-muted-foreground">Low Stock</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {filteredProducts.filter(p => p.quantity === 0).length}
                </p>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Products Grid/List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {viewMode === 'GRID' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => {
              const stockStatus = getStockStatus(product)

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                    {/* Product Image */}
                    <div className="relative aspect-square bg-muted">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}

                      {/* Stock Status Badge */}
                      <Badge
                        variant={stockStatus.variant}
                        className="absolute top-2 right-2"
                      >
                        {stockStatus.label}
                      </Badge>

                      {/* Action Buttons */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                        <Button size="sm" variant="secondary" onClick={() => navigate(`/products/${product.id}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Link to={`/products/${product.id}/edit`}>
                          <Button size="sm" variant="secondary">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button size="sm" variant="destructive" onClick={() => deleteProduct(product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-foreground truncate">
                            {product.name}
                          </h3>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>

                        <p className="text-sm text-muted-foreground">
                          SKU: {product.sku}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-foreground">
                            {formatCurrency(product.price)}
                          </span>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              Qty: {formatNumber(product.quantity)}
                            </p>
                            {product.quantity <= product.minStock && (
                              <div className="flex items-center text-xs text-red-600 mt-1">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Low Stock
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="pt-2">
                          <Badge variant="outline" className="text-xs">
                            {product.category}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {filteredProducts.map((product, index) => {
                  const stockStatus = getStockStatus(product)

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.02 }}
                      className="p-4 hover:bg-accent transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        {/* Product Image */}
                        <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-foreground truncate">
                              {product.name}
                            </h3>
                            <Badge variant={stockStatus.variant}>
                              {stockStatus.label}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2 text-sm">
                            <div>
                              <p className="text-muted-foreground">SKU</p>
                              <p className="font-medium">{product.sku}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Price</p>
                              <p className="font-medium">{formatCurrency(product.price)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Quantity</p>
                              <p className="font-medium">{formatNumber(product.quantity)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Category</p>
                              <p className="font-medium">{product.category}</p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Modal removed; using routed ProductForm page */}
    </div>
  )
}

export default Products