import React, { useEffect, useState } from 'react';
import { Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, ShoppingCart, MessageSquare, Settings, 
  User, Star, PlusCircle, Menu, ArrowRight
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { useServiceStore } from '../store/serviceStore';
import { useOrderStore } from '../store/orderStore';
import { useMessageStore } from '../store/messageStore';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

// Sub-pages
const MyServices = React.lazy(() => import('./dashboard/MyServices'));
const MyOrders = React.lazy(() => import('./dashboard/MyOrders'));
const OrderDetails = React.lazy(() => import('./dashboard/OrderDetails'));
const MyService = React.lazy(() => import('./dashboard/MyService'));
const ProfileSettings = React.lazy(() => import('./dashboard/ProfileSettings'));

const DashboardPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { fetchUserServices, userServices } = useServiceStore();
  const { fetchOrders, buyerOrders, sellerOrders } = useOrderStore();
  const { fetchConversations, conversations } = useMessageStore();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchUserServices(user?.id || ''),
          fetchOrders(),
          fetchConversations()
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [fetchUserServices, fetchOrders, fetchConversations, user?.id]);
  
  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  // Navigation items
  const navItems = [
    {
      path: '/dashboard/services',
      label: 'My Services',
      icon: <ShoppingBag className="w-5 h-5" />,
      count: userServices.length
    },
    {
      path: '/dashboard/orders',
      label: 'My Orders',
      icon: <ShoppingCart className="w-5 h-5" />,
      count: buyerOrders.length + sellerOrders.length
    },
    {
      path: '/messages',
      label: 'Messages',
      icon: <MessageSquare className="w-5 h-5" />,
      count: conversations.length
    },
    {
      path: '/dashboard/settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />
    }
  ];
  
  // Check if the current path matches a nav item
  const isActiveRoute = (path: string) => {
    if (path === '/dashboard/services' && location.pathname.startsWith('/dashboard/service/')) {
      return true;
    }
    if (path === '/dashboard/orders' && location.pathname.startsWith('/dashboard/orders/')) {
      return true;
    }
    return location.pathname === path || location.pathname === `${path}/`;
  };
  
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row">
          {/* Mobile Header */}
          <div className="md:hidden px-4 py-4 border-b border-primary-600 flex items-center justify-between">
            <h1 className="text-xl font-bold text-secondary-50">Dashboard</h1>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-secondary-300 hover:text-secondary-50 hover:bg-primary-600"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
          
          {/* Sidebar */}
          <div
            className={`w-full md:w-64 bg-primary-600 md:border-r border-primary-500 ${
              isMobileMenuOpen ? 'block' : 'hidden md:block'
            }`}
          >
            <div className="p-6">
              {/* User Profile */}
              <div className="mb-6 flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-3 border-2 border-secondary-500">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary-500 flex items-center justify-center">
                      <User className="w-6 h-6 text-secondary-300" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-medium text-secondary-50">{user?.name}</h2>
                  <p className="text-sm text-secondary-300">@{user?.username}</p>
                </div>
              </div>
              
              {/* Navigation */}
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-md transition-colors ${
                      isActiveRoute(item.path)
                        ? 'bg-primary-700 text-secondary-50'
                        : 'text-secondary-200 hover:bg-primary-500 hover:text-secondary-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        isActiveRoute(item.path)
                          ? 'bg-secondary-500 text-primary-800'
                          : 'bg-primary-500 text-secondary-300'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>
              
              {/* Create Service Button */}
              <div className="mt-8">
                <Button
                  variant="primary"
                  fullWidth
                  leftIcon={<PlusCircle className="w-4 h-4" />}
                  onClick={() => navigate('/create-service')}
                >
                  Create New Service
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-grow p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <Routes>
                <Route path="/" element={<DashboardOverview />} />
                <Route path="/services" element={<MyServices />} />
                <Route path="/service/:id" element={<MyService />} />
                <Route path="/orders" element={<MyOrders />} />
                <Route path="/orders/:id" element={<OrderDetails />} />
                <Route path="/settings" element={<ProfileSettings />} />
              </Routes>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Overview Component
const DashboardOverview: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { userServices } = useServiceStore();
  const { buyerOrders, sellerOrders } = useOrderStore();
  const { conversations } = useMessageStore();
  
  const stats = [
    {
      label: 'Active Services',
      value: userServices.length,
      icon: <ShoppingBag className="w-6 h-6 text-secondary-500" />,
      path: '/dashboard/services'
    },
    {
      label: 'Total Orders',
      value: buyerOrders.length + sellerOrders.length,
      icon: <ShoppingCart className="w-6 h-6 text-secondary-500" />,
      path: '/dashboard/orders'
    },
    {
      label: 'Messages',
      value: conversations.length,
      icon: <MessageSquare className="w-6 h-6 text-secondary-500" />,
      path: '/messages'
    },
    {
      label: 'Rating',
      value: '4.9',
      icon: <Star className="w-6 h-6 text-secondary-500" />,
      suffix: '/5'
    }
  ];
  
  const activeOrders = [...buyerOrders, ...sellerOrders].filter(
    order => order.status !== 'completed' && order.status !== 'cancelled'
  );
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-secondary-50 mb-2">Dashboard</h1>
        <p className="text-secondary-300">
          Welcome back, {user?.name}! Here's an overview of your activity.
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-primary-600 rounded-lg border border-primary-500 p-6 hover:border-secondary-500/30 transition-colors"
            onClick={() => stat.path && navigate(stat.path)}
            style={{ cursor: stat.path ? 'pointer' : 'default' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary-700 rounded-md">
                {stat.icon}
              </div>
              {stat.path && (
                <ArrowRight className="w-5 h-5 text-secondary-300" />
              )}
            </div>
            <p className="text-secondary-300 text-sm mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-secondary-50">
              {stat.value}{stat.suffix}
            </p>
          </motion.div>
        ))}
      </div>
      
      {/* Active Orders */}
      <div className="bg-primary-600 rounded-lg border border-primary-500 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-secondary-50">Active Orders</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard/orders')}
          >
            View All
          </Button>
        </div>
        
        {activeOrders.length > 0 ? (
          <div className="space-y-4">
            {activeOrders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="bg-primary-700 rounded-lg p-4 flex items-center hover:border-secondary-500/30 cursor-pointer border border-transparent"
                onClick={() => navigate(`/dashboard/orders/${order.id}`)}
              >
                <div className="w-16 h-16 rounded-md overflow-hidden mr-4">
                  <img
                    src={order.serviceImage}
                    alt={order.serviceTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <p className="text-secondary-50 font-medium line-clamp-1">
                    {order.serviceTitle}
                  </p>
                  <div className="flex items-center text-sm text-secondary-300 mt-1">
                    <span className="capitalize">{order.status.replace('_', ' ')}</span>
                    <span className="mx-2">•</span>
                    <span>${order.price}</span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs ${
                  order.status === 'in_progress' ? 'bg-secondary-500/20 text-secondary-500' :
                  order.status === 'pending' ? 'bg-warning-500/20 text-warning-500' :
                  order.status === 'under_revision' ? 'bg-primary-400/20 text-primary-300' :
                  'bg-primary-500/20 text-primary-300'
                }`}>
                  {order.buyerId === user?.id ? 'Buying' : 'Selling'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-secondary-300 mb-4">You don't have any active orders</p>
            <Button
              variant="primary"
              onClick={() => navigate('/explore')}
            >
              Explore Services
            </Button>
          </div>
        )}
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div
          className="bg-primary-600 rounded-lg border border-primary-500 p-6 hover:border-secondary-500/30 transition-colors cursor-pointer"
          onClick={() => navigate('/create-service')}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary-700 rounded-full">
              <PlusCircle className="w-6 h-6 text-secondary-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-secondary-50">Create a Service</h3>
              <p className="text-secondary-300">Share your skills and start earning</p>
            </div>
          </div>
        </div>
        
        <div
          className="bg-primary-600 rounded-lg border border-primary-500 p-6 hover:border-secondary-500/30 transition-colors cursor-pointer"
          onClick={() => navigate('/explore')}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary-700 rounded-full">
              <ShoppingCart className="w-6 h-6 text-secondary-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-secondary-50">Explore Services</h3>
              <p className="text-secondary-300">Discover talents and creative offerings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;