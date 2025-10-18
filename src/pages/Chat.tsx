import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  MessageCircle, Search, Send, Paperclip, MoreVertical,
  Phone, Video, Plus, Edit, Trash2, UserPlus,
  ArrowLeft, User, Check, CheckCheck, X, Save
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
    selectConversation,
    sendMessage,
    searchMessages,
    updateConversationName,
    deleteConversation,
    addUserToConversation,
    updateMessage,
    deleteMessage
  } = useChat()

  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [messageText, setMessageText] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showConversationDropdown, setShowConversationDropdown] = useState(false)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [conversationName, setConversationName] = useState('')
  const [editingMessage, setEditingMessage] = useState<string | null>(null)
  const [editMessageText, setEditMessageText] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showConversationDropdown) {
        setShowConversationDropdown(false)
      }
    }

    if (showConversationDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showConversationDropdown])

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

  // Handle conversation actions
  const handleRenameConversation = async () => {
    if (!currentConversation || !conversationName.trim()) return

    try {
      await updateConversationName(currentConversation._id, conversationName.trim())
      setShowRenameModal(false)
      setConversationName('')
    } catch (error) {
      console.error('Failed to rename conversation:', error)
    }
  }

  const handleDeleteConversation = async () => {
    if (!currentConversation) return

    if (window.confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      try {
        await deleteConversation(currentConversation._id)
        setShowConversationDropdown(false)
      } catch (error) {
        console.error('Failed to delete conversation:', error)
      }
    }
  }

  const handleAddUserToConversation = async () => {
    if (!currentConversation || !newUserEmail.trim()) return

    try {
      await addUserToConversation(currentConversation._id, newUserEmail.trim())
      setShowAddUserModal(false)
      setNewUserEmail('')
    } catch (error) {
      console.error('Failed to add user to conversation:', error)
    }
  }

  // Handle message actions
  const handleEditMessage = (messageId: string, currentText: string) => {
    setEditingMessage(messageId)
    setEditMessageText(currentText)
  }

  const handleSaveMessageEdit = async (messageId: string) => {
    if (!editMessageText.trim()) return

    try {
      await updateMessage(messageId, editMessageText.trim())
      setEditingMessage(null)
      setEditMessageText('')
    } catch (error) {
      console.error('Failed to update message:', error)
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteMessage(messageId)
      } catch (error) {
        console.error('Failed to delete message:', error)
      }
    }
  }

  const handleCancelEdit = () => {
    setEditingMessage(null)
    setEditMessageText('')
  }

  // Format message time
  const formatMessageTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
  }

  // Get other user from conversation
  const getOtherUser = (conversation: any) => {
    // Handle both 'users' and 'participants' field names
    const users = conversation?.users || conversation?.participants
    if (!users || !Array.isArray(users)) {
      console.warn('Invalid conversation structure:', conversation)
      return null
    }
    return users.find((u: any) => u._id !== user?._id)
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Error Loading Chat</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
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
            <h1 className="text-xl font-semibold text-foreground">Inbox</h1>
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
          {conversations && conversations.length > 0 ? conversations.map((conversation) => {
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
          }) : (
            <div className="p-4 text-center text-muted-foreground">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No conversations yet</p>
            </div>
          )}
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

                  {/* Conversation Dropdown */}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowConversationDropdown(!showConversationDropdown)}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>

                    {showConversationDropdown && (
                      <div className="absolute right-0 top-10 w-48 bg-background border border-border rounded-lg shadow-lg z-50">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setShowRenameModal(true)
                              setShowConversationDropdown(false)
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted"
                          >
                            <Edit className="h-4 w-4 mr-3" />
                            Rename Conversation
                          </button>
                          <button
                            onClick={() => {
                              setShowAddUserModal(true)
                              setShowConversationDropdown(false)
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted"
                          >
                            <UserPlus className="h-4 w-4 mr-3" />
                            Add User
                          </button>
                          <button
                            onClick={handleDeleteConversation}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-3" />
                            Delete Conversation
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
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
                    {editingMessage === message._id ? (
                      // Edit mode
                      <div className="space-y-2">
                        <Input
                          value={editMessageText}
                          onChange={(e) => setEditMessageText(e.target.value)}
                          className="text-sm"
                          autoFocus
                        />
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSaveMessageEdit(message._id)}
                            className="h-6 px-2"
                          >
                            <Save className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleCancelEdit}
                            className="h-6 px-2"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Display mode
                      <div className="group">
                        <p className="text-sm">{message.message}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs opacity-70">
                            {formatMessageTime(message.createdAt)}
                          </span>
                          <div className="flex items-center space-x-1">
                            {isOwnMessage(message) && (
                              <>
                                <div className="flex items-center ml-2">
                                  {message.read ? (
                                    <CheckCheck className="h-4 w-4" />
                                  ) : (
                                    <Check className="h-4 w-4" />
                                  )}
                                </div>
                                {/* Message controls for owned messages */}
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 ml-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleEditMessage(message._id, message.message)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteMessage(message._id)}
                                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
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

      {/* Rename Conversation Modal */}
      {showRenameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowRenameModal(false)} />
          <div className="relative w-full max-w-md mx-auto bg-background rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Rename Conversation</h3>
              <Button variant="ghost" onClick={() => setShowRenameModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <Input
                placeholder="Enter conversation name"
                value={conversationName}
                onChange={(e) => setConversationName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleRenameConversation()}
              />

              <div className="flex items-center justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowRenameModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleRenameConversation} disabled={!conversationName.trim()}>
                  Rename
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddUserModal(false)} />
          <div className="relative w-full max-w-md mx-auto bg-background rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add User to Conversation</h3>
              <Button variant="ghost" onClick={() => setShowAddUserModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <Input
                placeholder="Enter user email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddUserToConversation()}
              />

              <div className="flex items-center justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddUserModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUserToConversation} disabled={!newUserEmail.trim()}>
                  Add User
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Chat
