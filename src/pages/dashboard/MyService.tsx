import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Save, X, Plus, Trash2, Upload, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useServiceStore } from '../../store/serviceStore';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const MyService: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchServiceById, updateService, currentService, isLoading } = useServiceStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    category: '',
    deliveryTime: 3,
    tags: [] as string[],
    images: [] as string[]
  });
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      fetchServiceById(id);
    }
  }, [id, fetchServiceById]);

  useEffect(() => {
    if (currentService) {
      setFormData({
        title: currentService.title,
        description: currentService.description,
        price: currentService.price,
        category: currentService.category,
        deliveryTime: currentService.deliveryTime,
        tags: currentService.tags,
        images: currentService.images
      });
    }
  }, [currentService]);

  const categories = [
    { value: 'graphic-design', label: 'Graphic Design' },
    { value: 'digital-art', label: 'Digital Art' },
    { value: 'handmade-crafts', label: 'Handmade Crafts' },
    { value: 'photography', label: 'Photography' },
    { value: 'music-production', label: 'Music & Audio' },
    { value: 'writing-translation', label: 'Writing & Translation' },
    { value: 'web-development', label: 'Web Development' },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title || formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }
    if (!formData.description || formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    if (formData.deliveryTime <= 0) {
      newErrors.deliveryTime = 'Delivery time must be greater than 0';
    }
    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !currentService) return;

    try {
      await updateService(currentService.id, formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  const handleCancel = () => {
    if (currentService) {
      setFormData({
        title: currentService.title,
        description: currentService.description,
        price: currentService.price,
        category: currentService.category,
        deliveryTime: currentService.deliveryTime,
        tags: currentService.tags,
        images: currentService.images
      });
    }
    setIsEditing(false);
    setErrors({});
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag) && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addSampleImage = () => {
    const sampleImages = [
      'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/3861943/pexels-photo-3861943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/4992458/pexels-photo-4992458.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/3585325/pexels-photo-3585325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    ];
    
    const availableImages = sampleImages.filter(img => !formData.images.includes(img));
    if (availableImages.length > 0 && formData.images.length < 5) {
      const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)];
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, randomImage]
      }));
    }
  };

  const removeImage = (image: string) => {
    if (formData.images.length > 1) {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter(img => img !== image)
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentService) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-secondary-50 mb-4">Service not found</h2>
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard/services')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Services
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
            size="sm"
            onClick={() => navigate('/dashboard/services')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Services
          </Button>
          <h1 className="text-2xl font-bold text-secondary-50">
            {isEditing ? 'Edit Service' : 'Service Details'}
          </h1>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/services/${currentService.id}`)}
            leftIcon={<Eye className="w-4 h-4" />}
          >
            Preview
          </Button>
          
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                leftIcon={<X className="w-4 h-4" />}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                leftIcon={<Save className="w-4 h-4" />}
                isLoading={isLoading}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsEditing(true)}
              leftIcon={<Edit className="w-4 h-4" />}
            >
              Edit Service
            </Button>
          )}
        </div>
      </div>

      {/* Service Form */}
      <div className="bg-primary-600 rounded-lg border border-primary-500 p-6">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-secondary-200 mb-2">
              Service Title
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={`input ${errors.title ? 'border-danger-500' : ''}`}
                placeholder="Enter service title..."
              />
            ) : (
              <p className="text-secondary-50 text-lg font-medium">{currentService.title}</p>
            )}
            {errors.title && (
              <p className="mt-1 text-sm text-danger-500">{errors.title}</p>
            )}
          </div>

          {/* Category and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-200 mb-2">
                Category
              </label>
              {isEditing ? (
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className={`input ${errors.category ? 'border-danger-500' : ''}`}
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              ) : (
                <p className="text-secondary-100 capitalize">
                  {categories.find(c => c.value === currentService.category)?.label || currentService.category}
                </p>
              )}
              {errors.category && (
                <p className="mt-1 text-sm text-danger-500">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-200 mb-2">
                Price ($)
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                  className={`input ${errors.price ? 'border-danger-500' : ''}`}
                  min="1"
                />
              ) : (
                <p className="text-secondary-50 text-lg font-bold">${currentService.price}</p>
              )}
              {errors.price && (
                <p className="mt-1 text-sm text-danger-500">{errors.price}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-secondary-200 mb-2">
              Description
            </label>
            {isEditing ? (
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className={`input ${errors.description ? 'border-danger-500' : ''}`}
                rows={6}
                placeholder="Describe your service..."
              />
            ) : (
              <p className="text-secondary-100 whitespace-pre-line">{currentService.description}</p>
            )}
            {errors.description && (
              <p className="mt-1 text-sm text-danger-500">{errors.description}</p>
            )}
          </div>

          {/* Delivery Time */}
          <div>
            <label className="block text-sm font-medium text-secondary-200 mb-2">
              Delivery Time (Days)
            </label>
            {isEditing ? (
              <input
                type="number"
                value={formData.deliveryTime}
                onChange={(e) => setFormData(prev => ({ ...prev, deliveryTime: Number(e.target.value) }))}
                className={`input ${errors.deliveryTime ? 'border-danger-500' : ''}`}
                min="1"
                max="30"
              />
            ) : (
              <p className="text-secondary-100">{currentService.deliveryTime} days</p>
            )}
            {errors.deliveryTime && (
              <p className="mt-1 text-sm text-danger-500">{errors.deliveryTime}</p>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-secondary-200 mb-2">
              Service Images
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative rounded-lg overflow-hidden h-32">
                  <img
                    src={image}
                    alt={`Service image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => removeImage(image)}
                      className="absolute top-2 right-2 w-6 h-6 bg-primary-800/80 rounded-full flex items-center justify-center text-secondary-100 hover:bg-danger-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              
              {isEditing && formData.images.length < 5 && (
                <button
                  type="button"
                  onClick={addSampleImage}
                  className="h-32 border-2 border-dashed border-primary-500 rounded-lg flex flex-col items-center justify-center text-secondary-300 hover:text-secondary-100 hover:border-secondary-500 transition-colors"
                >
                  <Plus className="w-6 h-6 mb-1" />
                  <span className="text-sm">Add Image</span>
                </button>
              )}
            </div>
            {errors.images && (
              <p className="mt-1 text-sm text-danger-500">{errors.images}</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-secondary-200 mb-2">
              Tags
            </label>
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    className="input rounded-r-none flex-grow"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 bg-secondary-500 text-primary-800 rounded-r-md hover:bg-secondary-400 transition-colors"
                  >
                    Add
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <div
                        key={tag}
                        className="px-3 py-1 bg-primary-700 rounded-full text-sm text-secondary-200 flex items-center"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-secondary-300 hover:text-secondary-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {currentService.tags.map((tag) => (
                  <div
                    key={tag}
                    className="px-3 py-1 bg-primary-700 rounded-full text-sm text-secondary-200"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Service Stats */}
      <div className="bg-primary-600 rounded-lg border border-primary-500 p-6">
        <h2 className="text-xl font-bold text-secondary-50 mb-4">Service Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-secondary-500">{currentService.rating.toFixed(1)}</p>
            <p className="text-secondary-300">Average Rating</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-secondary-500">{currentService.reviewCount}</p>
            <p className="text-secondary-300">Total Reviews</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-secondary-500">
              {new Date(currentService.createdAt).toLocaleDateString()}
            </p>
            <p className="text-secondary-300">Created</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyService;