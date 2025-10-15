import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Database,
  Palette,
  Moon,
  Sun,
  Globe,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext'

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('PROFILE')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { user } = useAuth();

  const tabs = [
    { id: 'PROFILE', label: 'Profile', icon: User },
    { id: 'NOTIFICATIONS', label: 'Notifications', icon: Bell },
    { id: 'SECURITY', label: 'Security', icon: Shield },
    { id: 'APPEARANCE', label: 'Appearance', icon: Palette },
    { id: 'DATA', label: 'Data & Export', icon: Database },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'PROFILE':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      First Name
                    </label>
                    <Input defaultValue={`${user?.fullname.split(' ')[0]}`} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Last Name
                    </label>
                    <Input defaultValue={`${user?.fullname.split(' ')[1]}`} />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Email Address
                  </label>
                  <Input type="email" defaultValue={`${user?.email}`} />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Phone Number
                  </label>
                  <Input type="tel" defaultValue={user?.phone_number ? `${user?.phone_number}` : ''} />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Address
                  </label>
                  <Input defaultValue="123 Business St, City, State 12345" />
                </div>

                <Button className="w-full md:w-auto">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </div>
        )

      case 'NOTIFICATIONS':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { title: 'Low Stock Alerts', description: 'Get notified when items are running low' },
                  { title: 'Reorder Suggestions', description: 'AI-powered reorder recommendations' },
                  { title: 'Price Changes', description: 'Notifications about supplier price updates' },
                  { title: 'System Updates', description: 'Important system and feature updates' },
                  { title: 'Weekly Reports', description: 'Weekly inventory performance summaries' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="success">Email</Badge>
                      <Badge variant="outline">Push</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )

      case 'SECURITY':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Current Password
                  </label>
                  <Input type="password" placeholder="Enter current password" />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    New Password
                  </label>
                  <Input type="password" placeholder="Enter new password" />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Confirm New Password
                  </label>
                  <Input type="password" placeholder="Confirm new password" />
                </div>

                <Button>Update Password</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Enable 2FA</p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Badge variant="outline">Disabled</Badge>
                </div>
                <Button className="mt-4">Enable 2FA</Button>
              </CardContent>
            </Card>
          </div>
        )

      case 'APPEARANCE':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {isDarkMode ? (
                      <Moon className="h-5 w-5 text-foreground" />
                    ) : (
                      <Sun className="h-5 w-5 text-foreground" />
                    )}
                    <div>
                      <p className="font-medium text-foreground">
                        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Choose your preferred theme
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDarkMode(!isDarkMode)
                      document.documentElement.classList.toggle('dark')
                    }}
                  >
                    Toggle
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {['Blue', 'Purple', 'Green'].map((color) => (
                    <div
                      key={color}
                      className="p-4 border border-border rounded-lg text-center cursor-pointer hover:bg-accent transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-full mx-auto mb-2 bg-${color.toLowerCase()}-500`} />
                      <p className="text-sm font-medium">{color}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'DATA':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <Database className="h-6 w-6 mb-2" />
                    Export Data
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <Globe className="h-6 w-6 mb-2" />
                    Import Data
                  </Button>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">Backup Settings</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Automatic backups are enabled and run daily at 2:00 AM
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="success">Active</Badge>
                    <span className="text-sm text-muted-foreground">
                      Last backup: 2 hours ago
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-3">
          <SettingsIcon className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account and application preferences
            </p>
          </div>
        </div>
      </motion.div>

      {/* Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent text-foreground'
                      }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="lg:col-span-3"
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  )
}

export default Settings