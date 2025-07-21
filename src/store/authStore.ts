import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { api } from '../services/api';

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  bio?: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  checkAuth: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string, name: string) => Promise<void>;
  signOut: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  checkAuth: async () => {
    // In a real app, we'd verify the token with the backend
    // For demo purposes, we'll check localStorage
    const token = localStorage.getItem('craftopia_token');
    const userData = localStorage.getItem('craftopia_user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        set({ user, isAuthenticated: true });
      } catch (error) {
        localStorage.removeItem('craftopia_token');
        localStorage.removeItem('craftopia_user');
        set({ user: null, isAuthenticated: false });
      }
    }
  },
  
  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock API call - in a real app this would be an actual API request
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Demo credentials check
      if (email === 'demo@craftopia.com' && password === 'password') {
        const mockUser: User = {
          id: '1',
          username: 'craftlover',
          email: 'demo@craftopia.com',
          name: 'Alex Johnson',
          bio: 'Passionate artist specializing in digital illustrations and hand-painted crafts.',
          avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150',
          isVerified: true,
          createdAt: new Date().toISOString(),
        };
        
        // Store user data and token
        localStorage.setItem('craftopia_token', 'mock_jwt_token');
        localStorage.setItem('craftopia_user', JSON.stringify(mockUser));
        
        set({ user: mockUser, isAuthenticated: true, isLoading: false });
        toast.success('Welcome back to Craftopia!');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error(error.message || 'Failed to sign in');
    }
  },
  
  signUp: async (email, password, username, name) => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '2',
        username,
        email,
        name,
        isVerified: false,
        createdAt: new Date().toISOString(),
      };
      
      // Store user data and token
      localStorage.setItem('craftopia_token', 'mock_jwt_token');
      localStorage.setItem('craftopia_user', JSON.stringify(mockUser));
      
      set({ user: mockUser, isAuthenticated: true, isLoading: false });
      toast.success('Welcome to Craftopia!');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error(error.message || 'Failed to create account');
    }
  },
  
  signOut: () => {
    localStorage.removeItem('craftopia_token');
    localStorage.removeItem('craftopia_user');
    set({ user: null, isAuthenticated: false });
    toast.success('You have been signed out');
  },
  
  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const currentUser = localStorage.getItem('craftopia_user');
      if (currentUser) {
        const updatedUser = { ...JSON.parse(currentUser), ...data };
        localStorage.setItem('craftopia_user', JSON.stringify(updatedUser));
        set({ user: updatedUser, isLoading: false });
        toast.success('Profile updated successfully');
      } else {
        throw new Error('No user data found');
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error(error.message || 'Failed to update profile');
    }
  },
}));