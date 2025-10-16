import React from 'react'
import { motion } from 'framer-motion'
import { useInventory } from '@/context/InventoryContext'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Package,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Users,
  Tags,
  ShoppingCart,
  BarChart3,
} from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/utils'

const DashboardStats: React.FC = () => {
  const { state } = useInventory()
  const { dashboardStats } = state

  const stats = [
    {
      name: 'Total Products',
      value: formatNumber(dashboardStats.totalProducts || 0),
      change: '+12%',
      changeType: 'positive' as const,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      name: 'Inventory Value',
      value: formatCurrency(dashboardStats.totalValue || 0),
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
    },
    {
      name: 'Low Stock Items',
      value: formatNumber(dashboardStats.lowStockItems || 0),
      change: '-5.4%',
      changeType: 'negative' as const,
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
    },
    {
      name: 'Out of Stock',
      value: formatNumber(dashboardStats.outOfStockItems || 0),
      change: '-12.1%',
      changeType: 'positive' as const,
      icon: ShoppingCart,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
    },
    {
      name: 'Categories',
      value: formatNumber(dashboardStats.totalCategories || 0),
      change: '+2',
      changeType: 'positive' as const,
      icon: Tags,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    },
    {
      name: 'Suppliers',
      value: formatNumber(dashboardStats.totalSuppliers || 0),
      change: '+3',
      changeType: 'positive' as const,
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
    },
    {
      name: 'Monthly Revenue',
      value: formatCurrency(dashboardStats.monthlyRevenue || 0),
      change: `${dashboardStats.monthlyRevenueChange > 0 ? '+' : ''}${dashboardStats.monthlyRevenueChange?.toFixed(1) || 0}%`,
      changeType: (dashboardStats.monthlyRevenueChange || 0) >= 0 ? 'positive' as const : 'negative' as const,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
    },
    {
      name: 'AI Insights',
      value: '12',
      change: '+3 new',
      changeType: 'positive' as const,
      icon: BarChart3,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/20',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ scale: 1.02 }}
          className="group"
        >
          <Card className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={stat.changeType === 'positive' ? 'default' : 'destructive'}
                      className="text-xs px-2 py-0.5"
                    >
                      {stat.change}
                    </Badge>
                    <span className="text-xs text-muted-foreground">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export default DashboardStats