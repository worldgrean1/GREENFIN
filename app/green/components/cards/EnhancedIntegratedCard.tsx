'use client';

import React, { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Leaf, Sun, Flame, BarChart2, Award } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useBrandTheme } from '@/components/theme-provider';
import { PremiumCard } from './PremiumCard';
import { GreanCard } from '@/components/ui/grean-card';
import { GreanButton } from '@/components/ui/grean-button';

// Types
interface IntegratedSolution {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  stats: {
    label: string;
    value: string;
    unit?: string;
  }[];
  category: 'solar' | 'cookstoves' | 'energy' | 'sustainability';
  badge?: string;
  ctaText?: string;
}

interface EnhancedIntegratedCardProps {
  solution: IntegratedSolution;
  onLearnMore?: (solution: IntegratedSolution) => void;
  className?: string;
  variant?: 'default' | 'featured' | 'compact';
}

// Category Icons and Colors - Updated with brand theme awareness
const getCategoryConfig = (category: string, isDarkMode: boolean) => {
  const baseConfig = {
    solar: {
      icon: Sun,
      gradient: isDarkMode ? 'from-grean-primary to-grean-secondary' : 'from-grean-secondary to-grean-accent',
      bgGradient: isDarkMode ? 'from-grean-primary/10 to-grean-secondary/10' : 'from-grean-secondary/5 to-grean-accent/5',
      accentColor: isDarkMode ? '#3DD56D' : '#2bb757',
    },
    cookstoves: {
      icon: Flame,
      gradient: isDarkMode ? 'from-grean-secondary to-grean-accent' : 'from-grean-accent to-grean-secondary',
      bgGradient: isDarkMode ? 'from-grean-secondary/10 to-grean-accent/10' : 'from-grean-accent/5 to-grean-secondary/5',
      accentColor: isDarkMode ? '#2bb757' : '#23A455',
    },
    energy: {
      icon: Zap,
      gradient: isDarkMode ? 'from-grean-primary to-grean-accent' : 'from-grean-secondary to-grean-primary',
      bgGradient: isDarkMode ? 'from-grean-primary/10 to-grean-accent/10' : 'from-grean-secondary/5 to-grean-primary/5',
      accentColor: isDarkMode ? '#3DD56D' : '#2bb757',
    },
    sustainability: {
      icon: Leaf,
      gradient: isDarkMode ? 'from-grean-secondary to-grean-primary' : 'from-grean-primary to-grean-secondary',
      bgGradient: isDarkMode ? 'from-grean-secondary/10 to-grean-primary/10' : 'from-grean-primary/5 to-grean-secondary/5',
      accentColor: isDarkMode ? '#2bb757' : '#23A455',
    }
  };

  return baseConfig[category as keyof typeof baseConfig] || baseConfig.sustainability;
};

// Stats Component
const StatsGrid = memo(({ stats, accentColor }: { stats: IntegratedSolution['stats']; accentColor: string }) => {
  const { isDark } = useTheme();
  const { isDarkMode } = useBrandTheme();

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className={`text-center p-3 rounded-xl ${
            isDarkMode
              ? 'bg-slate-800/50 border border-slate-700/50'
              : 'bg-white/80 border border-gray-200/50'
          } backdrop-blur-sm`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div
            className="text-2xl font-bold mb-1"
            style={{ color: accentColor }}
          >
            {stat.value}
            {stat.unit && <span className="text-sm ml-1">{stat.unit}</span>}
          </div>
          <div className={`text-xs font-medium ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
});

StatsGrid.displayName = 'StatsGrid';

// Features List Component
const FeaturesList = memo(({ features, accentColor }: { features: string[]; accentColor: string }) => {
  const { isDark } = useTheme();
  const { isDarkMode } = useBrandTheme();

  return (
    <div className="space-y-2">
      {features.slice(0, 4).map((feature, index) => (
        <motion.div
          key={feature}
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: accentColor }}
          />
          <span className={`text-sm font-medium ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {feature}
          </span>
        </motion.div>
      ))}
    </div>
  );
});

FeaturesList.displayName = 'FeaturesList';

// Main Enhanced Integrated Card Component
export const EnhancedIntegratedCard = memo<EnhancedIntegratedCardProps>(({
  solution,
  onLearnMore,
  className = '',
  variant = 'default',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isDark } = useTheme();
  const { isDarkMode } = useBrandTheme();
  const categoryConfig = getCategoryConfig(solution.category, isDarkMode);
  const IconComponent = categoryConfig.icon;

  const handleLearnMore = () => {
    onLearnMore?.(solution);
  };

  const cardSize = variant === 'compact' ? 'sm' : variant === 'featured' ? 'xl' : 'lg';

  return (
    <PremiumCard
      variant="feature"
      patternType="geometric"
      animationType={variant === 'featured' ? 'energy-burst' : 'dramatic'}
      glowEffect={true}
      size={cardSize}
      className={className}
      onClick={handleLearnMore}
    >
      <div className="flex flex-col h-full">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${categoryConfig.gradient} shadow-lg`}
            >
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className={`text-xl font-bold leading-tight ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {solution.title}
              </h3>
              <p className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {solution.subtitle}
              </p>
            </div>
          </div>

          {/* Badge */}
          {solution.badge && (
            <motion.div
              className={`px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r ${categoryConfig.gradient} text-white shadow-lg`}
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {solution.badge}
            </motion.div>
          )}
        </div>

        {/* Description */}
        <p className={`text-sm leading-relaxed mb-6 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {solution.description}
        </p>

        {/* Features Section */}
        <div className="mb-6">
          <h4 className={`text-sm font-semibold mb-3 flex items-center ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <div
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: categoryConfig.accentColor }}
            />
            Key Features
          </h4>
          <FeaturesList features={solution.features} accentColor={categoryConfig.accentColor} />
        </div>

        {/* Stats Section */}
        <div className="mb-6">
          <h4 className={`text-sm font-semibold mb-3 flex items-center ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <BarChart2 className="w-4 h-4 mr-2" style={{ color: categoryConfig.accentColor }} />
            Impact Metrics
          </h4>
          <StatsGrid stats={solution.stats} accentColor={categoryConfig.accentColor} />
        </div>

        {/* CTA Section */}
        <div className="mt-auto">
          <motion.button
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 bg-gradient-to-r ${categoryConfig.gradient} text-white hover:shadow-lg`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleLearnMore}
          >
            {solution.ctaText || 'Learn More'}
            <motion.div
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </motion.button>
        </div>
      </div>
    </PremiumCard>
  );
});

EnhancedIntegratedCard.displayName = 'EnhancedIntegratedCard';

export default EnhancedIntegratedCard;
