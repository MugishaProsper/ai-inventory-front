import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadialBarChart, RadialBar
} from 'recharts'
import {
  ArrowLeft, TrendingUp, Package, DollarSign, Star, Truck,
  BarChart3, PieChart as PieChartIcon, Activity, Users, Clock, Award
} from 'lucide-react'
import SupplierService from '@/services/supplier.service'

interface SupplierAnalytics {
  supplier: {
    id: string
    name: string
    code: string
    status: string
  }
  analytics: {
    totalProducts: number
    totalValue: number
    averagePrice: number
    stockStatus: {
      inStock: number
      lowStock: number
      outOfStock: number
    }
    performance: {
      rating: number
      deliveryPerformance: number
      overallScore: number
      responseTime: number
    }
    topProducts: Array<{
      id: string
      name: string
      sku: string
      totalSold: number
      revenue: number
    }>
  }
  period: string
}

const SupplierView: React.FC = () => {
  const { supplierId } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<SupplierAnalytics | null>(null)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PERFORMANCE' | 'PRODUCTS'>('OVERVIEW')
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!supplierId) return

      try {
        setLoading(true)
        const period = timeRange === '7d' ? '7d' : timeRange === '90d' ? '90d' : timeRange === '1y' ? '365d' : '30d'
        const response = await SupplierService.getAnalytics(supplierId, period)
        setAnalytics(response.data)
      } catch (error) {
        console.error('Failed to fetch supplier analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [supplierId, timeRange])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">No Analytics Data</h2>
          <p className="text-muted-foreground">Unable to load supplier analytics</p>
        </div>
      </div>
    )
  }

  const { supplier: supplierInfo, analytics: analyticsData } = analytics

  // Chart data preparation
  const stockStatusData = [
    { name: 'In Stock', value: analyticsData.stockStatus.inStock, color: '#10b981' },
    { name: 'Low Stock', value: analyticsData.stockStatus.lowStock, color: '#f59e0b' },
    { name: 'Out of Stock', value: analyticsData.stockStatus.outOfStock, color: '#ef4444' }
  ]

  const topProductsData = analyticsData.topProducts.map(product => ({
    name: product.name.length > 15 ? product.name.substring(0, 15) + '...' : product.name,
    sales: product.totalSold,
    revenue: product.revenue
  }))

  const performanceData = [
    { name: 'Rating', value: analyticsData.performance.rating, max: 5 },
    { name: 'Delivery', value: analyticsData.performance.deliveryPerformance, max: 100 },
    { name: 'Overall', value: analyticsData.performance.overallScore, max: 100 },
    { name: 'Response', value: Math.max(0, 100 - analyticsData.performance.responseTime), max: 100 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{supplierInfo.name}</h1>
              <p className="text-muted-foreground">
                Supplier Analytics & Performance Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
              {(['7d', '30d', '90d', '1y'] as const).map((period) => (
                <Button
                  key={period}
                  variant={timeRange === period ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setTimeRange(period)}
                  className="text-xs"
                >
                  {period}
                </Button>
              ))}
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted rounded-lg p-1">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'performance', label: 'Performance', icon: Activity },
          { id: 'products', label: 'Products', icon: Package }
        ].map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={activeTab === id ? 'default' : 'ghost'}
            onClick={() => setActiveTab(id as any)}
            className="flex-1 gap-2"
          >
            <Icon className="w-4 h-4" />
            {label}
          </Button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                      <p className="text-2xl font-bold text-foreground">{formatNumber(analyticsData.totalProducts)}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                      <p className="text-2xl font-bold text-foreground">{formatCurrency(analyticsData.totalValue)}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                      <p className="text-2xl font-bold text-foreground">{analyticsData.performance.rating.toFixed(1)}</p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <Star className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Delivery Performance</p>
                      <p className="text-2xl font-bold text-foreground">{analyticsData.performance.deliveryPerformance.toFixed(1)}%</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Truck className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stock Status Pie Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5" />
                    Stock Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stockStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {stockStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center space-x-6 mt-4">
                    {stockStatusData.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-muted-foreground">{item.name}: {item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Products Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Top Selling Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topProductsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sales" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'PERFORMANCE' && (
        <div className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Overall Score', value: analyticsData.performance.overallScore, max: 100, icon: Award, color: 'blue' },
              { label: 'Delivery Performance', value: analyticsData.performance.deliveryPerformance, max: 100, icon: Truck, color: 'green' },
              { label: 'Response Time', value: Math.max(0, 100 - analyticsData.performance.responseTime), max: 100, icon: Clock, color: 'purple' },
              { label: 'Quality Rating', value: analyticsData.performance.rating * 20, max: 100, icon: Star, color: 'yellow' }
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                        <p className="text-2xl font-bold text-foreground">{metric.value.toFixed(1)}%</p>
                      </div>
                      <div className={`p-3 bg-${metric.color}-100 rounded-lg`}>
                        <metric.icon className={`h-6 w-6 text-${metric.color}-600`} />
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-${metric.color}-600 h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${(metric.value / metric.max) * 100}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Performance Radar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={performanceData}>
                    <RadialBar dataKey="value" cornerRadius={10} fill="#3b82f6" />
                    <Tooltip />
                  </RadialBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'PRODUCTS' && (
        <div className="space-y-6">
          {/* Product Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Product Portfolio Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground">{formatNumber(analyticsData.totalProducts)}</p>
                    <p className="text-sm text-muted-foreground">Total Products</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground">{formatCurrency(analyticsData.averagePrice)}</p>
                    <p className="text-sm text-muted-foreground">Average Price</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground">{formatCurrency(analyticsData.totalValue)}</p>
                    <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Products Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Top Performing Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Product</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">SKU</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Units Sold</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.topProducts.map((product) => (
                        <tr key={product.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="font-medium text-foreground">{product.name}</div>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{product.sku}</td>
                          <td className="py-3 px-4 text-right font-medium text-foreground">
                            {formatNumber(product.totalSold)}
                          </td>
                          <td className="py-3 px-4 text-right font-medium text-foreground">
                            {formatCurrency(product.revenue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default SupplierView
