import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { api } from '../services/api';
import { mockServices } from '../data/mockServices';

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  suggestedPrice?: number;
  category: string;
  subCategory?: string;
  images: string[];
  userId: string;
  username: string;
  userAvatar?: string;
  rating: number;
  reviewCount: number;
  isPopular?: boolean;
  isFeatured?: boolean;
  tags: string[];
  deliveryTime: number;
  createdAt: string;
}

interface PricingData {
  budget: { price: number; description: string };
  standard: { price: number; description: string };
  premium: { price: number; description: string };
  recommended: { price: number; confidence: number; reasoning: string };
  market: {
    categoryAverage: number;
    competition: 'low' | 'medium' | 'high';
    demand: 'low' | 'medium' | 'high';
    minPrice: number;
    maxPrice: number;
  };
  factors: Array<{ name: string; impact: number; description: string }>;
  tips: string[];
}

interface ServiceState {
  services: Service[];
  featuredServices: Service[];
  popularServices: Service[];
  currentService: Service | null;
  userServices: Service[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchAllServices: () => Promise<void>;
  fetchServiceById: (id: string) => Promise<Service | null>;
  fetchUserServices: (userId: string) => Promise<void>;
  createService: (service: Omit<Service, 'id' | 'userId' | 'username' | 'userAvatar' | 'rating' | 'reviewCount' | 'createdAt'>) => Promise<Service>;
  updateService: (id: string, updates: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  getSuggestedPrice: (category: string, description: string) => Promise<number>;
  getAdvancedPricingSuggestion: (category: string, description: string) => Promise<PricingData>;
}

export const useServiceStore = create<ServiceState>((set, get) => ({
  services: [],
  featuredServices: [],
  popularServices: [],
  currentService: null,
  userServices: [],
  isLoading: false,
  error: null,
  
  fetchAllServices: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock API call - simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo purposes, we're using mock data
      set({ 
        services: mockServices,
        featuredServices: mockServices.filter(s => s.isFeatured),
        popularServices: mockServices.filter(s => s.isPopular),
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to load services');
    }
  },
  
  fetchServiceById: async (id) => {
    set({ isLoading: true, error: null, currentService: null });
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const service = mockServices.find(s => s.id === id) || null;
      set({ currentService: service, isLoading: false });
      return service;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to load service details');
      return null;
    }
  },
  
  fetchUserServices: async (userId) => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 700));
      
      const userServices = mockServices.filter(s => s.userId === userId);
      set({ userServices, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to load user services');
    }
  },
  
  createService: async (serviceData) => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get user data from auth store
      const user = JSON.parse(localStorage.getItem('craftopia_user') || '{}');
      
      // Create new service with mock data
      const newService: Service = {
        id: `service-${Date.now()}`,
        ...serviceData,
        userId: user.id || '1',
        username: user.username || 'craftlover',
        userAvatar: user.avatar,
        rating: 0,
        reviewCount: 0,
        createdAt: new Date().toISOString(),
      };
      
      // Update state
      set(state => ({
        services: [newService, ...state.services],
        userServices: [newService, ...state.userServices],
        isLoading: false
      }));
      
      toast.success('Service created successfully');
      return newService;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to create service');
      throw error;
    }
  },
  
  updateService: async (id, updates) => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set(state => {
        // Update in services array
        const updatedServices = state.services.map(service => 
          service.id === id ? { ...service, ...updates } : service
        );
        
        // Update in userServices array
        const updatedUserServices = state.userServices.map(service => 
          service.id === id ? { ...service, ...updates } : service
        );
        
        // Update currentService if it's the one being edited
        const updatedCurrentService = state.currentService?.id === id 
          ? { ...state.currentService, ...updates } 
          : state.currentService;
        
        return {
          services: updatedServices,
          userServices: updatedUserServices,
          currentService: updatedCurrentService,
          isLoading: false
        };
      });
      
      toast.success('Service updated successfully');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to update service');
    }
  },
  
  deleteService: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 700));
      
      set(state => ({
        services: state.services.filter(service => service.id !== id),
        userServices: state.userServices.filter(service => service.id !== id),
        isLoading: false
      }));
      
      toast.success('Service deleted successfully');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to delete service');
    }
  },
  
  getSuggestedPrice: async (category, description) => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock AI pricing algorithm
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Generate a realistic price based on category
      let basePrice = 0;
      switch (category) {
        case 'graphic-design':
          basePrice = 45;
          break;
        case 'digital-art':
          basePrice = 60;
          break;
        case 'handmade-crafts':
          basePrice = 35;
          break;
        case 'photography':
          basePrice = 80;
          break;
        case 'music-production':
          basePrice = 70;
          break;
        case 'writing-translation':
          basePrice = 40;
          break;
        default:
          basePrice = 50;
      }
      
      // Add some randomness to the price
      const variance = basePrice * 0.2; // 20% variance
      const randomFactor = Math.random() * variance - variance / 2;
      const suggestedPrice = Math.round(basePrice + randomFactor);
      
      set({ isLoading: false });
      return suggestedPrice;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to get price suggestion');
      return 50; // Default fallback price
    }
  },

  getAdvancedPricingSuggestion: async (category, description) => {
    set({ isLoading: true, error: null });
    
    try {
      // Mock advanced AI pricing algorithm
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Base pricing by category
      const categoryPricing = {
        'graphic-design': { base: 45, min: 25, max: 150 },
        'digital-art': { base: 60, min: 30, max: 200 },
        'handmade-crafts': { base: 35, min: 20, max: 120 },
        'photography': { base: 80, min: 50, max: 300 },
        'music-production': { base: 70, min: 40, max: 250 },
        'writing-translation': { base: 40, min: 15, max: 100 },
        'web-development': { base: 120, min: 80, max: 500 },
      };
      
      const pricing = categoryPricing[category as keyof typeof categoryPricing] || { base: 50, min: 25, max: 150 };
      
      // Analyze description for complexity factors
      const complexityFactors = [
        { keyword: ['custom', 'unique', 'original'], impact: 15 },
        { keyword: ['professional', 'high-quality', 'premium'], impact: 20 },
        { keyword: ['quick', 'fast', 'urgent', 'rush'], impact: 25 },
        { keyword: ['simple', 'basic', 'minimal'], impact: -10 },
        { keyword: ['complex', 'detailed', 'intricate'], impact: 30 },
        { keyword: ['revision', 'unlimited', 'multiple'], impact: 10 },
      ];
      
      let complexityMultiplier = 1;
      const appliedFactors: Array<{ name: string; impact: number; description: string }> = [];
      
      complexityFactors.forEach(factor => {
        const hasKeyword = factor.keyword.some(keyword => 
          description.toLowerCase().includes(keyword)
        );
        if (hasKeyword) {
          const impact = factor.impact;
          complexityMultiplier += impact / 100;
          appliedFactors.push({
            name: factor.keyword[0].charAt(0).toUpperCase() + factor.keyword[0].slice(1) + ' service',
            impact,
            description: `Service includes ${factor.keyword[0]} elements`
          });
        }
      });
      
      // Market conditions (simulated)
      const marketConditions = {
        competition: Math.random() > 0.5 ? 'medium' : Math.random() > 0.3 ? 'high' : 'low',
        demand: Math.random() > 0.4 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low'
      };
      
      // Apply market adjustments
      let marketMultiplier = 1;
      if (marketConditions.competition === 'high') marketMultiplier -= 0.1;
      if (marketConditions.competition === 'low') marketMultiplier += 0.15;
      if (marketConditions.demand === 'high') marketMultiplier += 0.2;
      if (marketConditions.demand === 'low') marketMultiplier -= 0.15;
      
      // Calculate final prices
      const basePrice = pricing.base * complexityMultiplier * marketMultiplier;
      
      const pricingData: PricingData = {
        budget: {
          price: Math.round(basePrice * 0.7),
          description: 'Competitive pricing to attract more customers'
        },
        standard: {
          price: Math.round(basePrice),
          description: 'Market-aligned pricing for optimal balance'
        },
        premium: {
          price: Math.round(basePrice * 1.4),
          description: 'Premium pricing for high-value positioning'
        },
        recommended: {
          price: Math.round(basePrice),
          confidence: Math.round(75 + Math.random() * 20),
          reasoning: 'Based on market analysis and service complexity'
        },
        market: {
          categoryAverage: Math.round(pricing.base),
          competition: marketConditions.competition as 'low' | 'medium' | 'high',
          demand: marketConditions.demand as 'low' | 'medium' | 'high',
          minPrice: pricing.min,
          maxPrice: pricing.max
        },
        factors: [
          ...appliedFactors,
          {
            name: 'Market competition',
            impact: marketConditions.competition === 'high' ? -10 : 
                   marketConditions.competition === 'low' ? 15 : 0,
            description: `${marketConditions.competition} competition in this category`
          },
          {
            name: 'Market demand',
            impact: marketConditions.demand === 'high' ? 20 : 
                   marketConditions.demand === 'low' ? -15 : 0,
            description: `${marketConditions.demand} demand for this service type`
          }
        ],
        tips: [
          'Consider offering package deals to increase average order value',
          'Monitor competitor pricing regularly and adjust accordingly',
          'Highlight unique value propositions to justify premium pricing',
          'Start with competitive pricing and increase as you build reviews',
          'Offer different service tiers to capture various customer segments'
        ]
      };
      
      set({ isLoading: false });
      return pricingData;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to get advanced pricing suggestion');
      throw error;
    }
  }
}));