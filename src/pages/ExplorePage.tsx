import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useServiceStore } from '../store/serviceStore';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { services, fetchAllServices, isLoading } = useServiceStore();
  
  // Get category from URL if present
  const searchParams = new URLSearchParams(location.search);
  const categoryFromUrl = searchParams.get('category');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryFromUrl);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  
  // Fetch services on mount
  useEffect(() => {
    fetchAllServices();
  }, [fetchAllServices]);
  
  // Update URL when category changes
  useEffect(() => {
    if (selectedCategory) {
      searchParams.set('category', selectedCategory);
    } else {
      searchParams.delete('category');
    }
    
    const newUrl = `${location.pathname}?${searchParams.toString()}`;
    navigate(newUrl, { replace: true });
  }, [selectedCategory, navigate, location.pathname]);
  
  // Filter services based on current filters
  const filteredServices = services.filter(service => {
    // Filter by search term
    if (searchTerm && !service.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !service.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (selectedCategory && service.category !== selectedCategory) {
      return false;
    }
    
    // Filter by price range
    if (service.price < priceRange[0] || service.price > priceRange[1]) {
      return false;
    }
    
    return true;
  });
  
  // Sort services based on selected option
  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return a.price - b.price;
      case 'price_high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        // Default sort by relevance (using a combination of rating and review count)
        return (b.rating * b.reviewCount) - (a.rating * a.reviewCount);
    }
  });
  
  // Available categories
  const categories = [
    { value: 'graphic-design', label: 'Graphic Design' },
    { value: 'digital-art', label: 'Digital Art' },
    { value: 'handmade-crafts', label: 'Handmade Crafts' },
    { value: 'photography', label: 'Photography' },
    { value: 'music-production', label: 'Music & Audio' },
    { value: 'writing-translation', label: 'Writing & Translation' },
    { value: 'web-development', label: 'Web Development' },
  ];
  
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setPriceRange([0, 500]);
    setSortBy('relevance');
  };
  
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-50 mb-2">
            Explore Creative Services
          </h1>
          <p className="text-secondary-300">
            Discover unique services from talented creators around the world
          </p>
        </div>
        
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search Bar */}
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pl-12 pr-4 bg-primary-600 border border-primary-500 rounded-lg text-secondary-100 placeholder-secondary-300/50 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-300 w-5 h-5" />
            </div>
            
            {/* Sort Dropdown */}
            <div className="min-w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full py-3 px-4 bg-primary-600 border border-primary-500 rounded-lg text-secondary-100 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23DFD0B8\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em 1.5em' }}
              >
                <option value="relevance">Sort by: Relevance</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
            
            {/* Filter Button (Mobile) */}
            <Button
              variant="outline"
              className="md:hidden"
              leftIcon={<Filter className="w-4 h-4" />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
          </div>
          
          {/* Filters Section */}
          <div className={`bg-primary-600 border border-primary-500 rounded-lg p-4 transition-all duration-300 ${showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden md:max-h-96 md:opacity-100'}`}>
            <div className="flex items-center justify-between mb-4 md:hidden">
              <h3 className="font-medium text-secondary-50">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-secondary-300 hover:text-secondary-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Categories */}
              <div>
                <h3 className="text-sm font-medium text-secondary-200 mb-2">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategory === category.value}
                        onChange={() => {
                          if (selectedCategory === category.value) {
                            setSelectedCategory(null);
                          } else {
                            setSelectedCategory(category.value);
                          }
                        }}
                        className="w-4 h-4 text-secondary-500 border-primary-400 rounded focus:ring-secondary-500 focus:ring-offset-primary-600"
                      />
                      <span className="text-secondary-100">{category.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Price Range */}
              <div>
                <h3 className="text-sm font-medium text-secondary-200 mb-2">Price Range</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-secondary-300 text-sm">${priceRange[0]}</span>
                    <span className="text-secondary-300 text-sm">${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-primary-500 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
              
              {/* Reset Filters */}
              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="w-full"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-secondary-300">
            Showing <span className="text-secondary-50 font-medium">{sortedServices.length}</span> services
            {selectedCategory && (
              <>
                {' '}in <span className="text-secondary-50 font-medium">
                  {categories.find(c => c.value === selectedCategory)?.label}
                </span>
              </>
            )}
          </p>
        </div>
        
        {/* Services Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : sortedServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="card group cursor-pointer"
                onClick={() => navigate(`/services/${service.id}`)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={service.images[0]} 
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {service.isFeatured && (
                    <div className="absolute top-2 right-2 bg-secondary-500 text-primary-800 text-xs font-medium px-2 py-1 rounded">
                      Featured
                    </div>
                  )}
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
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-primary-600 rounded-lg border border-primary-500">
            <p className="text-xl text-secondary-200 mb-4">No services found matching your criteria</p>
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;