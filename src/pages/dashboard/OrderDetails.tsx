import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MessageSquare } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useOrderStore } from '../../store/orderStore';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const OrderDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrderById } = useOrderStore();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      setIsLoading(true);
      try {
        const orderData = await getOrderById(id || '');
        setOrder(orderData);
      } catch (error) {
        console.error('Error loading order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrder();
  }, [id, getOrderById]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-secondary-50 mb-4">Order not found</h2>
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard/orders')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/dashboard/orders')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-secondary-50">Order Details</h1>
        </div>
        <div className={`px-4 py-2 rounded-full text-sm ${
          order.status === 'in_progress' ? 'bg-secondary-500/20 text-secondary-500' :
          order.status === 'pending' ? 'bg-warning-500/20 text-warning-500' :
          order.status === 'completed' ? 'bg-success-500/20 text-success-500' :
          'bg-primary-500/20 text-primary-300'
        }`}>
          {order.status.replace('_', ' ').charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}
        </div>
      </div>

      {/* Service Info */}
      <div className="bg-primary-600 rounded-lg border border-primary-500 p-6">
        <div className="flex items-start space-x-4">
          <div className="w-24 h-24 rounded-lg overflow-hidden">
            <img
              src={order.serviceImage}
              alt={order.serviceTitle}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-grow">
            <h2 className="text-xl font-semibold text-secondary-50 mb-2">
              {order.serviceTitle}
            </h2>
            <div className="flex items-center space-x-4 text-secondary-300">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>Delivery: {order.deliveryTime} days</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="w-4 h-4 mr-1" />
                <span>{order.revisions} revisions</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-secondary-50">${order.price}</p>
          </div>
        </div>
      </div>

      {/* Order Timeline */}
      <div className="bg-primary-600 rounded-lg border border-primary-500 p-6">
        <h3 className="text-lg font-semibold text-secondary-50 mb-4">Order Timeline</h3>
        <div className="space-y-4">
          {order.timeline?.map((event: any, index: number) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="w-2 h-2 rounded-full bg-secondary-500 mt-2" />
              <div className="flex-grow">
                <p className="text-secondary-50">{event.description}</p>
                <p className="text-sm text-secondary-300">{event.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button
          variant="primary"
          onClick={() => navigate(`/messages?order=${order.id}`)}
          leftIcon={<MessageSquare className="w-4 h-4" />}
        >
          Message Seller
        </Button>
        {order.status === 'completed' && (
          <Button
            variant="outline"
            onClick={() => navigate(`/review/${order.id}`)}
          >
            Leave a Review
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;