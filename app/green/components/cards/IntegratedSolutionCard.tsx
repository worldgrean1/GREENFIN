'use client';

import React, { memo, useState, useCallback, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle } from 'lucide-react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { useTheme } from '@/hooks/useTheme';
import { getCardPatternStyle } from '../shared/OptimizedBackground';

// Types for the solution data
interface SolutionStats {
  value: string;
  label: string;
}

interface IntegratedSolution {
  title: string;
  description: string;
  shortDescription: string;
  tags: string[];
  gradient: string;
  borderColor: string;
  hoverBorder: string;
  accentColor: string;
  bgAccent: string;
  iconColor?: string;
  iconBg?: string;
  hoverIconBg?: string;
  features: string[];
  stats: SolutionStats;
  icon?: React.ComponentType<any>;
}

interface IntegratedSolutionCardProps {
  solution: IntegratedSolution;
  index: number;
  onLearnMore?: (solution: IntegratedSolution) => void;
  className?: string;
  priority?: 'high' | 'normal' | 'low';
}

// Memoized feature list component for performance
const FeatureList = memo(({ features, accentColor, isDark }: {
  features: string[];
  accentColor: string;
  isDark: boolean;
}) => (
  <ul className="space-y-2 mb-6">
    {features.map((feature, idx) => (
      <motion.li
        key={feature}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 * idx, duration: 0.3 }}
        className="flex items-start space-x-3 text-sm"
      >
        <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${accentColor}`} />
        <span className={isDark ? 'text-gray-300' : 'text-description-text'}>
          {feature}
        </span>
      </motion.li>
    ))}
  </ul>
));

FeatureList.displayName = 'FeatureList';

// Memoized stats component
const StatsDisplay = memo(({ stats, accentColor, bgAccent, isDark }: {
  stats: SolutionStats;
  accentColor: string;
  bgAccent: string;
  isDark: boolean;
}) => (
  <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-full ${bgAccent} backdrop-blur-sm`}>
    <span className={`text-lg font-bold ${accentColor}`}>
      {stats.value}
    </span>
    <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-description-text'}`}>
      {stats.label}
    </span>
  </div>
));

StatsDisplay.displayName = 'StatsDisplay';

// Main card component
export const IntegratedSolutionCard = memo<IntegratedSolutionCardProps>(({
  solution,
  index,
  onLearnMore,
  className = '',
  priority = 'normal'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { isLowPerformance, shouldReduceAnimations } = usePerformanceMonitor();
  const { isDark, isLight } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  // Check if this is the Community Solar Projects card
  const isCommunityCard = solution.title === 'Community Solar Projects';

  // Memoized styles for performance
  const cardStyles = useMemo(() => ({
    background: isDark
      ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
    borderColor: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(156, 163, 175, 0.6)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  }), [isDark]);

  const patternStyle = useMemo(() =>
    !isLowPerformance ? getCardPatternStyle('triangleCard') : {},
    [isLowPerformance]
  );

  // Animation variants optimized for performance
  const cardVariants = useMemo(() => ({
    hidden: {
      opacity: 0,
      y: shouldReduceAnimations ? 10 : 40,
      scale: shouldReduceAnimations ? 1 : 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceAnimations ? 0.2 : 0.6,
        delay: priority === 'high' ? 0 : index * 0.1,
        ease: 'easeOut'
      }
    }
  }), [shouldReduceAnimations, index, priority]);

  const hoverVariants = useMemo(() => ({
    hover: shouldReduceAnimations ? {} : {
      y: -8,
      scale: 1.02,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  }), [shouldReduceAnimations]);

  // Handlers
  const handleLearnMore = useCallback(() => {
    onLearnMore?.(solution);
  }, [onLearnMore, solution]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleLearnMore();
    }
  }, [handleLearnMore]);

  return (
    <motion.article
      className={`
        group relative overflow-hidden rounded-2xl transition-all duration-500 h-[480px] w-full
        ${solution.borderColor} ${solution.hoverBorder}
        ${isDark
          ? 'shadow-lg hover:shadow-xl hover:shadow-green-500/10'
          : 'shadow-lg hover:shadow-xl hover:shadow-green-500/30 shadow-gray-300/50'
        }
        ${className}
      `}
      style={{
        ...cardStyles,
        border: `1px solid ${cardStyles.borderColor}`,
      }}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, margin: '-50px' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="article"
      aria-labelledby={`solution-${index}-title`}
    >
      {/* Background pattern overlay */}
      {!isLowPerformance && (
        <div
          className={`absolute inset-0 pointer-events-none ${
            isDark ? 'opacity-5' : 'opacity-3'
          }`}
          style={patternStyle}
        />
      )}

      {/* Gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${solution.gradient} pointer-events-none ${
          isDark ? 'opacity-20' : 'opacity-15'
        }`}
      />

      {/* SPECTACULAR PREMIUM ANIMATIONS - Community Solar Projects Only */}
      {isCommunityCard && !isLowPerformance && (
        <>
          {/* DRAMATIC Large Rotating Energy Ring */}
          <motion.div
            className="absolute top-2 right-2 w-28 h-28 pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{
              filter: 'drop-shadow(0 0 20px rgba(61, 213, 109, 0.8)) drop-shadow(0 0 40px rgba(61, 213, 109, 0.4))',
            }}
          >
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="communityRingOuter" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3DD56D" stopOpacity="1" />
                  <stop offset="33%" stopColor="#2bb757" stopOpacity="0.8" />
                  <stop offset="66%" stopColor="#23A455" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#3DD56D" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="communityRingInner" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#23A455" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#3DD56D" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#2bb757" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              {/* Outer Ring */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#communityRingOuter)"
                strokeWidth="4"
                strokeDasharray="15,8"
                opacity="0.9"
              />
              {/* Inner Ring */}
              <circle
                cx="50"
                cy="50"
                r="35"
                fill="none"
                stroke="url(#communityRingInner)"
                strokeWidth="3"
                strokeDasharray="12,6"
                opacity="0.8"
              />
              {/* Core Ring */}
              <circle
                cx="50"
                cy="50"
                r="25"
                fill="none"
                stroke="#3DD56D"
                strokeWidth="2"
                strokeDasharray="8,4"
                opacity="0.7"
              />
            </svg>
          </motion.div>

          {/* Counter-Rotating Dramatic Ring */}
          <motion.div
            className="absolute top-2 right-2 w-28 h-28 pointer-events-none"
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            style={{
              mixBlendMode: 'screen',
              filter: 'drop-shadow(0 0 15px rgba(43, 183, 87, 0.6))',
            }}
          >
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(61, 213, 109, 0.5)"
                strokeWidth="1.5"
                strokeDasharray="20,10"
                opacity="0.6"
              />
            </svg>
          </motion.div>

          {/* DRAMATIC Enhanced Pulsing Energy Orbs */}
          {[...Array(8)].map((_, i) => {
            const angle = (i * 45) * (Math.PI / 180);
            const radius = 40; // Increased radius for larger ring
            const x = Math.cos(angle) * radius + 56; // Center around the larger ring
            const y = Math.sin(angle) * radius + 56;
            const colors = ['#3DD56D', '#2bb757', '#23A455'];
            const color = colors[i % colors.length];

            return (
              <motion.div
                key={`community-orb-${i}`}
                className="absolute w-3 h-3 rounded-full pointer-events-none"
                style={{
                  top: `${8 + y}px`,
                  right: `${8 + x}px`,
                  background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                  filter: `drop-shadow(0 0 12px ${color}) drop-shadow(0 0 24px ${color})`,
                  mixBlendMode: 'screen',
                }}
                animate={{
                  scale: [1, 2.2, 1],
                  opacity: [0.7, 1, 0.7],
                  boxShadow: [
                    `0 0 15px ${color}`,
                    `0 0 30px ${color}, 0 0 45px ${color}`,
                    `0 0 15px ${color}`
                  ],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.25,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            );
          })}

          {/* Inner Ring of Smaller Dramatic Orbs */}
          {[...Array(6)].map((_, i) => {
            const angle = (i * 60) * (Math.PI / 180);
            const radius = 25;
            const x = Math.cos(angle) * radius + 56;
            const y = Math.sin(angle) * radius + 56;

            return (
              <motion.div
                key={`inner-orb-${i}`}
                className="absolute w-2 h-2 bg-[#3DD56D] rounded-full pointer-events-none"
                style={{
                  top: `${8 + y}px`,
                  right: `${8 + x}px`,
                  filter: 'drop-shadow(0 0 10px rgba(61, 213, 109, 0.9)) drop-shadow(0 0 20px rgba(61, 213, 109, 0.6))',
                  mixBlendMode: 'screen',
                }}
                animate={{
                  scale: [0.8, 2, 0.8],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2.2,
                  delay: i * 0.15 + 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            );
          })}

          {/* Floating Energy Particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`community-particle-${i}`}
              className="absolute w-1 h-1 bg-[#3DD56D] rounded-full pointer-events-none"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${10 + Math.random() * 80}%`,
                filter: 'blur(0.5px) drop-shadow(0 0 4px #3DD56D)',
                mixBlendMode: 'screen',
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, Math.random() * 10 - 5, 0],
                opacity: [0, 1, 0],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* DRAMATIC Energy Wave Ripples */}
          <motion.div
            className="absolute top-2 right-2 w-28 h-28 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(61, 213, 109, 0.3) 0%, rgba(61, 213, 109, 0.1) 50%, transparent 80%)',
              mixBlendMode: 'screen',
              filter: 'blur(1px)',
            }}
            animate={{
              scale: [0.5, 3.5, 0.5],
              opacity: [0.8, 0, 0.8],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />

          {/* Secondary Dramatic Ripple */}
          <motion.div
            className="absolute top-2 right-2 w-28 h-28 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(43, 183, 87, 0.25) 0%, rgba(35, 164, 85, 0.1) 50%, transparent 80%)',
              mixBlendMode: 'overlay',
              filter: 'blur(0.5px)',
            }}
            animate={{
              scale: [0.8, 4, 0.8],
              opacity: [0.7, 0, 0.7],
            }}
            transition={{
              duration: 3.5,
              delay: 1.2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />

          {/* SPECTACULAR Multiple Lightning Bolt Effects */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`lightning-${i}`}
              className="absolute pointer-events-none"
              style={{
                top: `${12 + i * 6}px`,
                right: `${12 + i * 6}px`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 2 + i * 0.3, 0],
                rotate: [0, 25 - i * 10, -25 + i * 10, 0],
              }}
              transition={{
                duration: 0.8,
                delay: 2 + i * 0.15,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeOut",
              }}
            >
              <svg width={24 + i * 4} height={24 + i * 4} viewBox="0 0 24 24" fill="none">
                <path
                  d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                  fill={['#3DD56D', '#2bb757', '#23A455', '#3DD56D'][i]}
                  stroke={['#2bb757', '#23A455', '#3DD56D', '#2bb757'][i]}
                  strokeWidth="2"
                  filter={`drop-shadow(0 0 ${12 + i * 6}px ${['#3DD56D', '#2bb757', '#23A455', '#3DD56D'][i]}) drop-shadow(0 0 ${24 + i * 8}px ${['#3DD56D', '#2bb757', '#23A455', '#3DD56D'][i]})`}
                />
              </svg>
            </motion.div>
          ))}

          {/* Central MEGA Lightning Bolt */}
          <motion.div
            className="absolute top-8 right-8 pointer-events-none"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 3, 0],
              rotate: [0, 360, 0],
            }}
            transition={{
              duration: 1,
              delay: 4,
              repeat: Infinity,
              repeatDelay: 6,
              ease: "easeOut",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                fill="#3DD56D"
                stroke="#2bb757"
                strokeWidth="3"
                filter="drop-shadow(0 0 20px #3DD56D) drop-shadow(0 0 40px #3DD56D) drop-shadow(0 0 60px #3DD56D)"
              />
            </svg>
          </motion.div>

          {/* Lightning Burst Effect */}
          <motion.div
            className="absolute top-6 right-6 w-20 h-20 pointer-events-none"
            initial={{ scale: 0 }}
            animate={{
              scale: [0, 2.5, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 0.5,
              delay: 4.5,
              repeat: Infinity,
              repeatDelay: 6.5,
              ease: "easeOut",
            }}
          >
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30) * (Math.PI / 180);
              const distance = 35;
              const x = Math.cos(angle) * distance;
              const y = Math.sin(angle) * distance;

              return (
                <motion.div
                  key={`burst-${i}`}
                  className="absolute w-1 h-4 bg-[#3DD56D] pointer-events-none"
                  style={{
                    top: `${40 + y}px`,
                    left: `${40 + x}px`,
                    transform: `rotate(${angle * (180 / Math.PI)}deg)`,
                    filter: 'drop-shadow(0 0 8px #3DD56D)',
                    transformOrigin: 'center bottom',
                  }}
                  animate={{
                    scale: [0, 1.5, 0],
                    opacity: [1, 0.5, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.02,
                    ease: "easeOut",
                  }}
                />
              );
            })}
          </motion.div>

          {/* DRAMATIC Enhanced Glowing Corner Accent */}
          <motion.div
            className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(61, 213, 109, 0.5) 0%, rgba(43, 183, 87, 0.3) 50%, transparent 70%)',
              borderRadius: '100% 0 0 0',
              mixBlendMode: 'screen',
              filter: 'drop-shadow(0 0 15px rgba(61, 213, 109, 0.6))',
            }}
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* SPECTACULAR Pulsing Border Effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              border: '3px solid transparent',
              background: 'linear-gradient(135deg, rgba(61, 213, 109, 0.6), rgba(43, 183, 87, 0.5), rgba(35, 164, 85, 0.6)) border-box',
              mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
              maskComposite: 'subtract',
              filter: 'drop-shadow(0 0 10px rgba(61, 213, 109, 0.4))',
            }}
            animate={{
              opacity: [0.4, 0.9, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Energy Pulse Waves */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: 'linear-gradient(45deg, transparent 0%, rgba(61, 213, 109, 0.1) 50%, transparent 100%)',
              mixBlendMode: 'screen',
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Corner Energy Burst */}
          <motion.div
            className="absolute top-0 left-0 w-8 h-8 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(61, 213, 109, 0.4) 0%, transparent 70%)',
              mixBlendMode: 'screen',
            }}
            animate={{
              scale: [0, 2, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 3,
              delay: 1,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8 h-full flex flex-col">
        {/* Enhanced Icon Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            {/* Icon with enhanced styling */}
            <motion.div
              className={`
                relative w-16 h-16 rounded-2xl flex items-center justify-center
                ${solution.iconBg || (isDark ? 'bg-gray-100/20' : 'bg-gray-100/60')} ${solution.hoverIconBg || ''}
                backdrop-blur-sm shadow-lg transition-all duration-300
                ${isDark ? 'border border-white/10' : 'border border-gray-200/50'}
              `}
              whileHover={!shouldReduceAnimations ? {
                scale: 1.1,
                rotate: 5,
              } : {}}
              style={{
                filter: `drop-shadow(0 4px 12px ${solution.iconColor || '#3DD56D'}20)`,
              }}
            >
              {solution.icon && (
                <solution.icon
                  className={`w-8 h-8 ${solution.iconColor || solution.accentColor}`}
                />
              )}

              {/* Animated ring around icon */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-transparent"
                style={{
                  background: `linear-gradient(135deg, ${solution.iconColor || solution.accentColor}40, transparent) border-box`,
                  mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                  maskComposite: 'subtract',
                }}
                animate={!shouldReduceAnimations ? {
                  rotate: 360,
                } : {}}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </motion.div>

            {/* Enhanced Floating indicator */}
            {isCommunityCard ? (
              <motion.div
                className="relative w-4 h-4"
                animate={!prefersReducedMotion ? {
                  rotate: 360,
                } : {}}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <motion.div
                  className={`w-4 h-4 rounded-full ${solution.bgAccent} shadow-lg`}
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(61, 213, 109, 0.8))',
                  }}
                  animate={!prefersReducedMotion ? {
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 1, 0.7]
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <motion.div
                  className="absolute inset-0 w-4 h-4 rounded-full border-2 border-[#3DD56D]/50"
                  animate={!prefersReducedMotion ? {
                    scale: [1, 2, 1],
                    opacity: [0.8, 0, 0.8]
                  } : {}}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                className={`w-3 h-3 rounded-full ${solution.bgAccent} shadow-lg`}
                animate={!prefersReducedMotion ? {
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 1, 0.6]
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            )}
          </div>
        </div>

        {/* Header */}
        <div className="mb-4">
          <div className="mb-3">
            <h3
              id={`solution-${index}-title`}
              className={`text-xl sm:text-2xl font-bold leading-tight ${
                isDark ? 'text-white' : 'text-hero-title'
              }`}
            >
              {solution.title}
            </h3>

          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {solution.tags.map((tag) => (
              <span
                key={tag}
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  isDark
                    ? 'bg-gray-700/60 text-gray-300 border border-gray-600/50'
                    : 'bg-gray-200/80 text-description-text border border-gray-300/70'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <p className={`text-sm sm:text-base leading-relaxed mb-6 ${
          isDark ? 'text-gray-300' : 'text-description-text'
        }`}>
          {solution.shortDescription}
        </p>

        {/* Features */}
        <FeatureList
          features={solution.features}
          accentColor={solution.accentColor}
          isDark={isDark}
        />

        {/* Stats and CTA */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <StatsDisplay
              stats={solution.stats}
              accentColor={solution.accentColor}
              bgAccent={solution.bgAccent}
              isDark={isDark}
            />
          </div>

          {/* Enhanced Learn More Button for Community Solar Projects */}
          <motion.button
            onClick={handleLearnMore}
            className={`
              group/btn w-full flex items-center justify-center space-x-2
              px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 relative overflow-hidden
              ${isCommunityCard
                ? `bg-gradient-to-r from-[#3DD56D]/20 to-[#2bb757]/20 hover:from-[#3DD56D]/30 hover:to-[#2bb757]/30
                   text-[#3DD56D] border-2 border-[#3DD56D]/40 hover:border-[#3DD56D]/70
                   shadow-lg hover:shadow-[#3DD56D]/20`
                : isDark
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40'
                  : 'bg-gray-900/10 hover:bg-gray-900/20 text-gray-900 border border-gray-900/20 hover:border-gray-900/40'
              }
            `}
            style={isCommunityCard ? {
              filter: 'drop-shadow(0 0 10px rgba(61, 213, 109, 0.3))',
            } : {}}
            whileHover={!shouldReduceAnimations ? {
              scale: isCommunityCard ? 1.05 : 1.02,
              boxShadow: isCommunityCard ? '0 0 20px rgba(61, 213, 109, 0.4)' : undefined
            } : {}}
            whileTap={!shouldReduceAnimations ? { scale: 0.98 } : {}}
            aria-label={`Learn more about ${solution.title}`}
          >
            {/* Animated background for Community Solar Projects */}
            {isCommunityCard && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#3DD56D]/10 to-[#2bb757]/10"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}

            <Play className={`w-4 h-4 group-hover/btn:scale-110 transition-transform relative z-10 ${
              isCommunityCard ? 'drop-shadow-[0_0_4px_rgba(61,213,109,0.6)]' : ''
            }`} />
            <span className="relative z-10">Learn More</span>
            <ArrowRight className={`w-4 h-4 group-hover/btn:translate-x-1 transition-transform relative z-10 ${
              isCommunityCard ? 'drop-shadow-[0_0_4px_rgba(61,213,109,0.6)]' : ''
            }`} />
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
});

IntegratedSolutionCard.displayName = 'IntegratedSolutionCard';

export default IntegratedSolutionCard;
