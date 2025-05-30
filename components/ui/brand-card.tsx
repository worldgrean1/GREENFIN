import React, { memo, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import { GreanCard } from './grean-card';

// Enhanced brand card interface that extends the original GreanCard
interface BrandCardProps {
  children: React.ReactNode;
  className?: string;
  // Brand-specific props
  pattern?: 'dots' | 'waves' | 'grid' | 'radial' | 'none';
  gradient?: boolean;
  // Extended props for compatibility with existing cards
  variant?: 'default' | 'product' | 'feature' | 'hero' | 'premium';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  glowEffect?: boolean;
  animationType?: 'subtle' | 'dramatic' | 'energy-burst';
  onClick?: () => void;
  useBrandComponent?: boolean; // Flag to use pure GreanCard
}

// Enhanced brand card that combines GreanCard with existing functionality
export const BrandCard = memo<BrandCardProps>(({
  children,
  className = '',
  pattern = 'none',
  gradient = false,
  variant = 'default',
  size = 'md',
  glowEffect = false,
  animationType = 'subtle',
  onClick,
  useBrandComponent = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isDark } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  // If useBrandComponent is true, use the pure GreanCard
  if (useBrandComponent) {
    return (
      <GreanCard
        pattern={pattern}
        gradient={gradient}
        className={className}
      >
        {children}
      </GreanCard>
    );
  }

  // Size variants with brand-compliant styling
  const sizeClasses = {
    sm: 'min-h-[300px] p-4',
    md: 'min-h-[400px] p-6',
    lg: 'min-h-[500px] p-8',
    xl: 'min-h-[600px] p-10',
  };

  // Brand-compliant card styles
  const cardStyles = useMemo(() => {
    const baseStyles = {
      background: isDark
        ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)'
        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
      borderColor: isDark
        ? 'var(--grean-primary)'
        : 'var(--grean-primary-light)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
    };

    if (glowEffect && isHovered) {
      return {
        ...baseStyles,
        boxShadow: isDark
          ? '0 0 40px var(--grean-primary)/30, 0 0 80px var(--grean-primary)/10'
          : '0 0 40px var(--grean-primary-light)/20, 0 0 80px var(--grean-primary-light)/05',
      };
    }

    return baseStyles;
  }, [isDark, glowEffect, isHovered]);

  // Animation variants
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    hover: animationType === 'dramatic' ? {
      y: -8,
      scale: 1.02,
      transition: { duration: 0.3 }
    } : {
      y: -4,
      scale: 1.01,
      transition: { duration: 0.3 }
    }
  };

  // Pattern backgrounds using brand colors
  const patternStyles = {
    dots: `radial-gradient(circle at 20px 20px, var(--grean-primary)/20 2px, transparent 2px)`,
    waves: `repeating-linear-gradient(45deg, var(--grean-primary)/10 0px, var(--grean-primary)/10 10px, transparent 10px, transparent 20px)`,
    grid: `linear-gradient(var(--grean-primary)/10 1px, transparent 1px), linear-gradient(90deg, var(--grean-primary)/10 1px, transparent 1px)`,
    radial: `radial-gradient(circle at center, var(--grean-primary)/15 0%, transparent 70%)`,
    none: 'none'
  };

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-2xl border-2 transition-all duration-500 transform-gpu will-change-transform',
        'hover:border-grean-primary/50',
        sizeClasses[size],
        onClick && 'cursor-pointer',
        className
      )}
      style={cardStyles}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover={!prefersReducedMotion ? "hover" : undefined}
      viewport={{ once: true, margin: '-50px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Pattern Background */}
      {pattern !== 'none' && (
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: patternStyles[pattern],
            backgroundSize: pattern === 'grid' ? '20px 20px' : pattern === 'radial' ? '100px 100px' : '40px 40px'
          }}
        />
      )}

      {/* Gradient Overlay */}
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-grean-primary/5 to-grean-secondary/5 pointer-events-none" />
      )}

      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>

      {/* Hover Glow Effect */}
      {glowEffect && isHovered && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-grean-primary/10 to-grean-secondary/10 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Energy Burst Effect for dramatic animations */}
      {animationType === 'energy-burst' && isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-gradient-radial from-grean-primary/20 via-grean-secondary/10 to-transparent animate-pulse" />
        </motion.div>
      )}
    </motion.div>
  );
});

BrandCard.displayName = 'BrandCard';

// Compatibility wrapper for existing PremiumCard usage
export interface PremiumCardCompatProps extends BrandCardProps {
  patternType?: 'circles' | 'waves' | 'geometric' | 'energy';
}

export const PremiumCardCompat = memo<PremiumCardCompatProps>(({
  patternType,
  ...props
}) => {
  // Map patternType to pattern for compatibility
  const patternMap: Record<string, BrandCardProps['pattern']> = {
    circles: 'dots',
    waves: 'waves',
    geometric: 'grid',
    energy: 'radial',
  };

  const mappedPattern = patternType ? patternMap[patternType] || 'none' : props.pattern;

  return (
    <BrandCard
      {...props}
      pattern={mappedPattern}
      variant="premium"
    />
  );
});

PremiumCardCompat.displayName = 'PremiumCardCompat';

export { BrandCard as default };
