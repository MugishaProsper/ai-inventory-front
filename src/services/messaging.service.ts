import api from "@/lib/api";
import { ApiResponse } from "@/types/api.types";

export interface Message {
  _id: string;
  sender: {
    _id: string;
    fullname: string;
    username: string;
    email: string;
  };
  receiver: {
    _id: string;
    fullname: string;
    username: string;
    email: string;
  };
  message: string;
  files: string[];
  read: boolean;
  conversation: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  users: Array<{
    _id: string;
    fullname: string;
    username: string;
    email: string;
  }>;
  messages: string[];
  lastMessage?: {
    _id: string;
    message?: string;
    sender: {
      _id: string;
      fullname: string;
      username: string;
    } | null;
    read: boolean;
    createdAt: string;
  } | null;
  unreadCount?: number;
  updatedAt: string;
  createdAt: string;
}

export interface SendMessageRequest {
  receiverId: string;
  message: string;
  files?: string[];
}

export interface CreateConversationRequest {
  participantIds: string[];
}

export interface UpdateConversationRequest {
  action: 'add' | 'remove';
  userId: string;
}

const MessagingService = {
  async sendMessage(payload: SendMessageRequest): Promise<ApiResponse<Message>> {
    const response = await api.post("/messages", payload);
    return response.data;
  },

  async getMessages(conversationId: string, page = 1, limit = 50): Promise<ApiResponse<Message[]>> {
    const response = await api.get(`/messages/conversation/${conversationId}`, {
      params: { page, limit }
    });
    return response.data;
  },

  async markAsRead(messageId: string): Promise<ApiResponse<Message>> {
    const response = await api.put(`/messages/${messageId}/read`);
    return response.data;
  },

  async deleteMessage(messageId: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/messages/${messageId}`);
    return response.data;
  },

  async getUnreadCount(): Promise<ApiResponse<{ unreadCount: number }>> {
    const response = await api.get("/messages/unread/count");
    return response.data;
  },

  async searchMessages(query: string, conversationId?: string): Promise<ApiResponse<Message[]>> {
    const response = await api.get("/messages/search", {
      params: { query, conversationId }
    });
    return response.data;
  },

  // Conversation operations
  async createConversation(payload: CreateConversationRequest): Promise<ApiResponse<Conversation>> {
    const response = await api.post("/conversations", payload);
    return response.data;
  },

  async getConversations(page = 1, limit = 20): Promise<ApiResponse<Conversation[]>> {
    const response = await api.get("/conversations", {
      params: { page, limit }
    });
    return response.data;
  },

  async getConversation(conversationId: string): Promise<ApiResponse<Conversation>> {
    const response = await api.get(`/conversations/${conversationId}`);
    return response.data;
  },

  async getConversationBetweenUsers(userId: string): Promise<ApiResponse<Conversation>> {
    const response = await api.get(`/conversations/user/${userId}`);
    return response.data;
  },

  async updateConversation(conversationId: string, payload: UpdateConversationRequest): Promise<ApiResponse<Conversation>> {
    const response = await api.put(`/conversations/${conversationId}`, payload);
    return response.data;
  },

  async deleteConversation(conversationId: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/conversations/${conversationId}`);
    return response.data;
  },
};

export default MessagingService;
