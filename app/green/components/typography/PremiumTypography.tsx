'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

// Typography component types
interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  delay?: number;
  variant?: 'primary' | 'secondary' | 'accent';
}

// Hero Title Component
const HeroTitle = memo<TypographyProps>(({
  children, 
  className = '', 
  animate = true, 
  delay = 0,
  variant = 'primary' 
}) => {
  const { isDark } = useTheme();
  
  const baseClasses = 'hero-title-primary luxury-text text-performance-optimized';
  const themeClasses = isDark 
    ? 'text-white luxury-text-shadow' 
    : 'text-hero-title premium-text-shadow';
  
  const variantClasses = {
    primary: 'text-glow-green',
    secondary: 'text-glow-white',
    accent: 'text-fluid-6xl'
  };

  const Component = animate ? motion.h1 : 'h1';
  const animationProps = animate ? {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 1, delay, ease: [0.25, 0.46, 0.45, 0.94] }
  } : {};

  return (
    <Component
      className={`${baseClasses} ${themeClasses} ${variantClasses[variant]} ${className}`}
      {...animationProps}
    >
      {children}
    </Component>
  );
});

HeroTitle.displayName = 'HeroTitle';

// Section Title Component
const SectionTitle = memo<TypographyProps>(({
  children, 
  className = '', 
  animate = true, 
  delay = 0,
  variant = 'primary' 
}) => {
  const { isDark } = useTheme();
  
  const baseClasses = 'section-title-primary luxury-text text-performance-optimized';
  const themeClasses = isDark 
    ? 'text-white luxury-text-shadow' 
    : 'text-hero-title premium-text-shadow';

  const Component = animate ? motion.h2 : 'h2';
  const animationProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: 'easeOut' }
  } : {};

  return (
    <Component
      className={`${baseClasses} ${themeClasses} ${className}`}
      {...animationProps}
    >
      {children}
    </Component>
  );
});

SectionTitle.displayName = 'SectionTitle';

// Section Subtitle Component
const SectionSubtitle = memo<TypographyProps>(({
  children, 
  className = '', 
  animate = true, 
  delay = 0 
}) => {
  const { isDark } = useTheme();
  
  const baseClasses = 'section-subtitle elegant-text text-performance-optimized';
  const themeClasses = isDark 
    ? 'text-white elegant-text-shadow' 
    : 'text-description-text';

  const Component = animate ? motion.p : 'p';
  const animationProps = animate ? {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: 'easeOut' }
  } : {};

  return (
    <Component
      className={`${baseClasses} ${themeClasses} ${className}`}
      {...animationProps}
    >
      {children}
    </Component>
  );
});

SectionSubtitle.displayName = 'SectionSubtitle';

// Card Title Component
const CardTitle = memo<TypographyProps>(({
  children, 
  className = '', 
  animate = true, 
  delay = 0,
  variant = 'primary' 
}) => {
  const { isDark } = useTheme();
  
  const baseClasses = variant === 'primary' 
    ? 'card-title-primary premium-text text-performance-optimized'
    : 'card-title-secondary premium-text text-performance-optimized';
  
  const themeClasses = isDark ? 'text-white' : 'text-hero-title';

  const Component = animate ? motion.h3 : 'h3';
  const animationProps = animate ? {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, delay, ease: 'easeOut' }
  } : {};

  return (
    <Component
      className={`${baseClasses} ${themeClasses} ${className}`}
      {...animationProps}
    >
      {children}
    </Component>
  );
});

CardTitle.displayName = 'CardTitle';

// Card Body Text Component
const CardBodyText = memo<TypographyProps>(({
  children, 
  className = '', 
  animate = true, 
  delay = 0 
}) => {
  const { isDark } = useTheme();
  
  const baseClasses = 'card-body-text elegant-text text-performance-optimized';
  const themeClasses = isDark ? 'text-gray-300' : 'text-description-text';

  const Component = animate ? motion.p : 'p';
  const animationProps = animate ? {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay, ease: 'easeOut' }
  } : {};

  return (
    <Component
      className={`${baseClasses} ${themeClasses} ${className}`}
      {...animationProps}
    >
      {children}
    </Component>
  );
});

CardBodyText.displayName = 'CardBodyText';

// CTA Text Component
const CTAText = memo<TypographyProps>(({
  children, 
  className = '', 
  animate = true, 
  delay = 0,
  variant = 'primary' 
}) => {
  const baseClasses = variant === 'primary' 
    ? 'cta-text-primary premium-text text-performance-optimized'
    : 'cta-text-secondary premium-text text-performance-optimized';

  const Component = animate ? motion.span : 'span';
  const animationProps = animate ? {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, delay, ease: 'easeOut' }
  } : {};

  return (
    <Component
      className={`${baseClasses} ${className}`}
      {...animationProps}
    >
      {children}
    </Component>
  );
});

CTAText.displayName = 'CTAText';

// Badge Text Component
const BadgeText = memo<TypographyProps>(({
  children, 
  className = '', 
  animate = true, 
  delay = 0 
}) => {
  const baseClasses = 'badge-text premium-text text-performance-optimized';

  const Component = animate ? motion.span : 'span';
  const animationProps = animate ? {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, delay, ease: 'backOut' }
  } : {};

  return (
    <Component
      className={`${baseClasses} ${className}`}
      {...animationProps}
    >
      {children}
    </Component>
  );
});

BadgeText.displayName = 'BadgeText';

// Fluid Text Component (responsive sizing)
interface FluidTextProps extends TypographyProps {
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
}

const FluidText = memo<FluidTextProps>(({
  children, 
  className = '', 
  animate = true, 
  delay = 0,
  size = 'base',
  weight = 'normal'
}) => {
  const { isDark } = useTheme();
  
  const sizeClasses = `text-fluid-${size}`;
  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
    black: 'font-black'
  };
  
  const baseClasses = `typography-base text-performance-optimized ${sizeClasses} ${weightClasses[weight]}`;
  const themeClasses = isDark ? 'text-white' : 'text-gray-900';

  const Component = animate ? motion.div : 'div';
  const animationProps = animate ? {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay, ease: 'easeOut' }
  } : {};

  return (
    <Component
      className={`${baseClasses} ${themeClasses} ${className}`}
      {...animationProps}
    >
      {children}
    </Component>
  );
});

FluidText.displayName = 'FluidText';

// Export all components
export {
  HeroTitle,
  SectionTitle,
  SectionSubtitle,
  CardTitle,
  CardBodyText,
  CTAText,
  BadgeText,
  FluidText
};

export default {
  HeroTitle,
  SectionTitle,
  SectionSubtitle,
  CardTitle,
  CardBodyText,
  CTAText,
  BadgeText,
  FluidText
};
