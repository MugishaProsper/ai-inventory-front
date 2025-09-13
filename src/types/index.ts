export interface Product {
  id: string
  name: string
  sku: string
  category: string
  description?: string
  price: number
  cost: number
  quantity: number
  minStock: number
  maxStock: number
  supplier: string
  location: string
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
  status: 'active' | 'inactive' | 'discontinued'
  tags: string[]
}

export interface Category {
  id: string
  name: string
  description?: string
  color: string
  productCount: number
  createdAt: Date
}

export interface Supplier {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  address: string
  rating: number
  productsSupplied: number
  createdAt: Date
}

export interface StockMovement {
  id: string
  productId: string
  productName: string
  type: 'in' | 'out' | 'adjustment'
  quantity: number
  reason: string
  reference?: string
  createdAt: Date
  createdBy: string
}

export interface AlertRule {
  id: string
  name: string
  type: 'low_stock' | 'overstock' | 'expiring' | 'custom'
  productIds: string[]
  threshold: number
  isActive: boolean
  createdAt: Date
}

export interface AIInsight {
  id: string
  type: 'demand_forecast' | 'reorder_suggestion' | 'trend_analysis' | 'anomaly_detection'
  title: string
  description: string
  confidence: number
  actionable: boolean
  productIds: string[]
  data: any
  createdAt: Date
}

export interface DashboardStats {
  totalProducts: number
  totalValue: number
  lowStockItems: number
  outOfStockItems: number
  totalCategories: number
  totalSuppliers: number
  monthlyRevenue: number
  monthlyRevenueChange: number
  topSellingProducts: Array<{
    id: string
    name: string
    sold: number
    revenue: number
  }>
  stockMovements: StockMovement[]
  recentAlerts: Array<{
    id: string
    type: string
    message: string
    severity: 'low' | 'medium' | 'high'
    createdAt: Date
  }>
}

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'staff'
  avatar?: string
  createdAt: Date
}

export interface FilterOptions {
  search?: string
  category?: string
  supplier?: string
  status?: string
  minPrice?: number
  maxPrice?: number
  minStock?: number
  maxStock?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}