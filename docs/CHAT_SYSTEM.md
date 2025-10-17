# Chat System Frontend Documentation

## Overview
The Chat system provides a comprehensive messaging interface for the inventory management system, allowing users to communicate in real-time with other users.

## Components Created

### 1. Messaging Service (`messaging.service.ts`)
**Purpose**: Handles all API communication with the backend messaging endpoints.

**Key Features**:
- Type-safe interfaces for `Message` and `Conversation`
- Complete CRUD operations for messages and conversations
- Search functionality
- Unread count tracking

**Main Methods**:
```typescript
// Message operations
sendMessage(payload: SendMessageRequest): Promise<ApiResponse<Message>>
getMessages(conversationId: string, page?: number, limit?: number): Promise<ApiResponse<Message[]>>
markAsRead(messageId: string): Promise<ApiResponse<Message>>
deleteMessage(messageId: string): Promise<ApiResponse<void>>
getUnreadCount(): Promise<ApiResponse<{ unreadCount: number }>>
searchMessages(query: string, conversationId?: string): Promise<ApiResponse<Message[]>>

// Conversation operations
createConversation(payload: CreateConversationRequest): Promise<ApiResponse<Conversation>>
getConversations(page?: number, limit?: number): Promise<ApiResponse<Conversation[]>>
getConversation(conversationId: string): Promise<ApiResponse<Conversation>>
getConversationBetweenUsers(userId: string): Promise<ApiResponse<Conversation>>
updateConversation(conversationId: string, payload: UpdateConversationRequest): Promise<ApiResponse<Conversation>>
deleteConversation(conversationId: string): Promise<ApiResponse<void>>
```

### 2. Chat Context (`ChatContext.tsx`)
**Purpose**: Centralized state management for all chat-related functionality.

**State Management**:
- Conversations list with unread counts
- Current conversation and its messages
- Loading states and error handling
- Search results
- Auto-refresh functionality (30-second intervals)

**Key Actions**:
- `loadConversations()` - Fetch all user conversations
- `selectConversation(id)` - Load conversation and its messages
- `sendMessage(receiverId, message, files?)` - Send new message
- `searchMessages(query, conversationId?)` - Search through messages
- `markAsRead(messageId)` - Mark message as read
- `deleteMessage(messageId)` - Delete a message

### 3. Chat Page (`Chat.tsx`)
**Purpose**: Main UI component providing the complete chat interface.

**Layout Structure**:
```
┌─────────────────────────────────────────────────────────┐
│ Sidebar (320px)        │ Main Chat Area (flex-1)        │
│ ┌─────────────────────┐│ ┌─────────────────────────────┐│
│ │ Header + Search     ││ │ Chat Header                 ││
│ ├─────────────────────┤│ ├─────────────────────────────┤│
│ │ Conversations List  ││ │ Messages Area               ││
│ │ - User avatars      ││ │ - Message bubbles           ││
│ │ - Last messages     ││ │ - Timestamps                ││
│ │ - Unread badges     ││ │ - Read receipts             ││
│ │ - Time stamps       ││ │ - Auto-scroll               ││
│ └─────────────────────┘│ ├─────────────────────────────┤│
│                        │ │ Message Input                ││
│                        │ │ - File attachment            ││
│                        │ │ - Send button                ││
│                        │ └─────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

**Key Features**:
- **Responsive Design**: Works on desktop and mobile
- **Real-time Updates**: Auto-refresh conversations every 30 seconds
- **Search Functionality**: Search through conversations and messages
- **File Attachments**: Support for file uploads (UI ready, backend integration pending)
- **Message Status**: Read receipts with checkmarks
- **Unread Indicators**: Badge counts for unread messages
- **Smooth Animations**: Framer Motion transitions

## UI Components

### Conversation List
- **User Avatars**: Gradient background with user icons
- **User Names**: Full name display
- **Last Message Preview**: Truncated last message
- **Timestamps**: Relative time (e.g., "2 hours ago")
- **Unread Badges**: Red badges showing unread count
- **Read Receipts**: Check/CheckCheck icons for sent messages

### Message Display
- **Message Bubbles**: Different styles for sent vs received
- **Timestamps**: Below each message
- **Read Receipts**: Check marks for message status
- **Auto-scroll**: Automatically scrolls to latest message
- **Responsive**: Adapts to different screen sizes

### Message Input
- **Text Input**: Multi-line text input
- **File Attachment**: Paperclip icon for file uploads
- **Send Button**: Disabled when input is empty
- **Enter to Send**: Press Enter to send message

### Search Modal
- **Search Results**: Displays matching messages
- **Context Information**: Shows sender and timestamp
- **Modal Overlay**: Click outside to close

## Navigation Integration

### Sidebar Navigation
- **Chat Menu Item**: Added to main navigation
- **Icon**: MessageCircle from Lucide React
- **Route**: `/chat`
- **Position**: Between AI Insights and Settings

### Route Configuration
```typescript
<Route
  path="/chat"
  element={
    <ProtectedRoute>
      <Layout>
        <Chat />
      </Layout>
    </ProtectedRoute>
  }
/>
```

## State Management Flow

### Initial Load
1. User navigates to `/chat`
2. `ChatProvider` initializes
3. `loadConversations()` fetches user conversations
4. `loadUnreadCount()` gets unread message count
5. Auto-refresh interval starts (30 seconds)

### Conversation Selection
1. User clicks on conversation in sidebar
2. `selectConversation(conversationId)` called
3. Conversation details loaded
4. Messages fetched and displayed
5. Unread messages marked as read

### Sending Messages
1. User types message and clicks send
2. `sendMessage(receiverId, message)` called
3. Message added to local state immediately
4. Conversation list refreshed
5. Auto-scroll to bottom

### Search Flow
1. User types in search box
2. `searchMessages(query)` called
3. Results displayed in modal
4. User can close modal to return to chat

## Error Handling

### Network Errors
- Graceful error messages displayed
- Retry mechanisms for failed requests
- Loading states during API calls

### Validation Errors
- Input validation for message length
- File type validation for attachments
- Required field validation

### State Errors
- Fallback UI for missing data
- Error boundaries for component crashes
- Console logging for debugging

## Performance Optimizations

### Auto-refresh
- 30-second intervals for conversation updates
- Cleanup on component unmount
- Conditional refresh based on user activity

### Message Pagination
- Load messages in batches (50 per page)
- Lazy loading for large conversations
- Efficient re-rendering with React keys

### Memory Management
- Proper cleanup of intervals
- Efficient state updates
- Minimal re-renders with proper dependencies

## Future Enhancements

### Real-time Features
- WebSocket integration for instant messaging
- Push notifications for new messages
- Online/offline status indicators

### Advanced Features
- Message reactions and emojis
- Message forwarding and replies
- Voice messages and video calls
- Message encryption

### UI Improvements
- Dark/light theme support
- Customizable chat themes
- Message threading
- Advanced search filters

## Usage Examples

### Basic Chat Flow
```typescript
// Load conversations
const { loadConversations } = useChat()
await loadConversations()

// Select conversation
const { selectConversation } = useChat()
await selectConversation('conversation-id')

// Send message
const { sendMessage } = useChat()
await sendMessage('user-id', 'Hello, how are you?')

// Search messages
const { searchMessages } = useChat()
await searchMessages('inventory')
```

### Error Handling
```typescript
try {
  await sendMessage(receiverId, message)
} catch (error) {
  console.error('Failed to send message:', error)
  // Error is automatically handled by context
}
```

The Chat system is now fully integrated and ready for use, providing a complete messaging experience within the inventory management system.
