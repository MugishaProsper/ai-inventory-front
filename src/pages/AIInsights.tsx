import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAiInsights } from '@/context/AiInsightsContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Brain, TrendingUp, AlertTriangle, Target, Zap, RefreshCw } from 'lucide-react'
import { formatDate } from '@/lib/utils'

const AIInsights: React.FC = () => {
  const { insights, loading, refresh } = useAiInsights()
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    const params = filter === 'all' ? {} : { type: filter }
    refresh(params)
  }, [filter])

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'demand_forecast':
        return TrendingUp
      case 'reorder_suggestion':
        return AlertTriangle
      case 'trend_analysis':
        return Target
      case 'anomaly_detection':
        return Zap
      default:
        return Brain
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'demand_forecast':
        return 'from-blue-500 to-cyan-500'
      case 'reorder_suggestion':
        return 'from-red-500 to-orange-500'
      case 'trend_analysis':
        return 'from-green-500 to-emerald-500'
      case 'anomaly_detection':
        return 'from-purple-500 to-pink-500'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const filteredInsights = insights

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
            <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <span>AI Insights</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              AI-powered recommendations and predictions for your inventory
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={() => refresh()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Insights
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
                {[
                  { key: 'all', label: 'All Insights' },
                  { key: 'demand_forecast', label: 'Forecasts' },
                  { key: 'reorder_suggestion', label: 'Reorders' },
                  { key: 'trend_analysis', label: 'Trends' },
                  { key: 'anomaly_detection', label: 'Anomalies' },
                ].map((tab) => (
                  <Button
                    key={tab.key}
                    variant={filter === tab.key ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter(tab.key as any)}
                    className="h-8 px-3"
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="animate-pulse">
                  {filteredInsights.length} insights
                </Badge>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">AI Active</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredInsights.map((insight, index) => {
          const Icon = getInsightIcon(insight.type)

          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-r ${getInsightColor(insight.type)} opacity-5`} />

                <CardHeader className="pb-4 relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 bg-gradient-to-r ${getInsightColor(insight.type)} rounded-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {insight.type.replace('_', ' ')}
                        </Badge>
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${insight.confidence >= 0.8 ? 'bg-green-500' : insight.confidence >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                      <span className="text-sm font-medium">
                        {Math.round(insight.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 relative">
                  {insight.description && (
                    <p className="text-muted-foreground">
                      {insight.description}
                    </p>
                  )}

                  {/* Insight Data */}
                  {insight.data && (
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <h4 className="font-medium text-sm text-foreground">Key Metrics:</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {Object.entries(insight.data).map(([key, value]) => (
                          <div key={key}>
                            <p className="text-muted-foreground capitalize">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </p>
                            <p className="font-medium text-foreground">
                              {typeof value === 'number' ? value : String(value)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">
                        {insight.createdAt ? formatDate(new Date(insight.createdAt)) : ''}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {filteredInsights.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-12 text-center">
              <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No insights available</h3>
              <p className="text-muted-foreground mb-6">
                The AI is analyzing your inventory data. Check back soon for new insights!
              </p>
              <Button className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700" onClick={() => refresh()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate Insights
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

export default AIInsights