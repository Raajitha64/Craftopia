import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tabs, Tab } from '@headlessui/react';
import { ShoppingCart, ShoppingBag, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useOrderStore } from '../../store/orderStore';
import { useAuthStore } from '../../store/authStore';

const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const { buyerOrders, sellerOrders } = useOrderStore();
  const { user } = useAuthStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter orders based on search term
  const filteredBuyerOrders = buyerOrders.filter(order => 
    order.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredSellerOrders = sellerOrders.filter(order => 
    order.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Group orders by status
  const buyerOrdersByStatus = {
    active: filteredBuyerOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled'),
    completed: filteredBuyerOrders.filter(o => o.status === 'completed'),
    cancelled: filteredBuyerOrders.filter(o => o.status === 'cancelled')
  };
  
  const sellerOrdersByStatus = {
    active: filteredSellerOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled'),
    completed: filteredSellerOrders.filter(o => o.status === 'completed'),
    cancelled: filteredSellerOrders.filter(o => o.status === 'cancelled')
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-50 mb-1">My Orders</h1>
        <p className="text-secondary-300">
          Manage your purchases and sales
        </p>
      </div>
      
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-2 pl-10 pr-4 bg-primary-600 border border-primary-500 rounded-md text-secondary-100 placeholder-secondary-300/50 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-300 w-5 h-5" />
      </div>
      
      {/* Tabs */}
      <Tabs as="div" className="space-y-6">
        <Tab.List className="flex space-x-2 p-1 bg-primary-600 rounded-lg">
          <Tab className={({ selected }) => `flex-1 py-2.5 rounded-md text-sm font-medium leading-5 transition-colors focus:outline-none ${
            selected 
              ? 'bg-primary-500 text-secondary-50 shadow'
              : 'text-secondary-300 hover:text-secondary-200 hover:bg-primary-500/30'
          }`}>
            <div className="flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Orders as Buyer ({filteredBuyerOrders.length})
            </div>
          </Tab>
          <Tab className={({ selected }) => `flex-1 py-2.5 rounded-md text-sm font-medium leading-5 transition-colors focus:outline-none ${
            selected 
              ? 'bg-primary-500 text-secondary-50 shadow'
              : 'text-secondary-300 hover:text-secondary-200 hover:bg-primary-500/30'
          }`}>
            <div className="flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Orders as Seller ({filteredSellerOrders.length})
            </div>
          </Tab>
        </Tab.List>
        
        <Tab.Panels>
          {/* Buyer Orders Panel */}
          <Tab.Panel>
            <Tabs as="div" className="space-y-6">
              <Tab.List className="flex space-x-2 border-b border-primary-500">
                <Tab className={({ selected }) => `py-2.5 px-4 text-sm font-medium leading-5 border-b-2 transition-colors focus:outline-none ${
                  selected 
                    ? 'border-secondary-500 text-secondary-50'
                    : 'border-transparent text-secondary-300 hover:text-secondary-200'
                }`}>
                  Active ({buyerOrdersByStatus.active.length})
                </Tab>
                <Tab className={({ selected }) => `py-2.5 px-4 text-sm font-medium leading-5 border-b-2 transition-colors focus:outline-none ${
                  selected 
                    ? 'border-secondary-500 text-secondary-50'
                    : 'border-transparent text-secondary-300 hover:text-secondary-200'
                }`}>
                  Completed ({buyerOrdersByStatus.completed.length})
                </Tab>
                <Tab className={({ selected }) => `py-2.5 px-4 text-sm font-medium leading-5 border-b-2 transition-colors focus:outline-none ${
                  selected 
                    ? 'border-secondary-500 text-secondary-50'
                    : 'border-transparent text-secondary-300 hover:text-secondary-200'
                }`}>
                  Cancelled ({buyerOrdersByStatus.cancelled.length})
                </Tab>
              </Tab.List>
              
              <Tab.Panels>
                {/* Active Orders */}
                <Tab.Panel>
                  {buyerOrdersByStatus.active.length > 0 ? (
                    <OrdersList orders={buyerOrdersByStatus.active} />
                  ) : (
                    <EmptyState 
                      message="You don't have any active orders as a buyer" 
                      buttonText="Explore Services"
                      buttonAction={() => navigate('/explore')}
                    />
                  )}
                </Tab.Panel>
                
                {/* Completed Orders */}
                <Tab.Panel>
                  {buyerOrdersByStatus.completed.length > 0 ? (
                    <OrdersList orders={buyerOrdersByStatus.completed} />
                  ) : (
                    <EmptyState 
                      message="You don't have any completed orders as a buyer" 
                      buttonText="Explore Services"
                      buttonAction={() => navigate('/explore')}
                    />
                  )}
                </Tab.Panel>
                
                {/* Cancelled Orders */}
                <Tab.Panel>
                  {buyerOrdersByStatus.cancelled.length > 0 ? (
                    <OrdersList orders={buyerOrdersByStatus.cancelled} />
                  ) : (
                    <EmptyState 
                      message="You don't have any cancelled orders as a buyer"
                      buttonText="Explore Services"
                      buttonAction={() => navigate('/explore')}
                    />
                  )}
                </Tab.Panel>
              </Tab.Panels>
            </Tabs>
          </Tab.Panel>
          
          {/* Seller Orders Panel */}
          <Tab.Panel>
            <Tabs as="div" className="space-y-6">
              <Tab.List className="flex space-x-2 border-b border-primary-500">
                <Tab className={({ selected }) => `py-2.5 px-4 text-sm font-medium leading-5 border-b-2 transition-colors focus:outline-none ${
                  selected 
                    ? 'border-secondary-500 text-secondary-50'
                    : 'border-transparent text-secondary-300 hover:text-secondary-200'
                }`}>
                  Active ({sellerOrdersByStatus.active.length})
                </Tab>
                <Tab className={({ selected }) => `py-2.5 px-4 text-sm font-medium leading-5 border-b-2 transition-colors focus:outline-none ${
                  selected 
                    ? 'border-secondary-500 text-secondary-50'
                    : 'border-transparent text-secondary-300 hover:text-secondary-200'
                }`}>
                  Completed ({sellerOrdersByStatus.completed.length})
                </Tab>
                <Tab className={({ selected }) => `py-2.5 px-4 text-sm font-medium leading-5 border-b-2 transition-colors focus:outline-none ${
                  selected 
                    ? 'border-secondary-500 text-secondary-50'
                    : 'border-transparent text-secondary-300 hover:text-secondary-200'
                }`}>
                  Cancelled ({sellerOrdersByStatus.cancelled.length})
                </Tab>
              </Tab.List>
              
              <Tab.Panels>
                {/* Active Orders */}
                <Tab.Panel>
                  {sellerOrdersByStatus.active.length > 0 ? (
                    <OrdersList orders={sellerOrdersByStatus.active} />
                  ) : (
                    <EmptyState 
                      message="You don't have any active orders as a seller" 
                      buttonText="Create a Service"
                      buttonAction={() => navigate('/create-service')}
                    />
                  )}
                </Tab.Panel>
                
                {/* Completed Orders */}
                <Tab.Panel>
                  {sellerOrdersByStatus.completed.length > 0 ? (
                    <OrdersList orders={sellerOrdersByStatus.completed} />
                  ) : (
                    <EmptyState 
                      message="You don't have any completed orders as a seller" 
                      buttonText="Create a Service"
                      buttonAction={() => navigate('/create-service')}
                    />
                  )}
                </Tab.Panel>
                
                {/* Cancelled Orders */}
                <Tab.Panel>
                  {sellerOrdersByStatus.cancelled.length > 0 ? (
                    <OrdersList orders={sellerOrdersByStatus.cancelled} />
                  ) : (
                    <EmptyState 
                      message="You don't have any cancelled orders as a seller"
                      buttonText="Create a Service"
                      buttonAction={() => navigate('/create-service')}
                    />
                  )}
                </Tab.Panel>
              </Tab.Panels>
            </Tabs>
          </Tab.Panel>
        </Tab.Panels>
      </Tabs>
    </div>
  );
};

// Orders List Component
const OrdersList: React.FC<{ orders: any[] }> = ({ orders }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  return (
    <div className="space-y-4">
      {orders.map((order, index) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="bg-primary-600 rounded-lg border border-primary-500 overflow-hidden hover:border-secondary-500/30 cursor-pointer transition-colors"
          onClick={() => navigate(`/dashboard/orders/${order.id}`)}
        >
          <div className="flex flex-col sm:flex-row">
            {/* Service Image */}
            <div className="sm:w-48 h-40 sm:h-auto overflow-hidden">
              <img
                src={order.serviceImage}
                alt={order.serviceTitle}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Order Details */}
            <div className="flex-grow p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-secondary-50 line-clamp-1">
                  {order.serviceTitle}
                </h3>
                <div className={`px-3 py-1 rounded-full text-xs ${
                  order.status === 'in_progress' ? 'bg-secondary-500/20 text-secondary-500' :
                  order.status === 'pending' ? 'bg-warning-500/20 text-warning-500' :
                  order.status === 'completed' ? 'bg-success-500/20 text-success-500' :
                  order.status === 'cancelled' ? 'bg-danger-500/20 text-danger-500' :
                  'bg-primary-400/20 text-primary-300'
                }`}>
                  {order.status.replace('_', ' ')}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center text-sm text-secondary-300 gap-1 sm:gap-6 mb-4">
                <div>
                  {order.buyerId === user?.id ? (
                    <>Seller: <span className="text-secondary-100">{order.sellerName}</span></>
                  ) : (
                    <>Buyer: <span className="text-secondary-100">{order.buyerName}</span></>
                  )}
                </div>
                <div>
                  Order Date: <span className="text-secondary-100">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {order.originalPrice !== order.price && (
                    <span className="text-secondary-300 line-through mr-2">${order.originalPrice}</span>
                  )}
                  <span className="text-lg font-bold text-secondary-500">${order.price}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/dashboard/orders/${order.id}`);
                  }}
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Empty State Component
const EmptyState: React.FC<{
  message: string;
  buttonText: string;
  buttonAction: () => void;
}> = ({ message, buttonText, buttonAction }) => {
  return (
    <div className="text-center py-12 bg-primary-600 rounded-lg border border-primary-500">
      <p className="text-xl text-secondary-200 mb-6">
        {message}
      </p>
      <Button
        variant="primary"
        onClick={buttonAction}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default MyOrders;