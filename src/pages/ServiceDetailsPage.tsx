import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Clock, Tag, ShoppingCart, MessageSquare, ChevronLeft, ChevronRight, Star, Heart, DollarSign, Calendar } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useServiceStore } from '../store/serviceStore';
import { useAuthStore } from '../store/authStore';
import { useMessageStore } from '../store/messageStore';
import { useOrderStore } from '../store/orderStore';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const ServiceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchServiceById, currentService, isLoading } = useServiceStore();
  const { user, isAuthenticated } = useAuthStore();
  const { startConversation } = useMessageStore();
  const { createOrder } = useOrderStore();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [negotiatedPrice, setNegotiatedPrice] = useState<number | null>(null);
  
  useEffect(() => {
    if (id) {
      fetchServiceById(id);
    }
  }, [id, fetchServiceById]);
  
  // Handle image navigation
  const nextImage = () => {
    if (currentService) {
      setCurrentImageIndex((prev) => 
        prev === currentService.images.length - 1 ? 0 : prev + 1
      );
    }
  };
  
  const prevImage = () => {
    if (currentService) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? currentService.images.length - 1 : prev - 1
      );
    }
  };
  
  // Handle contact seller
  const handleContactSeller = async () => {
    if (!isAuthenticated) {
      navigate('/auth/signin', { state: { from: `/services/${id}` } });
      return;
    }
    
    if (currentService) {
      try {
        const conversationId = await startConversation(
          currentService.userId,
          currentService.username,
          currentService.userAvatar || '',
          currentService.id,
          currentService.title
        );
        
        navigate(`/messages/${conversationId}`);
      } catch (error) {
        console.error('Error starting conversation:', error);
      }
    }
  };
  
  // Handle order creation
  const handleOrderCreate = async (price: number) => {
    if (!isAuthenticated) {
      navigate('/auth/signin', { state: { from: `/services/${id}` } });
      return;
    }
    
    if (currentService) {
      try {
        const order = await createOrder(
          currentService.id,
          currentService.title,
          currentService.images[0],
          currentService.userId,
          currentService.username,
          price,
          currentService.price,
        );
        
        navigate(`/dashboard/orders/${order.id}`);
      } catch (error) {
        console.error('Error creating order:', error);
      }
    }
  };
  
  // Handle negotiation
  const handleNegotiate = () => {
    setIsNegotiating(true);
    // Set initial negotiated price to 10% less than the original
    if (currentService) {
      setNegotiatedPrice(Math.floor(currentService.price * 0.9));
    }
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  // Render not found state
  if (!currentService) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-secondary-50 mb-4">Service Not Found</h2>
        <p className="text-secondary-300 mb-8">
          The service you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate('/explore')}>
          Explore Services
        </Button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-secondary-300 hover:text-secondary-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to results
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            <div className="bg-primary-600 rounded-lg border border-primary-500 overflow-hidden mb-6">
              <div className="relative h-96 md:h-[500px]">
                <img
                  src={currentService.images[currentImageIndex]}
                  alt={currentService.title}
                  className="w-full h-full object-contain"
                />
                
                {/* Image Navigation */}
                {currentService.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-primary-700/80 rounded-full flex items-center justify-center text-secondary-100 hover:bg-primary-700 transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-primary-700/80 rounded-full flex items-center justify-center text-secondary-100 hover:bg-primary-700 transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Thumbnail Navigation */}
              {currentService.images.length > 1 && (
                <div className="flex p-4 gap-2 overflow-x-auto">
                  {currentService.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-20 h-20 flex-shrink-0 overflow-hidden rounded-md border-2 ${
                        index === currentImageIndex
                          ? 'border-secondary-500'
                          : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Service Description */}
            <div className="bg-primary-600 rounded-lg border border-primary-500 p-6 mb-6">
              <h2 className="text-xl font-bold text-secondary-50 mb-4">About This Service</h2>
              <p className="text-secondary-100 whitespace-pre-line mb-6">
                {currentService.description}
              </p>
              
              {/* Service Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-secondary-500 mr-2" />
                  <span className="text-secondary-100">
                    <span className="font-medium">{currentService.deliveryTime}</span> day delivery
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-secondary-500 mr-2" />
                  <span className="text-secondary-100">
                    Created {new Date(currentService.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {currentService.tags.map((tag) => (
                  <div
                    key={tag}
                    className="px-3 py-1 bg-primary-700 rounded-full text-sm text-secondary-200 flex items-center"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Seller Information */}
            <div className="bg-primary-600 rounded-lg border border-primary-500 p-6">
              <h2 className="text-xl font-bold text-secondary-50 mb-4">About The Seller</h2>
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                  <img
                    src={currentService.userAvatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'}
                    alt={currentService.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-secondary-50">
                    {currentService.username}
                  </h3>
                  <div className="flex items-center text-yellow-500">
                    {'★'.repeat(Math.floor(currentService.rating))}
                    {'☆'.repeat(5 - Math.floor(currentService.rating))}
                    <span className="text-xs text-secondary-300 ml-2">
                      ({currentService.reviewCount} reviews)
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                fullWidth
                leftIcon={<MessageSquare className="w-4 h-4" />}
                onClick={handleContactSeller}
                disabled={user?.id === currentService.userId}
              >
                {user?.id === currentService.userId ? 'This is your service' : 'Contact Seller'}
              </Button>
            </div>
          </div>
          
          {/* Right Column - Order */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-primary-600 rounded-lg border border-primary-500 p-6 sticky top-28"
            >
              <h2 className="text-xl font-bold text-secondary-50 mb-4">Service Package</h2>
              
              {/* Price */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-secondary-200">Price</span>
                <span className="text-2xl font-bold text-secondary-500">
                  ${negotiatedPrice || currentService.price}
                </span>
              </div>
              
              {/* Features */}
              <div className="mb-6">
                <h3 className="text-md font-medium text-secondary-100 mb-3">What's Included:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-secondary-500">✓</div>
                    <span className="text-secondary-200">Complete service as described</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-secondary-500">✓</div>
                    <span className="text-secondary-200">{currentService.deliveryTime} day delivery</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-secondary-500">✓</div>
                    <span className="text-secondary-200">100% satisfaction guarantee</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-secondary-500">✓</div>
                    <span className="text-secondary-200">Secure payment processing</span>
                  </li>
                </ul>
              </div>
              
              {/* Negotiation Section */}
              {isNegotiating ? (
                <div className="mb-6 p-4 bg-primary-700 rounded-lg">
                  <h3 className="text-md font-medium text-secondary-100 mb-3">Make an Offer:</h3>
                  <div className="flex items-center mb-3">
                    <span className="text-secondary-300 mr-2">$</span>
                    <input
                      type="number"
                      value={negotiatedPrice || ''}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value > 0) {
                          setNegotiatedPrice(value);
                        }
                      }}
                      min="1"
                      max={currentService.price}
                      className="w-full px-3 py-2 bg-primary-600 border border-primary-500 rounded-md text-secondary-100 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      onClick={() => {
                        setIsNegotiating(false);
                        setNegotiatedPrice(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      onClick={() => handleOrderCreate(negotiatedPrice || currentService.price)}
                      disabled={user?.id === currentService.userId}
                    >
                      Send Offer
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <Button
                    variant="outline"
                    fullWidth
                    leftIcon={<DollarSign className="w-4 h-4" />}
                    onClick={handleNegotiate}
                    className="mb-2"
                    disabled={user?.id === currentService.userId}
                  >
                    Make an Offer
                  </Button>
                </div>
              )}
              
              {/* Action Buttons */}
              <Button
                variant="primary"
                fullWidth
                leftIcon={<ShoppingCart className="w-4 h-4" />}
                onClick={() => handleOrderCreate(currentService.price)}
                className="mb-3"
                disabled={user?.id === currentService.userId}
              >
                Order Now
              </Button>
              
              <Button
                variant="outline"
                fullWidth
                leftIcon={<Heart className="w-4 h-4" />}
              >
                Add to Favorites
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;