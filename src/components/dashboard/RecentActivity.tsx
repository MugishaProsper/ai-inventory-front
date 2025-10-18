import React from 'react'
import { motion } from 'framer-motion'
import { useInventory } from '@/context/InventoryContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Activity, ArrowUp, ArrowDown, RefreshCw, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'

const RecentActivity: React.FC = () => {
  const { state } = useInventory()
  const { dashboardAnalytics } = state

  // Use real activity data from dashboard analytics if available
  const activities = dashboardAnalytics?.recentActivity || []

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'IN':
        return ArrowUp
      case 'OUT':
        return ArrowDown
      case 'ADJUSTMENT':
        return RefreshCw
      default:
        return Activity
    }
  }

  const getMovementColor = (type: string) => {
    switch (type) {
      case 'IN':
        return 'text-green-600'
      case 'OUT':
        return 'text-red-600'
      case 'ADJUSTMENT':
        return 'text-blue-600'
      default:
        return 'text-gray-600'
    }
  }

  const getMovementBadgeVariant = (type: string) => {
    switch (type) {
      case 'IN':
        return 'success' as const
      case 'OUT':
        return 'destructive' as const
      case 'ADJUSTMENT':
        return 'secondary' as const
      default:
        return 'outline' as const
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
          <Badge variant="outline">
            {activities.length} movements
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {activities.length > 0 ? activities.slice(0, 5).map((activity, index) => {
            const Icon = getMovementIcon(activity.type)

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-accent transition-colors duration-200"
              >
                <div className={`p-2 rounded-lg bg-accent`}>
                  <Icon className={`h-4 w-4 ${getMovementColor(activity.type)}`} />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">
                      {activity.product}
                    </h4>
                    <Badge variant={getMovementBadgeVariant(activity.type)} className="text-xs">
                      {activity.type.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Qty: {activity.quantity}</span>
                    <span>{activity.createdAt ? formatDate(activity.createdAt) : 'Unknown date'}</span>
                  </div>

                  <p className="text-xs text-muted-foreground truncate">
                    {activity.reason}
                  </p>
                </div>
              </motion.div>
            )
          }) : (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No recent activity</p>
            </div>
          )}
        </div>

        <Button variant="outline" className="w-full mt-4 group">
          View All Activity
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  )
}

export default RecentActivity