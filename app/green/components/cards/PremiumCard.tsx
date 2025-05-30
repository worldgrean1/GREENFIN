'use client';

import React, { memo, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

// Types
interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'product' | 'feature' | 'hero';
  patternType?: 'circles' | 'waves' | 'geometric' | 'energy';
  animationType?: 'subtle' | 'dramatic' | 'energy-burst';
  glowEffect?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
}

// SVG Pattern Definitions
const SVG_PATTERNS = {
  circles: (
    <pattern id="circles-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="20" cy="20" r="8" fill="#4ade80" fillOpacity="0.15" />
      <circle cx="10" cy="10" r="3" fill="#3dd56d" fillOpacity="0.1" />
      <circle cx="30" cy="30" r="3" fill="#3dd56d" fillOpacity="0.1" />
    </pattern>
  ),
  waves: (
    <pattern id="waves-pattern" width="100" height="20" patternUnits="userSpaceOnUse">
      <path d="M0,10 C30,15 70,5 100,10 L100,0 L0,0 Z" fill="#4ade80" fillOpacity="0.12" />
      <path d="M0,15 C25,18 75,8 100,15 L100,10 L0,10 Z" fill="#3dd56d" fillOpacity="0.08" />
    </pattern>
  ),
  geometric: (
    <pattern id="geometric-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M0,0 L30,15 L60,0 L45,30 L15,30 Z" fill="#4ade80" fillOpacity="0.1" />
      <circle cx="30" cy="30" r="2" fill="#3dd56d" fillOpacity="0.3" />
      <path d="M15,15 L45,15 L30,45 Z" fill="#16a34a" fillOpacity="0.08" />
    </pattern>
  ),
  energy: (
    <pattern id="energy-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
      <circle cx="40" cy="40" r="2" fill="#3dd56d" fillOpacity="0.4" />
      <path d="M20,20 L60,20 L40,60 Z" fill="#4ade80" fillOpacity="0.08" />
      <path d="M10,40 L30,30 L30,50 Z" fill="#16a34a" fillOpacity="0.12" />
      <path d="M50,30 L70,40 L50,50 Z" fill="#16a34a" fillOpacity="0.12" />
      <circle cx="20" cy="60" r="1.5" fill="#3dd56d" fillOpacity="0.3" />
      <circle cx="60" cy="20" r="1.5" fill="#3dd56d" fillOpacity="0.3" />
    </pattern>
  ),
};

// Energy Burst Animation Component
const EnergyBurst = memo(({ isActive }: { isActive: boolean }) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion || !isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Large Energy Ring */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-[#3dd56d]/30 rounded-full"
        style={{ transform: 'translate(-50%, -50%)' }}
        animate={{
          scale: [1, 2.5, 1],
          opacity: [0.6, 0, 0.6],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeOut',
        }}
      />

      {/* Medium Energy Ring */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-[#4ade80]/40 rounded-full"
        style={{ transform: 'translate(-50%, -50%)' }}
        animate={{
          scale: [1, 2, 1],
          opacity: [0.8, 0, 0.8],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeOut',
          delay: 0.5,
        }}
      />

      {/* Lightning Bolts */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-6 h-6 text-[#3dd56d]"
          style={{
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) rotate(${i * 90}deg) translateY(-40px)`,
          }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeOut',
            delay: i * 0.2,
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
});

EnergyBurst.displayName = 'EnergyBurst';

// Main Premium Card Component
export const PremiumCard = memo<PremiumCardProps>(({
  children,
  className = '',
  variant = 'default',
  patternType = 'circles',
  animationType = 'subtle',
  glowEffect = false,
  size = 'md',
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [energyBurstActive, setEnergyBurstActive] = useState(false);
  const { isDark } = useTheme();
  const { isLowPerformance } = usePerformanceMonitor();
  const prefersReducedMotion = useReducedMotion();

  // Size variants
  const sizeClasses = {
    sm: 'min-h-[300px] p-4',
    md: 'min-h-[400px] p-6',
    lg: 'min-h-[500px] p-8',
    xl: 'min-h-[600px] p-10',
  };

  // Card styles based on variant and theme
  const cardStyles = useMemo(() => {
    const baseStyles = {
      background: isDark
        ? 'linear-gradient(135deg, rgba(1, 20, 40, 0.95) 0%, rgba(2, 20, 40, 0.9) 100%)'
        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
      borderColor: isDark ? 'var(--grean-primary)/20' : 'var(--grean-primary-light)/30',
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
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    hover: animationType === 'dramatic' ? {
      y: -8,
      scale: 1.02,
      transition: { duration: 0.3, ease: 'easeOut' }
    } : {
      y: -4,
      scale: 1.01,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
  };

  // Energy burst trigger
  React.useEffect(() => {
    if (animationType === 'energy-burst' && !prefersReducedMotion && !isLowPerformance) {
      const interval = setInterval(() => {
        setEnergyBurstActive(true);
        setTimeout(() => setEnergyBurstActive(false), 3000);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [animationType, prefersReducedMotion, isLowPerformance]);

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl border-2 cursor-pointer
        transition-all duration-500 transform-gpu will-change-transform
        ${sizeClasses[size]}
        ${className}
      `}
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
      {/* SVG Pattern Background */}
      {!isLowPerformance && (
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {SVG_PATTERNS[patternType]}
            </defs>
            <rect width="100%" height="100%" fill={`url(#${patternType}-pattern)`} />
          </svg>
        </div>
      )}

      {/* Energy Burst Animation */}
      {animationType === 'energy-burst' && (
        <EnergyBurst isActive={energyBurstActive} />
      )}

      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>

      {/* Hover Glow Effect */}
      {glowEffect && isHovered && !isLowPerformance && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-grean-primary/10 to-grean-secondary/10 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
});

PremiumCard.displayName = 'PremiumCard';

export default PremiumCard;
