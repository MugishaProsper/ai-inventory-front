import React from 'react'
import { motion } from 'framer-motion'
import { useInventory } from '@/context/InventoryContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, AlertCircle, Info, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'

const AlertsWidget: React.FC = () => {
  const { state } = useInventory()
  const { dashboardStats } = state

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return AlertTriangle
      case 'medium':
        return AlertCircle
      default:
        return Info
    }
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-yellow-600'
      default:
        return 'text-blue-600'
    }
  }

  const getAlertBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'destructive' as const
      case 'medium':
        return 'warning' as const
      default:
        return 'secondary' as const
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>Alerts</span>
          </CardTitle>
          <Badge variant="destructive">
            {dashboardStats.recentAlerts?.filter(alert => alert.severity === 'high').length || 0} Critical
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {dashboardStats.recentAlerts?.map((alert, index) => {
            const Icon = getAlertIcon(alert.severity)
            
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-all duration-200"
              >
                <div className={`p-2 rounded-lg bg-accent mt-0.5`}>
                  <Icon className={`h-4 w-4 ${getAlertColor(alert.severity)}`} />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {alert.type}
                    </span>
                    <Badge variant={getAlertBadgeVariant(alert.severity)} className="text-xs">
                      {alert.severity}
                    </Badge>
                  </div>
                  
                  <p className="text-sm font-medium text-foreground">
                    {alert.message}
                  </p>
                  
                  <p className="text-xs text-muted-foreground">
                    {formatDate(alert.createdAt)}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
        
        {(!dashboardStats.recentAlerts || dashboardStats.recentAlerts.length === 0) && (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No active alerts</p>
            <p className="text-sm text-muted-foreground mt-1">Your inventory is running smoothly!</p>
          </div>
        )}
        
        <Button variant="outline" className="w-full mt-4 group">
          View All Alerts
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  )
}

export default AlertsWidget