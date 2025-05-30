'use client';

import React, { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Award, ShoppingCart, Zap, Leaf, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { PremiumCard } from './PremiumCard';

// Types
interface ProductSpecs {
  power?: string;
  capacity?: string;
  warranty?: string;
  efficiency?: string;
}

interface Product {
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  rating: number;
  category: string;
  subcategory?: string;
  targetUsers?: string[];
  specifications?: ProductSpecs;
  applications?: string[];
  tags: string[];
  badge?: string;
  sale?: string;
}

interface EnhancedProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
  className?: string;
}

// Product Image Component with Category Icons
const ProductImagePlaceholder = memo(({ category, className = '' }: { category: string; className?: string }) => {
  const getIcon = () => {
    switch (category.toLowerCase()) {
      case 'solar':
        return <Sun className="w-16 h-16 text-[#3dd56d]" />;
      case 'cookstoves':
        return <Zap className="w-16 h-16 text-[#3dd56d]" />;
      default:
        return <Leaf className="w-16 h-16 text-[#3dd56d]" />;
    }
  };

  return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-[#3dd56d]/20 to-[#4ade80]/20 rounded-xl ${className}`}>
      {getIcon()}
    </div>
  );
});

ProductImagePlaceholder.displayName = 'ProductImagePlaceholder';

// Badge Component
const ProductBadge = memo(({ badge, sale }: { badge?: string; sale?: string }) => {
  if (!badge && !sale) return null;

  return (
    <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
      {badge && (
        <motion.div
          className="px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#3dd56d] to-[#4ade80] text-white shadow-lg"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {badge}
        </motion.div>
      )}
      {sale && (
        <motion.div
          className="px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
          initial={{ scale: 0, rotate: 10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {sale}
        </motion.div>
      )}
    </div>
  );
});

ProductBadge.displayName = 'ProductBadge';

// Main Enhanced Product Card Component
export const EnhancedProductCard = memo<EnhancedProductCardProps>(({
  product,
  onAddToCart,
  onViewDetails,
  className = '',
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { isDark } = useTheme();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleViewDetails = () => {
    onViewDetails?.(product);
  };

  const discountPercentage = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <PremiumCard
      variant="product"
      patternType="energy"
      animationType="energy-burst"
      glowEffect={true}
      size="lg"
      className={className}
      onClick={handleViewDetails}
    >
      <div className="flex flex-col h-full">
        {/* Product Badge */}
        <ProductBadge badge={product.badge} sale={product.sale} />

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 z-20">
          <motion.div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm shadow-lg border border-white/10"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
            <span className="text-white font-semibold text-xs">
              {product.rating}
            </span>
          </motion.div>
        </div>

        {/* Product Image Section */}
        <div className="relative h-48 mb-6 overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#3dd56d]/10 to-[#4ade80]/10" />
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <ProductImagePlaceholder
              category={product.category}
              className="w-full h-full transform group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          
          {/* Category Badge */}
          <div className="absolute bottom-3 left-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#3dd56d]/20 text-[#3dd56d] backdrop-blur-sm shadow-lg border border-[#3dd56d]/20">
              <Leaf className="w-3 h-3" />
              <span className="hidden sm:inline">
                {product.category.replace('-', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col">
          {/* Product Title */}
          <h3 className={`text-xl font-bold mb-3 leading-tight ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {product.name}
          </h3>

          {/* Product Description */}
          <p className={`text-sm leading-relaxed mb-4 line-clamp-2 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {product.description}
          </p>

          {/* Specifications */}
          {product.specifications && (
            <div className={`rounded-xl p-4 mb-4 ${
              isDark 
                ? 'bg-slate-800/50 border border-slate-700/50' 
                : 'bg-green-50/50 border border-green-200/50'
            }`}>
              <h4 className={`text-sm font-semibold mb-3 flex items-center ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                <div className="w-2 h-2 bg-[#3dd56d] rounded-full mr-2"></div>
                Specifications
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {product.specifications.power && (
                  <div className="flex justify-between">
                    <span className="text-[#3dd56d]">Power</span>
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>
                      {product.specifications.power}
                    </span>
                  </div>
                )}
                {product.specifications.warranty && (
                  <div className="flex justify-between">
                    <span className="text-[#3dd56d]">Warranty</span>
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>
                      {product.specifications.warranty}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Applications */}
          {product.applications && product.applications.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {product.applications.slice(0, 3).map(app => (
                  <span
                    key={app}
                    className="text-xs bg-[#3dd56d]/10 text-[#3dd56d] px-2 py-1 rounded-full border border-[#3dd56d]/20"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Section */}
          <div className="mt-auto">
            <div className={`rounded-xl p-4 mb-4 ${
              isDark 
                ? 'bg-gradient-to-r from-slate-800/80 to-slate-700/80 border border-slate-700/60' 
                : 'bg-gradient-to-r from-green-50/80 to-white/80 border border-green-200/60'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      ETB {product.price.toLocaleString()}
                    </span>
                    {product.oldPrice && (
                      <span className={`line-through text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        ETB {product.oldPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {discountPercentage > 0 && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-[#3dd56d] font-semibold">
                        Save ETB {(product.oldPrice! - product.price).toLocaleString()}
                      </span>
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded font-medium">
                        {discountPercentage}% OFF
                      </span>
                    </div>
                  )}
                </div>
                {product.rating >= 4.5 && (
                  <div className="flex items-center gap-1 bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded text-xs">
                    <Award className="w-3 h-3" />
                    <span className="font-semibold">Top</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <motion.button
                  className="flex-1 bg-gradient-to-r from-[#3dd56d] to-[#4ade80] text-white px-4 py-3 rounded-xl font-semibold text-sm hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-4 h-4 inline mr-2" />
                  Add to Cart
                </motion.button>
                <motion.button
                  className={`px-4 py-3 rounded-xl font-semibold text-sm border-2 transition-all duration-300 ${
                    isDark 
                      ? 'border-[#3dd56d] text-[#3dd56d] hover:bg-[#3dd56d]/10' 
                      : 'border-[#3dd56d] text-[#3dd56d] hover:bg-[#3dd56d]/10'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleViewDetails}
                >
                  Details
                </motion.button>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="text-xs font-medium px-2 py-1 rounded bg-[#3dd56d]/20 text-[#3dd56d] border border-[#3dd56d]/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PremiumCard>
  );
});

EnhancedProductCard.displayName = 'EnhancedProductCard';

export default EnhancedProductCard;
