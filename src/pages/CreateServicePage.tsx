import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Plus, X, Info } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PriceRecommendation } from '../components/ui/PriceRecommendation';
import { useServiceStore } from '../store/serviceStore';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const CreateServicePage: React.FC = () => {
  const navigate = useNavigate();
  const { createService, isLoading } = useServiceStore();

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState<number>(50);
  const [deliveryTime, setDeliveryTime] = useState(3);
  const [images, setImages] = useState<string[]>([
    'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  ]);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');

  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Categories
  const categories = [
    { value: 'graphic-design', label: 'Graphic Design' },
    { value: 'digital-art', label: 'Digital Art' },
    { value: 'handmade-crafts', label: 'Handmade Crafts' },
    { value: 'photography', label: 'Photography' },
    { value: 'music-production', label: 'Music & Audio' },
    { value: 'writing-translation', label: 'Writing & Translation' },
    { value: 'web-development', label: 'Web Development' },
  ];

  // Sample image URLs for demo
  const sampleImages = [
    'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/3861943/pexels-photo-3861943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/4992458/pexels-photo-4992458.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/3585325/pexels-photo-3585325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/6444/pencil-typography-black-design.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  ];

  const addTag = () => {
    const trimmedTag = currentTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
      setTags([...tags, trimmedTag]);
      setCurrentTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const addImage = () => {
    if (images.length < 5) {
      const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
      if (!images.includes(randomImage)) {
        setImages([...images, randomImage]);
      }
    }
  };

  const removeImage = (image: string) => {
    if (images.length > 1) {
      setImages(images.filter((img) => img !== image));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title) newErrors.title = 'Title is required';
    else if (title.length < 10) newErrors.title = 'Title should be at least 10 characters';

    if (!description) newErrors.description = 'Description is required';
    else if (description.length < 50) newErrors.description = 'Description should be at least 50 characters';

    if (!category) newErrors.category = 'Category is required';

    if (!price || price <= 0) newErrors.price = 'Price must be greater than 0';

    if (!deliveryTime || deliveryTime <= 0) newErrors.deliveryTime = 'Delivery time must be greater than 0';

    if (images.length === 0) newErrors.images = 'At least one image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const service = await createService({
        title,
        description,
        price,
        category,
        images,
        tags,
        deliveryTime,
      });
      navigate(`/services/${service.id}`);
    } catch (error) {
      console.error('Error creating service:', error);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-50 mb-2">Create a New Service</h1>
          <p className="text-secondary-300">Share your skills and start earning on Craftopia</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Overview */}
          <div className="bg-primary-600 rounded-lg border border-primary-500 p-6">
            <h2 className="text-xl font-bold text-secondary-50 mb-4">Service Overview</h2>

            {/* Title */}
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-secondary-200 mb-1">
                Service Title <span className="text-danger-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="I will create amazing..."
                className={`input ${errors.title ? 'border-danger-500' : ''}`}
              />
              {errors.title && <p className="mt-1 text-sm text-danger-500">{errors.title}</p>}
            </div>

            {/* Category */}
            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium text-secondary-200 mb-1">
                Category <span className="text-danger-500">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`input ${errors.category ? 'border-danger-500' : ''}`}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-danger-500">{errors.category}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-secondary-200 mb-1">
                Description <span className="text-danger-500">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your service in detail..."
                rows={6}
                className={`input ${errors.description ? 'border-danger-500' : ''}`}
              />
              {errors.description && <p className="mt-1 text-sm text-danger-500">{errors.description}</p>}
              <p className="mt-1 text-xs text-secondary-300">
                Minimum 50 characters. Detailed descriptions help buyers understand exactly what you offer.
              </p>
            </div>
          </div>

          {/* Price Recommendation */}
          <PriceRecommendation
            category={category}
            description={description}
            currentPrice={price}
            onPriceSelect={setPrice}
          />

          {/* Pricing & Delivery */}
          <div className="bg-primary-600 rounded-lg border border-primary-500 p-6">
            <h2 className="text-xl font-bold text-secondary-50 mb-4">Pricing & Delivery</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-secondary-200 mb-1">
                  Service Price ($) <span className="text-danger-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    min="1"
                    step="1"
                    className={`input pl-8 ${errors.price ? 'border-danger-500' : ''}`}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-secondary-300">$</span>
                  </div>
                </div>
                {errors.price && <p className="mt-1 text-sm text-danger-500">{errors.price}</p>}
              </div>

              {/* Delivery Time */}
              <div>
                <label htmlFor="deliveryTime" className="block text-sm font-medium text-secondary-200 mb-1">
                  Delivery Time (Days) <span className="text-danger-500">*</span>
                </label>
                <input
                  id="deliveryTime"
                  type="number"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(Number(e.target.value))}
                  min="1"
                  max="30"
                  step="1"
                  className={`input ${errors.deliveryTime ? 'border-danger-500' : ''}`}
                />
                {errors.deliveryTime && <p className="mt-1 text-sm text-danger-500">{errors.deliveryTime}</p>}
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-primary-600 rounded-lg border border-primary-500 p-6">
            <h2 className="text-xl font-bold text-secondary-50 mb-4">Service Images</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
              {images.map((image, index) => (
                <div key={index} className="relative rounded-lg overflow-hidden h-32">
                  <img src={image} alt={`Service preview ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(image)}
                    className="absolute top-2 right-2 w-6 h-6 bg-primary-800/80 rounded-full flex items-center justify-center text-secondary-100 hover:bg-danger-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {images.length < 5 && (
                <button
                  type="button"
                  onClick={addImage}
                  className="h-32 border-2 border-dashed border-primary-500 rounded-lg flex flex-col items-center justify-center text-secondary-300 hover:text-secondary-100 hover:border-secondary-500 transition-colors"
                >
                  <Plus className="w-6 h-6 mb-1" />
                  <span className="text-sm">Add Image</span>
                </button>
              )}
            </div>

            {errors.images && <p className="mt-1 text-sm text-danger-500">{errors.images}</p>}

            <p className="text-xs text-secondary-300">
              Upload up to 5 high-quality images to showcase your service. For demo purposes, clicking "Add Image"
              will add a sample image.
            </p>
          </div>

          {/* Tags */}
          <div className="bg-primary-600 rounded-lg border border-primary-500 p-6">
            <h2 className="text-xl font-bold text-secondary-50 mb-4">Service Tags</h2>

            <div className="mb-4">
              <label htmlFor="tags" className="block text-sm font-medium text-secondary-200 mb-1">
                Tags (Optional)
              </label>
              <div className="flex">
                <input
                  id="tags"
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add a tag"
                  className="input rounded-r-none flex-grow"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 bg-secondary-500 text-primary-800 rounded-r-md hover:bg-secondary-400 transition-colors"
                >
                  Add
                </button>
              </div>
              <p className="mt-1 text-xs text-secondary-300">
                {`Add up to 10 tags (${tags.length}/10) to help buyers find your service.`}
              </p>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
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

          {/* Submission */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-secondary-300 flex items-start">
              <Info className="w-4 h-4 mr-1 mt-0.5" />
              <span>
                Fields marked with <span className="text-danger-500">*</span> are required
              </span>
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              disabled={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Create Service
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateServicePage;
