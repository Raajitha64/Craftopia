import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { mockConversations, mockMessages } from '../data/mockMessages';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participantNames: string[];
  participantAvatars: string[];
  lastMessage?: string;
  lastMessageDate?: string;
  unreadCount: number;
  serviceId?: string;
  serviceTitle?: string;
}

interface MessageState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string, receiverId: string) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
  startConversation: (participantId: string, participantName: string, participantAvatar: string, serviceId?: string, serviceTitle?: string) => Promise<string>;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  error: null,
  
  fetchConversations: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 700));
      
      set({ conversations: mockConversations, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to load conversations');
    }
  },
  
  fetchMessages: async (conversationId) => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const conversation = mockConversations.find(c => c.id === conversationId) || null;
      const conversationMessages = mockMessages.filter(m => m.conversationId === conversationId);
      
      set({ 
        currentConversation: conversation,
        messages: conversationMessages,
        isLoading: false
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to load messages');
    }
  },
  
  sendMessage: async (conversationId, content, receiverId) => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Get user data
      const user = JSON.parse(localStorage.getItem('craftopia_user') || '{}');
      
      // Create new message
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        conversationId,
        senderId: user.id,
        receiverId,
        content,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      
      // Update messages array
      set(state => ({
        messages: [...state.messages, newMessage],
        isLoading: false
      }));
      
      // Update the conversation's last message
      set(state => ({
        conversations: state.conversations.map(conv => 
          conv.id === conversationId
            ? { 
                ...conv, 
                lastMessage: content,
                lastMessageDate: new Date().toISOString()
              }
            : conv
        ),
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to send message');
    }
  },
  
  markAsRead: async (conversationId) => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mark messages as read
      set(state => ({
        messages: state.messages.map(msg => 
          msg.conversationId === conversationId
            ? { ...msg, isRead: true }
            : msg
        ),
        isLoading: false
      }));
      
      // Update conversation unread count
      set(state => ({
        conversations: state.conversations.map(conv => 
          conv.id === conversationId
            ? { ...conv, unreadCount: 0 }
            : conv
        ),
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to mark messages as read');
    }
  },
  
  startConversation: async (participantId, participantName, participantAvatar, serviceId, serviceTitle) => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get user data
      const user = JSON.parse(localStorage.getItem('craftopia_user') || '{}');
      
      // Check if conversation already exists
      const existingConversation = get().conversations.find(c => 
        c.participantIds.includes(participantId) && c.serviceId === serviceId
      );
      
      if (existingConversation) {
        return existingConversation.id;
      }
      
      // Create new conversation
      const newConversationId = `conv-${Date.now()}`;
      const newConversation: Conversation = {
        id: newConversationId,
        participantIds: [user.id, participantId],
        participantNames: [user.name, participantName],
        participantAvatars: [user.avatar || '', participantAvatar || ''],
        unreadCount: 0,
        serviceId,
        serviceTitle,
      };
      
      // Update state
      set(state => ({
        conversations: [newConversation, ...state.conversations],
        isLoading: false
      }));
      
      return newConversationId;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to start conversation');
      throw error;
    }
  }
}));