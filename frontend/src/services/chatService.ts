import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastSeen: string;
  isOnline: boolean;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file';
}

interface BackendChat {
  _id: string;
  senderId: { name: string; profileImage: string; _id: string };
  receiverId: { name: string; profileImage: string; _id: string };
  lastMessage: string;
  lastMessageAt: string;
}

interface BackendMessage {
  _id: string;
  messageContent: string;
  senderModel: 'user' | 'owner';
  sendedTime: string;
  seen: boolean;
  messageType?: 'text' | 'image' | 'file';
}

export interface ChatResponse {
  success: boolean;
  data: {
    chats: BackendChat[];
    hasMore: boolean;
  };
}

export interface MessagesResponse {
  success: boolean;
  data: {
    messages: BackendMessage[];
    hasMore: boolean;
  };
}

export class ChatService {
  private static instance: ChatService;
  
  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  async getUserChats(userId: string, page: number = 1): Promise<ChatContact[]> {
    try {
      const response = await axios.get<ChatResponse>(`${API_BASE_URL}/chats/user/${userId}?page=${page}`);
      
      if (response.data.success) {
        return response.data.data.chats.map(chat => ({
          id: chat._id,
          name: chat.senderId._id === userId ? chat.receiverId.name : chat.senderId.name,
          avatar: chat.senderId._id === userId ? chat.receiverId.profileImage : chat.senderId.profileImage,
          lastSeen: chat.senderId._id === userId ? 'Active now' : '2 hours ago',
          isOnline: false,
          lastMessage: chat.lastMessage,
          lastMessageTime: new Date(chat.lastMessageAt),
          unreadCount: 0
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching user chats:', error);
      return [];
    }
  }

  async getChatMessages(chatId: string, page: number = 1): Promise<Message[]> {
    try {
      const response = await axios.get<MessagesResponse>(`${API_BASE_URL}/chats/${chatId}/messages?page=${page}`);
      
      if (response.data.success) {
        return response.data.data.messages.map(msg => ({
          id: msg._id,
          text: msg.messageContent,
          sender: msg.senderModel === 'user' ? 'user' : 'other', // This needs current user context
          timestamp: new Date(msg.sendedTime),
          status: msg.seen ? 'read' : 'delivered',
          type: msg.messageType || 'text'
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      return [];
    }
  }

  async markMessageAsSeen(messageId: string): Promise<boolean> {
    try {
      const response = await axios.patch(`${API_BASE_URL}/messages/${messageId}/seen`);
      return response.data.success;
    } catch (error) {
      console.error('Error marking message as seen:', error);
      return false;
    }
  }

  async markAllMessagesAsSeenInChat(chatId: string, userId: string): Promise<boolean> {
    try {
      const response = await axios.patch(`${API_BASE_URL}/chats/${chatId}/messages/seen`, {
        userId
      });
      return response.data.success;
    } catch (error) {
      console.error('Error marking all messages as seen:', error);
      return false;
    }
  }
}
