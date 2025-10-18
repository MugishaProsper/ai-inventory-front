import React, { createContext, useContext, useEffect, useReducer, useState } from 'react'
import MessagingService, { Message, Conversation } from '@/services/messaging.service'
import { useAuth } from '@/context/AuthContext'

interface ChatState {
  conversations: Conversation[]
  currentConversation: Conversation | null
  messages: Message[]
  loading: boolean
  error: string | null
  unreadCount: number
  searchResults: Message[]
  searching: boolean
}

type ChatAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CONVERSATIONS'; payload: Conversation[] }
  | { type: 'SET_CURRENT_CONVERSATION'; payload: Conversation | null }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_MESSAGE'; payload: Message }
  | { type: 'DELETE_MESSAGE'; payload: string }
  | { type: 'SET_UNREAD_COUNT'; payload: number }
  | { type: 'SET_SEARCH_RESULTS'; payload: Message[] }
  | { type: 'SET_SEARCHING'; payload: boolean }
  | { type: 'MARK_MESSAGES_READ'; payload: string[] }

const initialState: ChatState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  loading: false,
  error: null,
  unreadCount: 0,
  searchResults: [],
  searching: false,
}

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.payload, loading: false, error: null }
    case 'SET_CURRENT_CONVERSATION':
      return { ...state, currentConversation: action.payload }
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload, loading: false, error: null }
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] }
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg._id === action.payload._id ? action.payload : msg
        )
      }
    case 'DELETE_MESSAGE':
      return {
        ...state,
        messages: state.messages.filter(msg => msg._id !== action.payload)
      }
    case 'SET_UNREAD_COUNT':
      return { ...state, unreadCount: action.payload }
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload, searching: false }
    case 'SET_SEARCHING':
      return { ...state, searching: action.payload }
    case 'MARK_MESSAGES_READ':
      return {
        ...state,
        messages: state.messages.map(msg =>
          action.payload.includes(msg._id) ? { ...msg, read: true } : msg
        )
      }
    default:
      return state
  }
}

interface ChatContextType extends ChatState {
  // Conversation actions
  loadConversations: () => Promise<void>
  selectConversation: (conversationId: string) => Promise<void>
  createConversation: (participantIds: string[]) => Promise<void>
  deleteConversation: (conversationId: string) => Promise<void>

  // Message actions
  sendMessage: (receiverId: string, message: string, files?: string[]) => Promise<void>
  loadMessages: (conversationId: string) => Promise<void>
  markAsRead: (messageId: string) => Promise<void>
  deleteMessage: (messageId: string) => Promise<void>

  // Utility actions
  loadUnreadCount: () => Promise<void>
  searchMessages: (query: string, conversationId?: string) => Promise<void>
  clearSearch: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState)
  const { user } = useAuth()
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null)

  // Load conversations
  const loadConversations = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await MessagingService.getConversations()
      dispatch({ type: 'SET_CONVERSATIONS', payload: response.data })
    } catch (error: any) {
      console.error('Failed to load conversations:', error)
      dispatch({ type: 'SET_ERROR', payload: error?.message || 'Failed to load conversations' })
    }
  }

  // Select conversation and load its messages
  const selectConversation = async (conversationId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })

      // Get conversation details
      const conversationResponse = await MessagingService.getConversation(conversationId)
      dispatch({ type: 'SET_CURRENT_CONVERSATION', payload: conversationResponse.data })

      // Load messages
      const messagesResponse = await MessagingService.getMessages(conversationId)
      dispatch({ type: 'SET_MESSAGES', payload: messagesResponse.data })

      // Mark messages as read
      const unreadMessages = messagesResponse.data.filter(msg =>
        msg.receiver._id === user?._id && !msg.read
      )
      if (unreadMessages.length > 0) {
        await Promise.all(unreadMessages.map(msg => MessagingService.markAsRead(msg._id)))
        dispatch({ type: 'MARK_MESSAGES_READ', payload: unreadMessages.map(msg => msg._id) })
      }

    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error?.message || 'Failed to load conversation' })
    }
  }

  // Create new conversation
  const createConversation = async (participantIds: string[]) => {
    try {
      const response = await MessagingService.createConversation({ participantIds })
      await loadConversations()
      await selectConversation(response.data._id)
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error?.message || 'Failed to create conversation' })
    }
  }

  // Delete conversation
  const deleteConversation = async (conversationId: string) => {
    try {
      await MessagingService.deleteConversation(conversationId)
      await loadConversations()
      if (state.currentConversation?._id === conversationId) {
        dispatch({ type: 'SET_CURRENT_CONVERSATION', payload: null })
        dispatch({ type: 'SET_MESSAGES', payload: [] })
      }
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error?.message || 'Failed to delete conversation' })
    }
  }

  // Send message
  const sendMessage = async (receiverId: string, message: string, files?: string[]) => {
    try {
      const response = await MessagingService.sendMessage({ receiverId, message, files })
      dispatch({ type: 'ADD_MESSAGE', payload: response.data })

      // Update conversation list
      await loadConversations()
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error?.message || 'Failed to send message' })
    }
  }

  // Load messages for current conversation
  const loadMessages = async (conversationId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await MessagingService.getMessages(conversationId)
      dispatch({ type: 'SET_MESSAGES', payload: response.data })
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error?.message || 'Failed to load messages' })
    }
  }

  // Mark message as read
  const markAsRead = async (messageId: string) => {
    try {
      const response = await MessagingService.markAsRead(messageId)
      dispatch({ type: 'UPDATE_MESSAGE', payload: response.data })
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error?.message || 'Failed to mark message as read' })
    }
  }

  // Delete message
  const deleteMessage = async (messageId: string) => {
    try {
      await MessagingService.deleteMessage(messageId)
      dispatch({ type: 'DELETE_MESSAGE', payload: messageId })
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error?.message || 'Failed to delete message' })
    }
  }

  // Load unread count
  const loadUnreadCount = async () => {
    try {
      const response = await MessagingService.getUnreadCount()
      dispatch({ type: 'SET_UNREAD_COUNT', payload: response.data.unreadCount })
    } catch (error: any) {
      console.error('Failed to load unread count:', error)
    }
  }

  // Search messages
  const searchMessages = async (query: string, conversationId?: string) => {
    try {
      dispatch({ type: 'SET_SEARCHING', payload: true })
      const response = await MessagingService.searchMessages(query, conversationId)
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: response.data })
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error?.message || 'Failed to search messages' })
    }
  }

  // Clear search results
  const clearSearch = () => {
    dispatch({ type: 'SET_SEARCH_RESULTS', payload: [] })
  }

  // Auto-refresh conversations and unread count
  useEffect(() => {
    if (user) {
      loadConversations()
      loadUnreadCount()

      // Set up auto-refresh every 30 seconds
      const interval = setInterval(() => {
        loadConversations()
        loadUnreadCount()
      }, 30000)

      setRefreshInterval(interval)

      return () => {
        if (interval) clearInterval(interval)
      }
    }
  }, [user])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshInterval) clearInterval(refreshInterval)
    }
  }, [refreshInterval])

  return (
    <ChatContext.Provider value={{
      ...state,
      loadConversations,
      selectConversation,
      createConversation,
      deleteConversation,
      sendMessage,
      loadMessages,
      markAsRead,
      deleteMessage,
      loadUnreadCount,
      searchMessages,
      clearSearch,
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
