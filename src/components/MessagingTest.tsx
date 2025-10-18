// Test component to verify messaging API
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import MessagingService from '@/services/messaging.service'

const MessagingTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([])

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testAPI = async () => {
    setTestResults([])
    addResult('Starting API tests...')

    try {
      // Test 1: Get conversations
      addResult('Testing getConversations...')
      const conversationsResponse = await MessagingService.getConversations()
      addResult(`Conversations: ${JSON.stringify(conversationsResponse)}`)

      // Test 2: Get unread count
      addResult('Testing getUnreadCount...')
      const unreadResponse = await MessagingService.getUnreadCount()
      addResult(`Unread count: ${JSON.stringify(unreadResponse)}`)

    } catch (error: any) {
      addResult(`Error: ${error.message}`)
      console.error('API Test Error:', error)
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Messaging API Test</h2>
      <Button onClick={testAPI} className="mb-4">Run API Tests</Button>
      <div className="space-y-2">
        {testResults.map((result, index) => (
          <div key={index} className="text-sm font-mono bg-muted p-2 rounded">
            {result}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MessagingTest
