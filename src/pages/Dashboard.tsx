import React from 'react'
import { motion } from 'framer-motion'
import { useInventory } from '@/context/InventoryContext'
import DashboardStats from '@/components/dashboard/DashboardStats'
import RecentActivity from '@/components/dashboard/RecentActivity'
import AIInsightsWidget from '@/components/dashboard/AIInsightsWidget'
import InventoryChart from '@/components/dashboard/InventoryChart'
import TopProducts from '@/components/dashboard/TopProducts'
import AlertsWidget from '@/components/dashboard/AlertsWidget'
import QuickActions from '@/components/dashboard/QuickActions'

const Dashboard: React.FC = () => {
  const { state, loadDashboardAnalytics, loadAIInsights } = useInventory()
  const { loading } = state

  // Load dashboard data on component mount
  React.useEffect(() => {
    loadDashboardAnalytics('30d')
    loadAIInsights()
  }, [loadDashboardAnalytics, loadAIInsights])

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your inventory.
            </p>
          </div>
          <QuickActions />
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <DashboardStats />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Inventory Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <InventoryChart />
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <RecentActivity />
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <AIInsightsWidget />
          </motion.div>

          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <TopProducts />
          </motion.div>

          {/* Alerts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <AlertsWidget />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard