import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts'
import { BarChart3, TrendingUp, Calendar } from 'lucide-react'

const mockChartData = [
  { name: 'Jan', value: 12400, stock: 850, revenue: 24800 },
  { name: 'Feb', value: 11300, stock: 920, revenue: 22600 },
  { name: 'Mar', value: 13800, stock: 780, revenue: 27600 },
  { name: 'Apr', value: 15200, stock: 650, revenue: 30400 },
  { name: 'May', value: 14600, stock: 720, revenue: 29200 },
  { name: 'Jun', value: 16800, stock: 580, revenue: 33600 },
]

const InventoryChart: React.FC = () => {
  const [chartType, setChartType] = useState<'BAR' | 'LINE' | 'AREA'>('BAR')
  const [dataType, setDataType] = useState<'VALUE' | 'STOCK' | 'REVENUE'>('VALUE')

  const renderChart = () => {
    const commonProps = {
      data: mockChartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    }

    switch (chartType) {
      case 'LINE':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey={dataType} 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        )
      case 'AREA':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey={dataType} 
              stroke="hsl(var(--primary))" 
              fill="hsl(var(--primary))"
              fillOpacity={0.2}
            />
          </AreaChart>
        )
      default:
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Bar 
              dataKey={dataType} 
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        )
    }
  }

  const getDataLabel = () => {
    switch (dataType) {
      case 'STOCK':
        return 'Stock Levels'
      case 'REVENUE':
        return 'Revenue'
      default:
        return 'Inventory Value'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>{getDataLabel()} Overview</span>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            {/* Chart Type Selector */}
            <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
              <Button
                variant={chartType === 'BAR' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setChartType('BAR')}
                className="h-8 px-3"
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
              <Button
                variant={chartType === 'LINE' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setChartType('LINE')}
                className="h-8 px-3"
              >
                <TrendingUp className="h-4 w-4" />
              </Button>
              <Button
                variant={chartType === 'AREA' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setChartType('AREA')}
                className="h-8 px-3"
              >
                <Calendar className="h-4 w-4" />
              </Button>
            </div>

            {/* Data Type Selector */}
            <select
              value={dataType}
              onChange={(e) => setDataType(e.target.value as 'VALUE' | 'STOCK' | 'REVENUE')}
              className="bg-muted border border-border rounded-md px-3 py-1 text-sm"
            >
              <option value="value">Value</option>
              <option value="stock">Stock</option>
              <option value="revenue">Revenue</option>
            </select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
        
        {/* Chart Summary */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Avg Monthly</p>
            <p className="text-lg font-semibold">$14.2K</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Growth Rate</p>
            <p className="text-lg font-semibold text-green-600">+12.5%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Peak Month</p>
            <p className="text-lg font-semibold">June</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default InventoryChart