import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { mockOrders } from '../data/mockOrders';

export interface Order {
  id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  price: number;
  originalPrice: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'under_revision';
  createdAt: string;
  completedAt?: string;
  requirements?: string;
  deliveryFiles?: string[];
  isReviewed: boolean;
}

interface OrderState {
  orders: Order[];
  buyerOrders: Order[];
  sellerOrders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchOrders: () => Promise<void>;
  fetchOrderById: (id: string) => Promise<Order | null>;
  createOrder: (serviceId: string, serviceTitle: string, serviceImage: string, sellerId: string, sellerName: string, price: number, originalPrice: number, requirements?: string) => Promise<Order>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  deliverOrder: (id: string, deliveryFiles: string[]) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  buyerOrders: [],
  sellerOrders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  
  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get user data
      const user = JSON.parse(localStorage.getItem('craftopia_user') || '{}');
      
      set({ 
        orders: mockOrders,
        buyerOrders: mockOrders.filter(order => order.buyerId === user.id),
        sellerOrders: mockOrders.filter(order => order.sellerId === user.id),
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to load orders');
    }
  },
  
  fetchOrderById: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const order = mockOrders.find(o => o.id === id) || null;
      set({ currentOrder: order, isLoading: false });
      return order;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to load order details');
      return null;
    }
  },
  
  createOrder: async (serviceId, serviceTitle, serviceImage, sellerId, sellerName, price, originalPrice, requirements) => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get user data
      const user = JSON.parse(localStorage.getItem('craftopia_user') || '{}');
      
      // Create new order
      const newOrder: Order = {
        id: `order-${Date.now()}`,
        serviceId,
        serviceTitle,
        serviceImage,
        buyerId: user.id,
        buyerName: user.name,
        sellerId,
        sellerName,
        price,
        originalPrice,
        status: 'pending',
        createdAt: new Date().toISOString(),
        requirements: requirements || '',
        isReviewed: false,
      };
      
      // Update state
      set(state => ({
        orders: [newOrder, ...state.orders],
        buyerOrders: [newOrder, ...state.buyerOrders],
        isLoading: false
      }));
      
      toast.success('Order placed successfully');
      return newOrder;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to create order');
      throw error;
    }
  },
  
  updateOrderStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Update order status
      const updateOrder = (order: Order) => {
        if (order.id !== id) return order;
        
        const updatedOrder = { ...order, status };
        
        // Add completedAt date if status is completed
        if (status === 'completed') {
          updatedOrder.completedAt = new Date().toISOString();
        }
        
        return updatedOrder;
      };
      
      set(state => ({
        orders: state.orders.map(updateOrder),
        buyerOrders: state.buyerOrders.map(updateOrder),
        sellerOrders: state.sellerOrders.map(updateOrder),
        currentOrder: state.currentOrder?.id === id 
          ? updateOrder(state.currentOrder) 
          : state.currentOrder,
        isLoading: false
      }));
      
      toast.success(`Order ${status.replace('_', ' ')}`);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to update order status');
    }
  },
  
  deliverOrder: async (id, deliveryFiles) => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update order with delivery files and change status
      const updateOrder = (order: Order) => {
        if (order.id !== id) return order;
        
        return {
          ...order,
          deliveryFiles,
          status: 'completed',
          completedAt: new Date().toISOString()
        };
      };
      
      set(state => ({
        orders: state.orders.map(updateOrder),
        buyerOrders: state.buyerOrders.map(updateOrder),
        sellerOrders: state.sellerOrders.map(updateOrder),
        currentOrder: state.currentOrder?.id === id 
          ? updateOrder(state.currentOrder) 
          : state.currentOrder,
        isLoading: false
      }));
      
      toast.success('Order delivered successfully');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to deliver order');
    }
  }
}));