import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, DollarSign, Info, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { LoadingSpinner } from './LoadingSpinner';
import { useServiceStore } from '../../store/serviceStore';

interface PriceRecommendationProps {
  category: string;
  description: string;
  currentPrice: number;
  onPriceSelect: (price: number) => void;
  className?: string;
}

export const PriceRecommendation: React.FC<PriceRecommendationProps> = ({
  category,
  description,
  currentPrice,
  onPriceSelect,
  className = ''
}) => {
  const { getAdvancedPricingSuggestion, isLoading } = useServiceStore();
  const [pricingData, setPricingData] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedRange, setSelectedRange] = useState<'budget' | 'standard' | 'premium' | null>(null);

  useEffect(() => {
    if (category && description.length > 20) {
      fetchPricingSuggestion();
    }
  }, [category, description]);

  const fetchPricingSuggestion = async () => {
    try {
      const data = await getAdvancedPricingSuggestion(category, description);
      setPricingData(data);
    } catch (error) {
      console.error('Error fetching pricing suggestion:', error);
    }
  };

  const handlePriceSelect = (price: number, range: 'budget' | 'standard' | 'premium') => {
    setSelectedRange(range);
    onPriceSelect(price);
  };

  if (!category || description.length < 20) {
    return (
      <div className={`bg-primary-700 rounded-lg p-4 ${className}`}>
        <div className="flex items-center text-secondary-300">
          <Info className="w-4 h-4 mr-2" />
          <span className="text-sm">
            Add a category and detailed description (20+ characters) to get AI pricing recommendations
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-primary-700 rounded-lg border border-primary-600 ${className}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Sparkles className="w-5 h-5 text-secondary-500 mr-2" />
            <h3 className="text-lg font-medium text-secondary-50">AI Price Recommendations</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-secondary-300 hover:text-secondary-100"
          >
            {isExpanded ? 'Hide' : 'Show'} Details
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="md" className="mr-2" />
            <span className="text-secondary-300">Analyzing market data...</span>
          </div>
        ) : pricingData ? (
          <div className="space-y-4">
            {/* Quick Recommendations */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'budget', label: 'Budget', icon: DollarSign, color: 'text-blue-400' },
                { key: 'standard', label: 'Standard', icon: TrendingUp, color: 'text-secondary-500' },
                { key: 'premium', label: 'Premium', icon: Sparkles, color: 'text-yellow-400' }
              ].map(({ key, label, icon: Icon, color }) => (
                <button
                  key={key}
                  onClick={() => handlePriceSelect(pricingData[key].price, key as any)}
                  className={`p-3 rounded-lg border transition-all ${
                    selectedRange === key
                      ? 'border-secondary-500 bg-secondary-500/10'
                      : 'border-primary-500 hover:border-primary-400 bg-primary-600'
                  }`}
                >
                  <div className="flex items-center justify-center mb-2">
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-secondary-300 mb-1">{label}</p>
                    <p className="text-lg font-bold text-secondary-50">
                      ${pricingData[key].price}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Recommended Price */}
            <div className="bg-primary-600 rounded-lg p-4 border border-secondary-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-300 mb-1">AI Recommended Price</p>
                  <p className="text-2xl font-bold text-secondary-500">
                    ${pricingData.recommended.price}
                  </p>
                  <p className="text-xs text-secondary-400 mt-1">
                    {pricingData.recommended.confidence}% confidence
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handlePriceSelect(pricingData.recommended.price, 'standard')}
                >
                  Use This Price
                </Button>
              </div>
            </div>

            {/* Detailed Analysis */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Market Analysis */}
                  <div className="bg-primary-600 rounded-lg p-4">
                    <h4 className="text-md font-medium text-secondary-50 mb-3">Market Analysis</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-secondary-300">Category Average</p>
                        <p className="text-secondary-100 font-medium">${pricingData.market.categoryAverage}</p>
                      </div>
                      <div>
                        <p className="text-secondary-300">Competition Level</p>
                        <p className="text-secondary-100 font-medium capitalize">{pricingData.market.competition}</p>
                      </div>
                      <div>
                        <p className="text-secondary-300">Demand Level</p>
                        <p className="text-secondary-100 font-medium capitalize">{pricingData.market.demand}</p>
                      </div>
                      <div>
                        <p className="text-secondary-300">Price Range</p>
                        <p className="text-secondary-100 font-medium">
                          ${pricingData.market.minPrice} - ${pricingData.market.maxPrice}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Factors */}
                  <div className="bg-primary-600 rounded-lg p-4">
                    <h4 className="text-md font-medium text-secondary-50 mb-3">Pricing Factors</h4>
                    <div className="space-y-2">
                      {pricingData.factors.map((factor: any, index: number) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-secondary-200 text-sm">{factor.name}</span>
                          <span className={`text-sm font-medium ${
                            factor.impact > 0 ? 'text-green-400' : 
                            factor.impact < 0 ? 'text-red-400' : 'text-secondary-300'
                          }`}>
                            {factor.impact > 0 ? '+' : ''}{factor.impact}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Strategy Tips */}
                  <div className="bg-primary-600 rounded-lg p-4">
                    <h4 className="text-md font-medium text-secondary-50 mb-3">Pricing Strategy Tips</h4>
                    <ul className="space-y-2">
                      {pricingData.tips.map((tip: string, index: number) => (
                        <li key={index} className="flex items-start text-sm text-secondary-200">
                          <div className="w-1.5 h-1.5 rounded-full bg-secondary-500 mt-2 mr-2 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Refresh Button */}
            <div className="flex justify-center pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchPricingSuggestion}
                leftIcon={<RefreshCw className="w-4 h-4" />}
                className="text-secondary-400 hover:text-secondary-200"
              >
                Refresh Analysis
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <Button
              variant="outline"
              onClick={fetchPricingSuggestion}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Get AI Price Recommendation
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};