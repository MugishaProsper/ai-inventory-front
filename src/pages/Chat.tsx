import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  MessageCircle, Search, Send, Paperclip, MoreVertical,
  Users, Phone, Video, Archive, Trash2, Plus,
  ArrowLeft, User, Clock, Check, CheckCheck
} from 'lucide-react'
import { useChat } from '@/context/ChatContext'
import { useAuth } from '@/context/AuthContext'
import { formatDistanceToNow } from 'date-fns'

const Chat: React.FC = () => {
  const {
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    unreadCount,
    searchResults,
    searching,
    selectConversation,
    sendMessage,
    searchMessages,
    clearSearch,
    deleteMessage,
    deleteConversation
  } = useChat()

  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [messageText, setMessageText] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle search
  const handleSearch = async () => {
    if (searchQuery.trim()) {
      await searchMessages(searchQuery, currentConversation?._id)
      setShowSearchResults(true)
    }
  }

  // Handle sending message
  const handleSendMessage = async () => {
    if (!messageText.trim() || !currentConversation) return

    const otherUser = currentConversation.users.find((u: any) => u._id !== user?._id)
    if (!otherUser) return

    await sendMessage(otherUser._id, messageText.trim())
    setMessageText('')
  }

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      // TODO: Implement file upload to cloudinary
      console.log('Files selected:', files)
    }
  }

  // Format message time
  const formatMessageTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
  }

  // Get other user from conversation
  const getOtherUser = (conversation: any) => {
    return conversation.users.find((u: any) => u._id !== user?._id)
  }

  // Check if message is from current user
  const isOwnMessage = (message: any) => {
    return message.sender._id === user?._id
  }

  if (loading && !currentConversation) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="h-full flex">
      {/* Sidebar - Conversations List */}
      <div className="w-80 border-r border-border bg-background">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-foreground">Messages</h1>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount}
                </Badge>
              )}
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => {
            const otherUser = getOtherUser(conversation)
            const isActive = currentConversation?._id === conversation._id

            return (
              <motion.div
                key={conversation._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${isActive ? 'bg-muted' : ''
                  }`}
                onClick={() => selectConversation(conversation._id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-foreground truncate">
                        {otherUser?.fullname || 'Unknown User'}
                      </h3>
                      {conversation.unreadCount && conversation.unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage?.message || 'No messages yet'}
                    </p>

                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">
                        {conversation.lastMessage ? formatMessageTime(conversation.lastMessage.createdAt) : ''}
                      </span>
                      {conversation.lastMessage && isOwnMessage(conversation.lastMessage) && (
                        <div className="flex items-center">
                          {conversation.lastMessage?.read ? ( // TODO: Fix this
                            <CheckCheck className="h-3 w-3 text-blue-500" />
                          ) : (
                            <Check className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border bg-background">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="sm" onClick={() => {
                    // Clear current conversation by navigating back
                    window.location.href = '/chat'
                  }}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">
                      {getOtherUser(currentConversation)?.fullname || 'Unknown User'}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {getOtherUser(currentConversation)?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isOwnMessage(message) ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isOwnMessage(message)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                    }`}>
                    <p className="text-sm">{message.message}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs opacity-70">
                        {formatMessageTime(message.createdAt)}
                      </span>
                      {isOwnMessage(message) && (
                        <div className="flex items-center ml-2">
                          {message.read ? (
                            <CheckCheck className="h-3 w-3" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-border bg-background">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>

                <Input
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />

                <Button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,application/pdf,.doc,.docx"
              />
            </div>
          </>
        ) : (
          /* No Conversation Selected */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Select a conversation
              </h2>
              <p className="text-muted-foreground">
                Choose a conversation from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Search Results Modal */}
      {showSearchResults && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSearchResults(false)} />
          <div className="relative w-full max-w-2xl mx-auto bg-background rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Search Results</h3>
              <Button variant="ghost" onClick={() => setShowSearchResults(false)}>
                ×
              </Button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {searchResults.map((message) => (
                <div key={message._id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{message.sender.fullname}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatMessageTime(message.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm">{message.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Chat
