import React from 'react'
import { motion } from 'framer-motion'
import { useInventory } from '@/context/InventoryContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Brain, TrendingUp, AlertTriangle, Target, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'

const AIInsightsWidget: React.FC = () => {
  const { state } = useInventory()
  const { aiInsights } = state

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'demand_forecast':
        return TrendingUp
      case 'reorder_suggestion':
        return AlertTriangle
      case 'trend_analysis':
        return Target
      default:
        return Brain
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'demand_forecast':
        return 'text-blue-600'
      case 'reorder_suggestion':
        return 'text-red-600'
      case 'trend_analysis':
        return 'text-green-600'
      default:
        return 'text-purple-600'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-500'
    if (confidence >= 0.6) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span>AI Insights</span>
          </CardTitle>
          <Badge variant="secondary" className="animate-pulse">
            {aiInsights.length} Active
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {aiInsights.slice(0, 3).map((insight, index) => {
          const Icon = getInsightIcon(insight.type)

          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group p-4 rounded-lg border border-border hover:border-primary/50 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-accent`}>
                  <Icon className={`h-4 w-4 ${getInsightColor(insight.type)}`} />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {insight.title}
                    </h4>
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${getConfidenceColor(insight.confidence)}`} />
                      <span className="text-xs text-muted-foreground">
                        {Math.round(insight.confidence * 100)}%
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {insight.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {insight.createdAt ? formatDate(insight.createdAt) : 'Unknown date'}
                    </span>
                    {insight.actionable && (
                      <Badge variant="outline" className="text-xs">
                        Actionable
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}

        <Button variant="outline" className="w-full mt-4 group">
          View All Insights
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  )
}

export default AIInsightsWidget