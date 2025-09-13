import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Package, Upload, Download, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

const QuickActions: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  const actions = [
    {
      name: 'Add Product',
      icon: Plus,
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => console.log('Add Product'),
    },
    {
      name: 'Quick Scan',
      icon: Package,
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => console.log('Quick Scan'),
    },
    {
      name: 'Import Data',
      icon: Upload,
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => console.log('Import Data'),
    },
    {
      name: 'Export Report',
      icon: Download,
      color: 'bg-orange-500 hover:bg-orange-600',
      onClick: () => console.log('Export Report'),
    },
  ]

  return (
    <div className="relative">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
          size="lg"
        >
          <Zap className="mr-2 h-5 w-5" />
          Quick Actions
        </Button>
      </motion.div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="absolute right-0 mt-2 w-56 rounded-lg bg-card border border-border shadow-lg z-50"
        >
          <div className="p-2">
            {actions.map((action, index) => (
              <motion.button
                key={action.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  action.onClick()
                  setIsOpen(false)
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-md hover:bg-accent transition-colors duration-200"
              >
                <div className={`p-2 rounded-md ${action.color} text-white`}>
                  <action.icon className="h-4 w-4" />
                </div>
                <span className="font-medium text-foreground">{action.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default QuickActions