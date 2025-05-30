'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  Star,
  SunMedium,
  Zap,
  ArrowRight,
  Filter,
  Search,
  X,
  Plus,
  Minus,
  TrendingUp,
  Award,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Grid3X3,
  List,
  Eye,
  Heart,
  Share2,
  Download,
  Sparkles,
  Target,
  Gauge,
  Shield,
  Clock,
  DollarSign,
  Lightbulb,
  Flame,
  Battery,
  Wifi
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { Product } from '@/app/green/data/products';
import { GreanCard } from '@/components/ui/grean-card';
import { GreanButton } from '@/components/ui/grean-button';

interface AdvancedProductComparisonProps {
  products: Product[];
  className?: string;
}

interface ComparisonProduct extends Product {
  isSelected: boolean;
  comparisonScore?: number;
}

interface FilterOptions {
  category: string;
  priceRange: [number, number];
  minRating: number;
  features: string[];
  efficiency: number;
  powerRange: [number, number];
  warranty: string;
  availability: string;
}

const defaultFilters: FilterOptions = {
  category: 'All',
  priceRange: [0, 100000],
  minRating: 0,
  features: [],
  efficiency: 0,
  powerRange: [0, 10000],
  warranty: 'All',
  availability: 'All'
};

interface ViewMode {
  type: 'grid' | 'list' | 'table';
  density: 'compact' | 'comfortable' | 'spacious';
}

interface ComparisonMetrics {
  bestValue: string;
  mostEfficient: string;
  highestRated: string;
  mostPowerful: string;
}

export function AdvancedProductComparison({
  products,
  className = ''
}: AdvancedProductComparisonProps) {
  const { isDark } = useTheme();

  // Enhanced State management
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'efficiency' | 'name' | 'power' | 'value'>('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>({ type: 'grid', density: 'comfortable' });
  const [showComparison, setShowComparison] = useState(false);
  const [favoriteProducts, setFavoriteProducts] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showInsights, setShowInsights] = useState(false);



  // Enhanced data processing
  const categories = useMemo(() => {
    const cats = ['All', ...new Set(products.map(p => p.category))];
    return cats;
  }, [products]);

  const warranties = useMemo(() => {
    const warr = ['All', ...new Set(products.map(p => p.specifications?.warranty).filter(Boolean))];
    return warr;
  }, [products]);

  // Calculate comparison metrics
  const comparisonMetrics = useMemo((): ComparisonMetrics => {
    if (products.length === 0) return { bestValue: '', mostEfficient: '', highestRated: '', mostPowerful: '' };

    const bestValue = products.reduce((best, current) =>
      (current.rating / current.price) > (best.rating / best.price) ? current : best
    );

    const mostEfficient = products.reduce((best, current) => {
      const currentEff = parseFloat(current.specifications?.efficiency || '0');
      const bestEff = parseFloat(best.specifications?.efficiency || '0');
      return currentEff > bestEff ? current : best;
    });

    const highestRated = products.reduce((best, current) =>
      current.rating > best.rating ? current : best
    );

    const mostPowerful = products.reduce((best, current) => {
      const currentPower = parseFloat(current.specifications?.power || '0');
      const bestPower = parseFloat(best.specifications?.power || '0');
      return currentPower > bestPower ? current : best;
    });

    return {
      bestValue: bestValue.name,
      mostEfficient: mostEfficient.name,
      highestRated: highestRated.name,
      mostPowerful: mostPowerful.name
    };
  }, [products]);

  // Enhanced filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Category filter
      if (filters.category !== 'All' && product.category !== filters.category) {
        return false;
      }

      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // Rating filter
      if (product.rating < filters.minRating) {
        return false;
      }

      // Power range filter
      const productPower = parseFloat(product.specifications?.power || '0');
      if (productPower < filters.powerRange[0] || productPower > filters.powerRange[1]) {
        return false;
      }

      // Warranty filter
      if (filters.warranty !== 'All' && product.specifications?.warranty !== filters.warranty) {
        return false;
      }

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchableText = [
          product.name,
          product.description,
          product.subcategory,
          ...(product.tags || []),
          ...(product.targetUsers || []),
          ...(product.applications || [])
        ].join(' ').toLowerCase();

        if (!searchableText.includes(query)) {
          return false;
        }
      }

      return true;
    });

    // Enhanced sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'efficiency':
          const aEff = parseFloat(a.specifications?.efficiency || '0');
          const bEff = parseFloat(b.specifications?.efficiency || '0');
          comparison = aEff - bEff;
          break;
        case 'power':
          const aPower = parseFloat(a.specifications?.power || '0');
          const bPower = parseFloat(b.specifications?.power || '0');
          comparison = aPower - bPower;
          break;
        case 'value':
          const aValue = a.rating / a.price;
          const bValue = b.rating / b.price;
          comparison = aValue - bValue;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [products, filters, searchQuery, sortBy, sortOrder]);

  // Get selected products for comparison
  const comparisonProducts = useMemo(() => {
    return selectedProducts.map(id =>
      products.find(p => p.name === id)
    ).filter(Boolean) as Product[];
  }, [selectedProducts, products]);

  // Enhanced interaction handlers
  const toggleProductSelection = useCallback((productName: string) => {
    setSelectedProducts(prev => {
      if (prev.includes(productName)) {
        return prev.filter(id => id !== productName);
      } else if (prev.length < 4) { // Limit to 4 products
        return [...prev, productName];
      }
      return prev;
    });
  }, []);

  const toggleFavorite = useCallback((productName: string) => {
    setFavoriteProducts(prev => {
      if (prev.includes(productName)) {
        return prev.filter(id => id !== productName);
      } else {
        return [...prev, productName];
      }
    });
  }, []);

  const clearSelections = useCallback(() => {
    setSelectedProducts([]);
  }, []);

  const analyzeProducts = useCallback(async () => {
    setIsAnalyzing(true);
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsAnalyzing(false);
    setShowInsights(true);
  }, []);

  const exportComparison = useCallback(() => {
    const data = {
      selectedProducts: comparisonProducts,
      metrics: comparisonMetrics,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-comparison.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [comparisonProducts, comparisonMetrics]);

  // Enhanced category icon mapping
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'solar-pv':
        return <SunMedium className="w-5 h-5" />;
      case 'pue':
      case 'water-pumping':
        return <Zap className="w-5 h-5" />;
      case 'cooking-higher':
      case 'cooking-lower':
        return <Flame className="w-5 h-5" />;
      case 'power-backup':
        return <Battery className="w-5 h-5" />;
      case 'street-lights':
        return <Lightbulb className="w-5 h-5" />;
      case 'advisory':
        return <Target className="w-5 h-5" />;
      default:
        return <Award className="w-5 h-5" />;
    }
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'bestValue':
        return <DollarSign className="w-4 h-4" />;
      case 'mostEfficient':
        return <Gauge className="w-4 h-4" />;
      case 'highestRated':
        return <Star className="w-4 h-4" />;
      case 'mostPowerful':
        return <Zap className="w-4 h-4" />;
      default:
        return <Award className="w-4 h-4" />;
    }
  };

  // Get efficiency percentage
  const getEfficiencyPercentage = (efficiency?: string) => {
    if (!efficiency) return 0;
    const match = efficiency.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  return (
    <section className={`py-24 px-4 sm:px-6 relative overflow-hidden ${className}`}>
      {/* Background overlays removed for cleaner design */}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`inline-flex items-center rounded-full px-6 py-3 typography-small mb-8 shadow-lg backdrop-blur-sm ${
              isDark
                ? 'bg-[#3DD56D]/20 text-[#3DD56D] border border-[#3DD56D]/30'
                : 'bg-[#2bb757]/20 text-[#2bb757] border border-[#2bb757]/50'
            }`}
          >
            <Calculator className="mr-3 h-5 w-5" />
            <span className="font-semibold">Advanced Product Comparison</span>
            <Sparkles className="ml-3 h-4 w-4" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <h2 className={`typography-display text-5xl md:text-6xl lg:text-7xl text-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Compare & Choose
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`typography-body text-xl max-w-3xl mx-auto text-center ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Use our advanced comparison tool to analyze <span className="text-[#2bb757] font-semibold">energy solutions side-by-side</span>.
            Filter by specifications, compare features, and find the perfect match for your needs.
          </motion.p>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6 mt-8"
          >
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isDark ? 'bg-slate-800/50 text-gray-300' : 'bg-white/50 text-gray-600'
            }`}>
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm font-medium">{products.length} Products</span>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isDark ? 'bg-slate-800/50 text-gray-300' : 'bg-white/50 text-gray-600'
            }`}>
              <Grid3X3 className="w-4 h-4" />
              <span className="text-sm font-medium">{categories.length - 1} Categories</span>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isDark ? 'bg-slate-800/50 text-gray-300' : 'bg-white/50 text-gray-600'
            }`}>
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Smart Analysis</span>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Search and Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-8">
            {/* Enhanced Search Input */}
            <div className="relative flex-1 max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-green-600'}`} />
              </div>
              <input
                type="text"
                placeholder="Search products, features, specifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#3DD56D]/20 focus:border-[#3DD56D] shadow-lg backdrop-blur-sm ${
                  isDark
                    ? 'bg-slate-800/90 border-slate-700/60 text-white placeholder-gray-400'
                    : 'bg-white/90 border-green-200/60 text-green-900 placeholder-gray-500'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  <X className={`h-4 w-4 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`} />
                </button>
              )}
            </div>

            {/* Enhanced Controls */}
            <div className="flex flex-wrap gap-4">
              {/* View Mode Toggle */}
              <div className={`flex rounded-xl border ${
                isDark ? 'bg-slate-800/90 border-slate-700/60' : 'bg-white/90 border-green-200/60'
              }`}>
                <button
                  onClick={() => setViewMode(prev => ({ ...prev, type: 'grid' }))}
                  className={`p-3 rounded-l-xl transition-all duration-300 ${
                    viewMode.type === 'grid'
                      ? 'bg-[#3DD56D] text-white'
                      : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode(prev => ({ ...prev, type: 'list' }))}
                  className={`p-3 transition-all duration-300 ${
                    viewMode.type === 'list'
                      ? 'bg-[#3DD56D] text-white'
                      : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode(prev => ({ ...prev, type: 'table' }))}
                  className={`p-3 rounded-r-xl transition-all duration-300 ${
                    viewMode.type === 'table'
                      ? 'bg-[#3DD56D] text-white'
                      : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
              </div>

              <GreanButton
                variant={showFilters ? "primary" : "secondary"}
                size="default"
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2"
              >
                <Filter className="w-5 h-5" />
                Filters
                {Object.values(filters).some(v => v !== defaultFilters[Object.keys(filters)[Object.values(filters).indexOf(v)] as keyof FilterOptions]) && (
                  <span className="ml-1 px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                    {Object.entries(filters).filter(([key, value]) =>
                      value !== defaultFilters[key as keyof FilterOptions]
                    ).length}
                  </span>
                )}
              </GreanButton>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [sort, order] = e.target.value.split('-');
                  setSortBy(sort as any);
                  setSortOrder(order as any);
                }}
                className={`px-6 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#3DD56D]/20 focus:border-[#3DD56D] shadow-lg backdrop-blur-sm ${
                  isDark
                    ? 'bg-slate-800/90 border-slate-700/60 text-white'
                    : 'bg-white/90 border-green-200/60 text-green-900'
                }`}
              >
                <option value="rating-desc">⭐ Highest Rated</option>
                <option value="rating-asc">⭐ Lowest Rated</option>
                <option value="price-asc">💰 Price: Low to High</option>
                <option value="price-desc">💰 Price: High to Low</option>
                <option value="efficiency-desc">⚡ Most Efficient</option>
                <option value="efficiency-asc">⚡ Least Efficient</option>
                <option value="power-desc">🔋 Most Powerful</option>
                <option value="power-asc">🔋 Least Powerful</option>
                <option value="value-desc">💎 Best Value</option>
                <option value="value-asc">💎 Worst Value</option>
                <option value="name-asc">📝 Name: A to Z</option>
                <option value="name-desc">📝 Name: Z to A</option>
              </select>

              {/* Quick Actions */}
              {selectedProducts.length >= 2 && (
                <div className="flex gap-2">
                  <GreanButton
                    variant="secondary"
                    size="default"
                    onClick={analyzeProducts}
                    disabled={isAnalyzing}
                    className="inline-flex items-center gap-2"
                  >
                    {isAnalyzing ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                    {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                  </GreanButton>

                  <GreanButton
                    variant="secondary"
                    size="default"
                    onClick={exportComparison}
                    className="inline-flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </GreanButton>
                </div>
              )}
            </div>
          </div>

          {/* Modern Redesigned Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8"
              >
                <GreanCard pattern="dots" gradient={true} className="p-6">
                  {/* Filter Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${
                        isDark ? 'bg-[#3DD56D]/20' : 'bg-[#2bb757]/20'
                      }`}>
                        <Filter className={`w-5 h-5 ${
                          isDark ? 'text-[#3DD56D]' : 'text-[#2bb757]'
                        }`} />
                      </div>
                      <h3 className={`text-xl font-bold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        Smart Filters
                      </h3>
                    </div>
                    <GreanButton
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFilters(defaultFilters);
                        setSearchQuery('');
                      }}
                      className="inline-flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Reset
                    </GreanButton>
                  </div>

                  {/* Category Pills */}
                  <div className="mb-6">
                    <label className={`block text-sm font-semibold mb-3 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      <Grid3X3 className="w-4 h-4 inline mr-2" />
                      Product Categories
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setFilters(prev => ({ ...prev, category: cat }))}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                            filters.category === cat
                              ? 'bg-[#3DD56D] text-white shadow-lg scale-105'
                              : isDark
                              ? 'bg-slate-700/50 text-gray-300 hover:bg-slate-600 border border-slate-600'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
                          }`}
                        >
                          {cat === 'All' ? '🌟 All Products' : cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price & Power Range */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className={`block text-sm font-semibold mb-3 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        <DollarSign className="w-4 h-4 inline mr-2" />
                        Price Range (ETB)
                      </label>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            placeholder="0"
                            value={filters.priceRange[0] || ''}
                            onChange={(e) => setFilters(prev => ({
                              ...prev,
                              priceRange: [parseInt(e.target.value) || 0, prev.priceRange[1]]
                            }))}
                            className={`w-24 px-3 py-2 rounded-lg border text-sm ${
                              isDark
                                ? 'bg-slate-700 border-slate-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          />
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>to</span>
                          <input
                            type="number"
                            placeholder="100000"
                            value={filters.priceRange[1] || ''}
                            onChange={(e) => setFilters(prev => ({
                              ...prev,
                              priceRange: [prev.priceRange[0], parseInt(e.target.value) || 100000]
                            }))}
                            className={`w-28 px-3 py-2 rounded-lg border text-sm ${
                              isDark
                                ? 'bg-slate-700 border-slate-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          />
                        </div>
                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          💰 ETB {filters.priceRange[0].toLocaleString()} - ETB {filters.priceRange[1].toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold mb-3 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        <Zap className="w-4 h-4 inline mr-2" />
                        Power Range (W)
                      </label>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            placeholder="0"
                            value={filters.powerRange[0] || ''}
                            onChange={(e) => setFilters(prev => ({
                              ...prev,
                              powerRange: [parseInt(e.target.value) || 0, prev.powerRange[1]]
                            }))}
                            className={`w-20 px-3 py-2 rounded-lg border text-sm ${
                              isDark
                                ? 'bg-slate-700 border-slate-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          />
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>to</span>
                          <input
                            type="number"
                            placeholder="10000"
                            value={filters.powerRange[1] || ''}
                            onChange={(e) => setFilters(prev => ({
                              ...prev,
                              powerRange: [prev.powerRange[0], parseInt(e.target.value) || 10000]
                            }))}
                            className={`w-20 px-3 py-2 rounded-lg border text-sm ${
                              isDark
                                ? 'bg-slate-700 border-slate-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          />
                        </div>
                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          ⚡ {filters.powerRange[0]}W - {filters.powerRange[1]}W
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rating & Quick Options */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className={`block text-sm font-semibold mb-3 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        <Star className="w-4 h-4 inline mr-2" />
                        Rating
                      </label>
                      <div className="flex gap-1">
                        {[0, 3, 4, 4.5].map(rating => (
                          <button
                            key={rating}
                            onClick={() => setFilters(prev => ({ ...prev, minRating: rating }))}
                            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                              filters.minRating === rating
                                ? 'bg-[#3DD56D] text-white'
                                : isDark
                                ? 'bg-slate-700/50 text-gray-300 hover:bg-slate-600'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                            }`}
                          >
                            <Star className="w-3 h-3 fill-current" />
                            {rating === 0 ? 'Any' : `${rating}+`}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold mb-3 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        <CheckCircle className="w-4 h-4 inline mr-2" />
                        Status
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['All Products', 'In Stock', 'On Sale', 'Popular'].map(status => (
                          <button
                            key={status}
                            onClick={() => setFilters(prev => ({ ...prev, availability: status }))}
                            className={`px-3 py-2 rounded-lg text-xs transition-all duration-300 ${
                              filters.availability === status
                                ? 'bg-[#3DD56D] text-white'
                                : isDark
                                ? 'bg-slate-700/50 text-gray-300 hover:bg-slate-600'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold mb-3 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        <Target className="w-4 h-4 inline mr-2" />
                        Quick Filters
                      </label>
                      <div className="space-y-2">
                        <button
                          onClick={() => setFilters({ ...defaultFilters, category: 'solar-pv', minRating: 4 })}
                          className={`w-full px-3 py-2 text-xs rounded-lg transition-all duration-300 ${
                            isDark
                              ? 'bg-slate-700/50 text-gray-300 hover:bg-slate-600 border border-slate-600'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                          }`}
                        >
                          🌟 Top Solar
                        </button>
                        <button
                          onClick={() => setFilters({ ...defaultFilters, priceRange: [0, 20000], minRating: 4 })}
                          className={`w-full px-3 py-2 text-xs rounded-lg transition-all duration-300 ${
                            isDark
                              ? 'bg-slate-700/50 text-gray-300 hover:bg-slate-600 border border-slate-600'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                          }`}
                        >
                          💰 Budget
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Active Filters Summary */}
                  {(filters.category !== 'All' || filters.minRating > 0 || filters.priceRange[0] > 0 || filters.priceRange[1] < 100000 || filters.powerRange[0] > 0 || filters.powerRange[1] < 10000 || filters.warranty !== 'All' || filters.availability !== 'All Products') && (
                    <div className={`p-4 rounded-lg border-l-4 border-[#3DD56D] ${
                      isDark ? 'bg-slate-800/50' : 'bg-green-50/50'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#3DD56D]" />
                          <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            🎯 {filteredProducts.length} products match your filters
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {filters.category !== 'All' && (
                            <span className="px-2 py-1 bg-[#3DD56D] text-white text-xs rounded-full">
                              {filters.category}
                            </span>
                          )}
                          {filters.minRating > 0 && (
                            <span className="px-2 py-1 bg-[#3DD56D] text-white text-xs rounded-full">
                              {filters.minRating}+ ⭐
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </GreanCard>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Smart Insights Panel */}
        <AnimatePresence>
          {showInsights && comparisonProducts.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-8"
            >
              <GreanCard pattern="radial" gradient={true} className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${
                      isDark ? 'bg-[#3DD56D]/20' : 'bg-[#2bb757]/20'
                    }`}>
                      <Sparkles className={`w-5 h-5 ${
                        isDark ? 'text-[#3DD56D]' : 'text-[#2bb757]'
                      }`} />
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        Smart Analysis Results
                      </h3>
                      <p className={`text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        AI-powered insights for your selected products
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowInsights(false)}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      isDark ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(comparisonMetrics).map(([key, value]) => (
                    <div
                      key={key}
                      className={`p-4 rounded-xl border ${
                        isDark
                          ? 'bg-slate-800/50 border-slate-700'
                          : 'bg-white/50 border-green-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {getMetricIcon(key)}
                        <span className={`text-sm font-semibold ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                      </div>
                      <p className={`font-bold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className={`mt-6 p-4 rounded-xl ${
                  isDark ? 'bg-slate-800/30' : 'bg-green-50/50'
                }`}>
                  <h4 className={`font-semibold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    💡 Recommendation
                  </h4>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Based on your selection, <strong>{comparisonMetrics.bestValue}</strong> offers the best value for money,
                    while <strong>{comparisonMetrics.mostEfficient}</strong> provides the highest efficiency.
                    Consider your priorities: budget vs. performance.
                  </p>
                </div>
              </GreanCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Products Summary */}
        {selectedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border shadow-lg backdrop-blur-sm p-6 mb-8 ${
              isDark
                ? 'bg-slate-800/90 border-slate-700/60'
                : 'bg-white/90 border-green-200/60'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-bold ${
                isDark ? 'text-white' : 'text-green-900'
              }`}>
                Selected for Comparison ({selectedProducts.length}/4)
              </h3>
              <button
                onClick={clearSelections}
                className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-300 ${
                  isDark
                    ? 'text-red-400 hover:bg-red-400/10'
                    : 'text-red-600 hover:bg-red-50'
                }`}
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {selectedProducts.map(productName => {
                const product = products.find(p => p.name === productName);
                if (!product) return null;

                return (
                  <div
                    key={productName}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                      isDark
                        ? 'bg-slate-700/90 border-slate-600 text-white'
                        : 'bg-green-50 border-green-200 text-green-900'
                    }`}
                  >
                    {getCategoryIcon(product.category)}
                    <span className="font-medium">{product.name}</span>
                    <button
                      onClick={() => toggleProductSelection(productName)}
                      className={`ml-2 p-1 rounded-full transition-all duration-300 ${
                        isDark
                          ? 'hover:bg-slate-600 text-gray-400 hover:text-white'
                          : 'hover:bg-green-200 text-green-600 hover:text-green-800'
                      }`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Brand-Compliant Product Selection Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className={`typography-h3 text-2xl ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Select Products to Compare
            </h3>
            <div className={`typography-small px-3 py-1 rounded-lg ${
              isDark ? 'bg-[#3DD56D]/20 text-[#3DD56D]' : 'bg-[#2bb757]/20 text-[#2bb757]'
            }`}>
              Sorted by: {sortBy} ({sortOrder === 'asc' ? 'ascending' : 'descending'})
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.slice(0, 12).map((product) => {
              const isSelected = selectedProducts.includes(product.name);
              const canSelect = selectedProducts.length < 4 || isSelected;

              return (
                <motion.div
                  key={product.name}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`relative rounded-2xl border shadow-lg backdrop-blur-sm p-6 transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'border-[#3DD56D] bg-[#3DD56D]/10 shadow-[#3DD56D]/20'
                      : isDark
                      ? 'bg-slate-800/90 border-slate-700/60 hover:border-slate-600'
                      : 'bg-white/90 border-green-200/60 hover:border-green-300'
                  } ${!canSelect ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => canSelect && toggleProductSelection(product.name)}
                >
                  {/* Enhanced Selection and Favorite Indicators */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.name);
                      }}
                      className={`p-2 rounded-full transition-all duration-300 ${
                        favoriteProducts.includes(product.name)
                          ? 'bg-red-500 text-white'
                          : isDark
                          ? 'bg-slate-700/50 text-gray-400 hover:text-red-400'
                          : 'bg-white/50 text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${
                        favoriteProducts.includes(product.name) ? 'fill-current' : ''
                      }`} />
                    </button>

                    <div className={`p-2 rounded-full ${
                      isSelected
                        ? 'bg-[#3DD56D] text-white'
                        : canSelect
                        ? isDark ? 'bg-slate-700/50 text-gray-400' : 'bg-white/50 text-gray-500'
                        : 'bg-gray-300 text-gray-400'
                    }`}>
                      {isSelected ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : canSelect ? (
                        <Plus className="w-4 h-4" />
                      ) : (
                        <AlertCircle className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  {/* Product Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.badge && (
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                        isDark
                          ? 'bg-[#3DD56D]/20 text-[#3DD56D]'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {product.badge}
                      </span>
                    )}
                    {product.sale && (
                      <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-red-500 text-white">
                        SALE
                      </span>
                    )}
                    {comparisonMetrics.bestValue === product.name && (
                      <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-yellow-500 text-white">
                        💎 BEST VALUE
                      </span>
                    )}
                    {comparisonMetrics.mostEfficient === product.name && (
                      <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-blue-500 text-white">
                        ⚡ EFFICIENT
                      </span>
                    )}
                  </div>

                  {/* Enhanced Product Info */}
                  <div className="mt-16 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                        isDark
                          ? 'bg-gradient-to-br from-[#3DD56D]/30 to-[#2bb757]/30 border border-[#3DD56D]/30'
                          : 'bg-gradient-to-br from-green-100/80 to-green-200/80 border border-green-300/50'
                      }`}>
                        {getCategoryIcon(product.category)}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-bold text-base leading-tight mb-1 ${
                          isDark ? 'text-white' : 'text-green-900'
                        }`}>
                          {product.name}
                        </h4>
                        <p className={`text-sm ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {product.subcategory}
                        </p>
                      </div>
                    </div>

                    {/* Enhanced Rating and Price */}
                    <div className="flex items-center justify-between mb-4 p-3 rounded-xl bg-gradient-to-r from-transparent to-green-50/30 dark:to-slate-800/30">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className={`text-sm font-bold ${
                          isDark ? 'text-white' : 'text-green-900'
                        }`}>
                          {product.rating}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          isDark ? 'text-[#3DD56D]' : 'text-green-600'
                        }`}>
                          ETB {product.price.toLocaleString()}
                        </div>
                        {product.oldPrice && (
                          <div className="text-xs text-gray-500 line-through">
                            ETB {product.oldPrice.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Enhanced Key Specs */}
                    <div className="space-y-3">
                      {product.specifications?.power && (
                        <div className={`flex justify-between items-center p-2 rounded-lg ${
                          isDark ? 'bg-slate-800/30' : 'bg-green-50/50'
                        }`}>
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              Power
                            </span>
                          </div>
                          <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-green-900'}`}>
                            {product.specifications.power}
                          </span>
                        </div>
                      )}
                      {product.specifications?.warranty && (
                        <div className={`flex justify-between items-center p-2 rounded-lg ${
                          isDark ? 'bg-slate-800/30' : 'bg-green-50/50'
                        }`}>
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-blue-500" />
                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              Warranty
                            </span>
                          </div>
                          <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-green-900'}`}>
                            {product.specifications.warranty}
                          </span>
                        </div>
                      )}
                      {product.specifications?.efficiency && (
                        <div className={`flex justify-between items-center p-2 rounded-lg ${
                          isDark ? 'bg-slate-800/30' : 'bg-green-50/50'
                        }`}>
                          <div className="flex items-center gap-2">
                            <Gauge className="w-4 h-4 text-green-500" />
                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              Efficiency
                            </span>
                          </div>
                          <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-green-900'}`}>
                            {product.specifications.efficiency}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add quick view functionality
                      }}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                        isDark
                          ? 'bg-slate-700 text-white hover:bg-slate-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Eye className="w-4 h-4 mx-auto" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add share functionality
                      }}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                        isDark
                          ? 'bg-slate-700 text-white hover:bg-slate-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Share2 className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className={`text-center py-12 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Comparison Table */}
        {comparisonProducts.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h3 className={`typography-h1 text-3xl mb-8 text-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Product Comparison
            </h3>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className={`min-w-full text-sm rounded-3xl border shadow-2xl backdrop-blur-xl divide-y ${
                isDark
                  ? 'border-slate-700/60 bg-gradient-to-br from-slate-800 to-slate-900/60 divide-slate-700/30'
                  : 'border-green-200/60 bg-gradient-to-br from-white to-green-50/60 divide-green-200/30'
              }`}>
                <thead className={`sticky top-0 backdrop-blur-sm ${
                  isDark
                    ? 'bg-gradient-to-r from-slate-800/90 to-slate-700/90 text-white'
                    : 'bg-gradient-to-r from-green-50/90 to-white/90 text-hero-title'
                }`}>
                  <tr>
                    <th className="px-8 py-6 font-black text-left text-base">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          isDark ? 'bg-green-400' : 'bg-button-color'
                        }`}></div>
                        Product
                      </div>
                    </th>
                    <th className="px-6 py-6 font-black text-center text-base">Category</th>
                    <th className="px-6 py-6 font-black text-center text-base">Rating</th>
                    <th className="px-6 py-6 font-black text-center text-base">Price</th>
                    <th className="px-6 py-6 font-black text-center text-base">Power</th>
                    <th className="px-6 py-6 font-black text-center text-base">Efficiency</th>
                    <th className="px-6 py-6 font-black text-center text-base">Warranty</th>
                    <th className="px-8 py-6 font-black text-right text-base">Action</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${
                  isDark ? 'divide-slate-700/20' : 'divide-green-200/20'
                }`}>
                  {comparisonProducts.map((product, index) => {
                    const efficiencyPercent = getEfficiencyPercentage(product.specifications?.efficiency);

                    return (
                      <tr
                        key={product.name}
                        className={`transition-all duration-300 group ${
                          isDark ? 'hover:bg-slate-700/50' : 'hover:bg-green-50/50'
                        }`}
                      >
                        {/* Product Info */}
                        <td className="px-4 py-6">
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm ${
                              isDark
                                ? 'bg-gradient-to-br from-[#3DD56D]/30 to-[#2bb757]/30 border border-[#3DD56D]/30'
                                : 'bg-gradient-to-br from-green-100/80 to-green-200/80 border border-green-300/50'
                            }`}>
                              {getCategoryIcon(product.category)}
                            </div>
                            <div>
                              <div className={`font-black text-lg group-hover:text-[#3DD56D] transition-colors ${
                                isDark ? 'text-white' : 'text-hero-title'
                              }`}>
                                {product.name}
                              </div>
                              <div className={`text-sm mt-1 font-medium ${
                                isDark ? 'text-gray-300' : 'text-description-text'
                              }`}>
                                {product.subcategory}
                              </div>
                              {product.badge && (
                                <span className={`text-xs px-2 py-1 rounded-lg font-semibold mt-2 inline-block ${
                                  isDark ? 'bg-[#3DD56D]/20 text-[#2bb757]' : 'bg-green-100 text-green-700'
                                }`}>
                                  {product.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-3 py-6 text-center">
                          <span className="inline-flex items-center px-3 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#3DD56D]/20 to-[#2bb757]/20 text-[#2bb757] border border-[#3DD56D]/30 shadow-lg backdrop-blur-sm">
                            {product.category.toUpperCase()}
                          </span>
                        </td>

                        {/* Rating */}
                        <td className="px-3 py-6 text-center">
                          <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1 mb-2">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className={`font-black text-lg ${
                                isDark ? 'text-white' : 'text-hero-title'
                              }`}>
                                {product.rating}
                              </span>
                            </div>
                            <div className={`w-20 h-2 rounded-full overflow-hidden ${
                              isDark ? 'bg-slate-700/50' : 'bg-green-200/50'
                            }`}>
                              <div
                                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
                                style={{ width: `${(product.rating / 5) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="px-3 py-6 text-center">
                          <div className="flex flex-col items-center">
                            <div className={`text-xl font-black mb-1 ${
                              isDark ? 'text-white' : 'text-[#2bb757]'
                            }`}>
                              ETB {product.price.toLocaleString()}
                            </div>
                            {product.oldPrice && (
                              <div className="flex items-center gap-2">
                                <span className={`text-sm line-through font-medium ${
                                  isDark ? 'text-gray-400' : 'text-[#2bb757]/70'
                                }`}>
                                  ETB {product.oldPrice.toLocaleString()}
                                </span>
                                {product.sale && (
                                  <div className="text-sm text-[#2bb757] font-semibold bg-[#3DD56D]/10 px-2 py-1 rounded-lg">
                                    SALE
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Power */}
                        <td className="px-3 py-6 text-center">
                          <div className={`font-black text-lg ${
                            isDark ? 'text-white' : 'text-[#2bb757]'
                          }`}>
                            {product.specifications?.power || 'N/A'}
                          </div>
                        </td>

                        {/* Efficiency */}
                        <td className="px-3 py-6 text-center">
                          <div className="flex flex-col items-center">
                            <div className={`text-xl font-black mb-2 ${
                              isDark ? 'text-white' : 'text-[#2bb757]'
                            }`}>
                              {product.specifications?.efficiency || 'N/A'}
                            </div>
                            {efficiencyPercent > 0 && (
                              <div className={`w-20 h-3 rounded-full overflow-hidden backdrop-blur-sm ${
                                isDark ? 'bg-slate-700/50' : 'bg-[#3DD56D]/20'
                              }`}>
                                <div
                                  className="h-full bg-gradient-to-r from-[#3DD56D] to-[#2bb757] rounded-full shadow-inner"
                                  style={{ width: `${efficiencyPercent}%` }}
                                ></div>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Warranty */}
                        <td className="px-3 py-6 text-center">
                          <div className={`font-black text-lg ${
                            isDark ? 'text-white' : 'text-[#2bb757]'
                          }`}>
                            {product.specifications?.warranty || 'N/A'}
                          </div>
                        </td>

                        {/* Brand-Compliant Action */}
                        <td className="px-4 py-6 text-right">
                          <GreanButton variant="primary" size="default">
                            Select Product
                          </GreanButton>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-6">
              {comparisonProducts.map((product, index) => (
                <motion.div
                  key={product.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-3xl border shadow-2xl backdrop-blur-xl overflow-hidden ${
                    isDark
                      ? 'bg-gradient-to-br from-slate-800 to-slate-900/60 border-slate-700/60'
                      : 'bg-gradient-to-br from-white to-green-50/60 border-green-200/60'
                  }`}
                >
                  {/* Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg border backdrop-blur-sm ${
                        isDark
                          ? 'bg-gradient-to-br from-[#3DD56D]/30 to-[#2bb757]/30 border-[#3DD56D]/30'
                          : 'bg-gradient-to-br from-green-100/80 to-green-200/80 border-green-300/50'
                      }`}>
                        {getCategoryIcon(product.category)}
                      </div>
                      <div className="flex-1">
                        <div className={`font-black text-2xl mb-2 ${
                          isDark ? 'text-white' : 'text-[#2bb757]'
                        }`}>
                          {product.name}
                        </div>
                        <div className={`text-sm mb-3 font-medium ${
                          isDark ? 'text-gray-300' : 'text-[#2bb757]/80'
                        }`}>
                          {product.subcategory}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center px-3 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#3DD56D]/20 to-[#2bb757]/20 text-[#2bb757] border border-[#3DD56D]/30 shadow-lg backdrop-blur-sm">
                            {product.category.toUpperCase()}
                          </span>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className={`text-sm font-semibold ${
                              isDark ? 'text-white' : 'text-[#2bb757]'
                            }`}>
                              {product.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price Section */}
                    <div className={`rounded-2xl p-6 mb-6 border backdrop-blur-sm ${
                      isDark
                        ? 'bg-gradient-to-r from-[#3DD56D]/10 to-slate-800/80 border-[#3DD56D]/30'
                        : 'bg-gradient-to-r from-[#3DD56D]/10 to-white/80 border-[#3DD56D]/30'
                    }`}>
                      <div className="text-center">
                        <div className={`text-4xl font-black mb-2 ${
                          isDark ? 'text-white' : 'text-[#2bb757]'
                        }`}>
                          ETB {product.price.toLocaleString()}
                        </div>
                        {product.oldPrice && (
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <span className={`text-lg line-through font-medium ${
                              isDark ? 'text-gray-400' : 'text-[#2bb757]/70'
                            }`}>
                              ETB {product.oldPrice.toLocaleString()}
                            </span>
                            {product.sale && (
                              <div className="text-lg text-[#2bb757] font-semibold bg-[#3DD56D]/10 px-3 py-2 rounded-xl">
                                SALE
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Brand-Compliant Action Button */}
                    <GreanButton variant="primary" size="lg" className="w-full inline-flex items-center justify-center gap-3">
                      Select Product
                      <ArrowRight className="w-5 h-5" />
                    </GreanButton>
                  </div>

                  {/* Details Section */}
                  <div className={`border-t p-6 pt-6 ${
                    isDark ? 'border-slate-700/30' : 'border-[#3DD56D]/30'
                  }`}>
                    <div className="grid grid-cols-2 gap-6">
                      {/* Specifications */}
                      <div className={`rounded-2xl p-5 text-center border backdrop-blur-sm ${
                        isDark
                          ? 'bg-gradient-to-br from-slate-700/80 to-slate-800/80 border-slate-600'
                          : 'bg-gradient-to-br from-[#3DD56D]/10 to-white/80 border-[#3DD56D]/30'
                      }`}>
                        <h5 className={`font-black text-base mb-3 ${
                          isDark ? 'text-white' : 'text-[#2bb757]'
                        }`}>
                          Power
                        </h5>
                        <div className={`text-2xl font-black ${
                          isDark ? 'text-white' : 'text-[#2bb757]'
                        }`}>
                          {product.specifications?.power || 'N/A'}
                        </div>
                      </div>

                      <div className={`rounded-2xl p-5 text-center border backdrop-blur-sm ${
                        isDark
                          ? 'bg-gradient-to-br from-slate-700/80 to-slate-800/80 border-slate-600'
                          : 'bg-gradient-to-br from-[#3DD56D]/10 to-white/80 border-[#3DD56D]/30'
                      }`}>
                        <h5 className={`font-black text-base mb-3 ${
                          isDark ? 'text-white' : 'text-[#2bb757]'
                        }`}>
                          Warranty
                        </h5>
                        <div className={`text-2xl font-black ${
                          isDark ? 'text-white' : 'text-[#2bb757]'
                        }`}>
                          {product.specifications?.warranty || 'N/A'}
                        </div>
                      </div>
                    </div>

                    {/* Efficiency */}
                    {product.specifications?.efficiency && (
                      <div className={`rounded-2xl p-5 text-center border backdrop-blur-sm mt-6 ${
                        isDark
                          ? 'bg-gradient-to-br from-slate-700/80 to-slate-800/80 border-slate-600'
                          : 'bg-gradient-to-br from-[#3DD56D]/10 to-white/80 border-[#3DD56D]/30'
                      }`}>
                        <h5 className={`font-black text-base mb-3 ${
                          isDark ? 'text-white' : 'text-[#2bb757]'
                        }`}>
                          Efficiency
                        </h5>
                        <div className={`text-3xl font-black mb-3 ${
                          isDark ? 'text-white' : 'text-[#2bb757]'
                        }`}>
                          {product.specifications.efficiency}
                        </div>
                        {getEfficiencyPercentage(product.specifications.efficiency) > 0 && (
                          <div className={`w-full h-3 rounded-full overflow-hidden ${
                            isDark ? 'bg-slate-600/50' : 'bg-[#3DD56D]/20'
                          }`}>
                            <div
                              className="h-full bg-gradient-to-r from-[#3DD56D] to-[#2bb757] rounded-full shadow-inner"
                              style={{ width: `${getEfficiencyPercentage(product.specifications.efficiency)}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
