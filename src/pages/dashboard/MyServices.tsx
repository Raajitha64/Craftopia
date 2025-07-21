import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit, Trash2, Eye, PlusCircle, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useServiceStore } from '../../store/serviceStore';

const MyServices: React.FC = () => {
  const navigate = useNavigate();
  const { userServices, deleteService, isLoading } = useServiceStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  
  // Filter services based on search term
  const filteredServices = userServices.filter(service => 
    service.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle service deletion
  const handleDelete = async (id: string) => {
    if (confirmDelete === id) {
      await deleteService(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-50 mb-1">My Services</h1>
          <p className="text-secondary-300">
            Manage and edit your service listings
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<PlusCircle className="w-4 h-4" />}
          onClick={() => navigate('/create-service')}
        >
          Create New Service
        </Button>
      </div>
      
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search your services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-2 pl-10 pr-4 bg-primary-600 border border-primary-500 rounded-md text-secondary-100 placeholder-secondary-300/50 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-300 w-5 h-5" />
      </div>
      
      {/* Services List */}
      {filteredServices.length > 0 ? (
        <div className="space-y-4">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-primary-600 rounded-lg border border-primary-500 overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Service Image */}
                <div className="sm:w-48 h-40 sm:h-auto overflow-hidden">
                  <img
                    src={service.images[0]}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Service Details */}
                <div className="flex-grow p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-secondary-50 mb-2 line-clamp-1">
                      {service.title}
                    </h3>
                    <p className="text-secondary-300 text-sm line-clamp-2 mb-2">
                      {service.description}
                    </p>
                    <div className="flex items-center text-sm text-secondary-300">
                      <span className="capitalize">{service.category.replace('-', ' ')}</span>
                      <span className="mx-2">•</span>
                      <span>${service.price}</span>
                      <span className="mx-2">•</span>
                      <div className="flex items-center text-yellow-500">
                        {'★'.repeat(Math.floor(service.rating))}
                        <span className="text-xs text-secondary-300 ml-1">({service.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="p-4 flex sm:flex-col justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Eye className="w-4 h-4" />}
                    onClick={() => navigate(`/services/${service.id}`)}
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Edit className="w-4 h-4" />}
                    onClick={() => navigate(`/dashboard/service/${service.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant={confirmDelete === service.id ? "danger" : "outline"}
                    size="sm"
                    leftIcon={<Trash2 className="w-4 h-4" />}
                    onClick={() => handleDelete(service.id)}
                    isLoading={isLoading && confirmDelete === service.id}
                  >
                    {confirmDelete === service.id ? "Confirm" : "Delete"}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-primary-600 rounded-lg border border-primary-500">
          <p className="text-xl text-secondary-200 mb-6">
            {searchTerm
              ? "No services matching your search"
              : "You haven't created any services yet"}
          </p>
          <Button
            variant="primary"
            leftIcon={<PlusCircle className="w-4 h-4" />}
            onClick={() => navigate('/create-service')}
          >
            Create Your First Service
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyServices;