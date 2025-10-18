import React from 'react'
import { motion } from 'framer-motion'
import { useInventory } from '@/context/InventoryContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, TrendingUp, ArrowRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const TopProducts: React.FC = () => {
  const { state } = useInventory()
  const { dashboardAnalytics } = state

  // Use real data from analytics if available
  const topProducts = dashboardAnalytics?.topSellingProducts || []

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span>Top Products</span>
          </CardTitle>
          <Badge variant="secondary">
            This Month
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {topProducts.length > 0 ? topProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-accent transition-colors duration-200"
            >
              {/* Rank */}
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold
                ${index === 0 ? 'bg-yellow-500 text-white' :
                  index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-amber-600 text-white' :
                      'bg-muted text-muted-foreground'}
              `}>
                {index + 1}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground truncate">
                    {product.name}
                  </h4>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {product.totalSold} sold
                  </span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(product.revenue)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (product.totalSold / Math.max(...(topProducts.map(p => p.totalSold) || [1]))) * 100)}%`
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No sales data available</p>
            </div>
          )}
        </div>

        <Button variant="outline" className="w-full mt-4 group">
          View All Products
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  )
}

export default TopProducts