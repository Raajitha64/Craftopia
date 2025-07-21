import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Sparkles, Clock, Shield, TrendingUp, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useServiceStore } from '../store/serviceStore';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { featuredServices, popularServices, fetchAllServices, isLoading } = useServiceStore();
  
  useEffect(() => {
    fetchAllServices();
  }, [fetchAllServices]);
  
  const categories = [
    { 
      name: 'Graphic Design', 
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      path: '/explore?category=graphic-design'
    },
    { 
      name: 'Digital Art', 
      image: 'https://images.pexels.com/photos/3861943/pexels-photo-3861943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      path: '/explore?category=digital-art' 
    },
    { 
      name: 'Handmade Crafts', 
      image: 'https://images.pexels.com/photos/4992458/pexels-photo-4992458.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      path: '/explore?category=handmade-crafts' 
    },
    { 
      name: 'Photography', 
      image: 'https://images.pexels.com/photos/3585325/pexels-photo-3585325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      path: '/explore?category=photography' 
    },
    { 
      name: 'Music & Audio', 
      image: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      path: '/explore?category=music-production' 
    },
    { 
      name: 'Writing & Translation', 
      image: 'https://images.pexels.com/photos/3059747/pexels-photo-3059747.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      path: '/explore?category=writing-translation' 
    },
  ];
  
  const benefits = [
    {
      icon: <Sparkles className="w-8 h-8 text-secondary-500" />,
      title: 'Unique Creations',
      description: 'Discover one-of-a-kind services crafted by talented individuals from around the world.'
    },
    {
      icon: <Clock className="w-8 h-8 text-secondary-500" />,
      title: 'Fast Delivery',
      description: 'Get your projects completed quickly with our efficient delivery system and dedicated creators.'
    },
    {
      icon: <Shield className="w-8 h-8 text-secondary-500" />,
      title: 'Secure Payments',
      description: 'Shop with confidence knowing your transactions are protected and secure.'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-secondary-500" />,
      title: 'Smart Pricing',
      description: 'Our AI-powered system helps creators set fair prices and allows buyers to negotiate.'
    }
  ];
  
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] bg-primary-800 overflow-hidden">
        {/* Background Image with Better Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/6707628/pexels-photo-6707628.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Creative workspace"
            className="w-full h-full object-cover"
          />
          {/* Stronger dark overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-800/90 to-primary-900/95" />
          {/* Additional overlay for extra contrast */}
          <div className="absolute inset-0 bg-primary-900/40" />
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
              Discover and Sell <span className="text-secondary-500">Creative Services</span>
            </h1>
            <p className="text-xl text-secondary-50 mb-8 drop-shadow-md">
              Craftopia connects talented creators with customers looking for unique services, from graphic design to handmade crafts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                size="lg" 
                onClick={() => navigate('/explore')}
                className="text-base shadow-lg"
              >
                Explore Services
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate('/create-service')}
                className="text-base bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 shadow-lg"
              >
                Become a Seller
              </Button>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-xl">
              <input
                type="text"
                placeholder="What service are you looking for today?"
                className="w-full py-3 pl-12 pr-4 bg-white/95 backdrop-blur-sm border border-white/20 rounded-lg text-primary-800 placeholder-primary-600/70 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 shadow-lg"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-600 w-5 h-5" />
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="bg-primary-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-50 mb-4">Explore Popular Categories</h2>
            <p className="text-secondary-300 max-w-2xl mx-auto">
              Discover services across diverse categories tailored to your specific needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div 
                  className="relative h-60 rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => navigate(category.path)}
                >
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-primary-900/90 to-primary-800/30 group-hover:from-primary-900/95 group-hover:to-primary-800/40 transition-all duration-300"
                  />
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between">
                    <h3 className="text-xl font-medium text-secondary-50">{category.name}</h3>
                    <ChevronRight className="w-5 h-5 text-secondary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Services Section */}
      <section className="bg-primary-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-50">Featured Services</h2>
            <Button 
              variant="outline" 
              onClick={() => navigate('/explore')}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div 
                  className="card group cursor-pointer"
                  onClick={() => navigate(`/services/${service.id}`)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={service.images[0]} 
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 bg-secondary-500 text-primary-800 text-xs font-medium px-2 py-1 rounded">
                      Featured
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img 
                          src={service.userAvatar} 
                          alt={service.username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm text-secondary-200">{service.username}</span>
                    </div>
                    <h3 className="text-lg font-medium text-secondary-50 mb-2 line-clamp-2 group-hover:text-secondary-500 transition-colors">
                      {service.title}
                    </h3>
                    <div className="flex items-center mb-4">
                      <div className="flex items-center text-yellow-500">
                        {'★'.repeat(Math.floor(service.rating))}
                        {'☆'.repeat(5 - Math.floor(service.rating))}
                      </div>
                      <span className="text-xs text-secondary-300 ml-2">({service.reviewCount})</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-secondary-300">Starting at</p>
                      <p className="text-xl font-bold text-secondary-500">${service.price}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="bg-primary-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary-50 mb-4">Why Choose Craftopia</h2>
            <p className="text-secondary-300 max-w-2xl mx-auto">
              Experience the benefits of our specialized creative marketplace
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-primary-600 p-6 rounded-lg border border-primary-500 hover:border-secondary-500/30 transition-all duration-300"
              >
                <div className="mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-medium text-secondary-50 mb-3">{benefit.title}</h3>
                <p className="text-secondary-200">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Popular Services Section */}
      <section className="bg-primary-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-50">Popular Right Now</h2>
            <Button 
              variant="outline" 
              onClick={() => navigate('/explore')}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularServices.slice(0, 4).map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div 
                  className="card group cursor-pointer"
                  onClick={() => navigate(`/services/${service.id}`)}
                >
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={service.images[0]} 
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 bg-primary-500 text-secondary-100 text-xs font-medium px-2 py-1 rounded">
                      Popular
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-md font-medium text-secondary-50 mb-2 line-clamp-2 group-hover:text-secondary-500 transition-colors">
                      {service.title}
                    </h3>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-yellow-500 text-xs">
                        {'★'.repeat(Math.floor(service.rating))}
                        <span className="text-xs text-secondary-300 ml-1">({service.reviewCount})</span>
                      </div>
                      <p className="text-md font-bold text-secondary-500">${service.price}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-800 border border-primary-600 rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:mr-8 max-w-xl">
              <h2 className="text-3xl font-bold text-secondary-50 mb-4">
                Ready to share your creative skills?
              </h2>
              <p className="text-secondary-200 mb-6">
                Join our community of talented creators and start selling your services to customers worldwide. Turn your passion into profit.
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate('/create-service')}
              >
                Start Selling Today
              </Button>
            </div>
            <div className="w-full md:w-1/3">
              <img 
                src="https://images.pexels.com/photos/3760529/pexels-photo-3760529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Creative workshop"
                className="rounded-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;