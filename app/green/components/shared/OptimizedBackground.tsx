'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { useTheme } from '@/hooks/useTheme';

// Centralized pattern definitions for better performance
const PATTERNS = {
  triangle: {
    svg: `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,0 L20,40 L40,0 Z" fill="#3DD56D" fill-opacity="0.08"/>
    </svg>`,
    size: '40px 40px',
  },
  triangleSmall: {
    svg: `<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,0 L12,24 L24,0 Z" fill="#3DD56D" fill-opacity="0.08"/>
    </svg>`,
    size: '24px 24px',
  },
  triangleCard: {
    svg: `<svg width="30" height="30" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,0 L15,30 L30,0 Z" fill="#3DD56D" fill-opacity="0.05"/>
    </svg>`,
    size: '30px 30px',
  },
  wave: {
    svg: `<svg width="100" height="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,10 C30,15 70,5 100,10" fill="none" stroke="#3DD56D" stroke-opacity="0.1" stroke-width="1"/>
    </svg>`,
    size: '100px 20px',
  },
  dots: {
    svg: `<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="2" fill="#3DD56D" fill-opacity="0.1"/>
      <circle cx="10" cy="10" r="1" fill="#3DD56D" fill-opacity="0.08"/>
      <circle cx="50" cy="20" r="1.5" fill="#3DD56D" fill-opacity="0.09"/>
    </svg>`,
    size: '60px 60px',
  },
} as const;

// Pattern cache for performance optimization
const patternCache = new Map<string, string>();

// Memoized pattern generation with caching
const getPatternDataUri = (patternType: keyof typeof PATTERNS): string => {
  if (patternCache.has(patternType)) {
    return patternCache.get(patternType)!;
  }

  const pattern = PATTERNS[patternType];
  const dataUri = `url("data:image/svg+xml,${encodeURIComponent(pattern.svg)}")`;
  patternCache.set(patternType, dataUri);
  return dataUri;
};

// Using consolidated performance monitoring hook from shared location

interface OptimizedBackgroundProps {
  children: ReactNode;
  withGradient?: boolean;
  className?: string;
  id?: string;
  noSeam?: boolean;
  patternType?: keyof typeof PATTERNS;
  variant?: 'light' | 'dark' | 'auto';
}

export function OptimizedBackground({
  children,
  withGradient = true,
  className = '',
  id,
  noSeam = false,
  patternType = 'triangle',
  variant = 'auto',
}: OptimizedBackgroundProps) {
  const { isLowPerformance } = usePerformanceMonitor();
  const { isDark } = useTheme();
  const pattern = PATTERNS[patternType];

  // Auto-detect theme if variant is 'auto'
  const effectiveVariant = variant === 'auto' ? (isDark ? 'dark' : 'light') : variant;

  // Background styles with optimizations
  const backgroundStyle = useMemo<CSSProperties>(
    () => ({
      background:
        effectiveVariant === 'light'
          ? 'linear-gradient(to bottom right, #ffffff, rgba(240, 253, 244, 0.6))'
          : 'linear-gradient(to bottom right, #0a0d19, #111827)',
      position: 'relative',
      willChange: 'transform, opacity',
      transform: 'translateZ(0)',
      backfaceVisibility: 'hidden',
      perspective: '1000px',
      borderTop: noSeam ? 'none' : '1px solid rgba(61, 213, 109, 0.15)',
    }),
    [noSeam, effectiveVariant]
  );

  // Pattern background style with performance optimization
  const patternStyle = useMemo<CSSProperties>(
    () => ({
      position: 'absolute',
      inset: 0,
      opacity: isLowPerformance ? 0.08 : 0.15,
      pointerEvents: 'none',
      backgroundImage: getPatternDataUri(patternType),
      backgroundSize: pattern.size,
      backgroundRepeat: 'repeat',
      zIndex: 0,
      willChange: 'opacity, transform',
      transform: 'translateZ(0)',
      backfaceVisibility: 'hidden',
    }),
    [patternType, pattern.size, isLowPerformance]
  );

  // Gradient overlay style with theme support
  const gradientOverlayStyle = useMemo<CSSProperties>(
    () => ({
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: '50%',
      background:
        effectiveVariant === 'light'
          ? 'linear-gradient(to left, rgba(61, 213, 109, 0.08), transparent)'
          : 'linear-gradient(to left, rgba(61, 213, 109, 0.6), transparent)',
      zIndex: 0,
      pointerEvents: 'none',
      transform: 'translateZ(0)',
      backfaceVisibility: 'hidden',
      willChange: 'opacity, transform',
    }),
    [effectiveVariant]
  );

  // Connection style
  const connectionStyle = useMemo<CSSProperties>(
    () => ({
      position: 'absolute',
      top: 0,
      left: '50%',
      width: '60%',
      height: '2px',
      transform: 'translateX(-50%) translateZ(0)',
      background:
        'linear-gradient(to right, transparent, rgba(61, 213, 109, 0.2), transparent)',
      zIndex: 5,
      backfaceVisibility: 'hidden',
      willChange: 'transform',
    }),
    []
  );

  return (
    <section
      id={id}
      className={`relative w-full ${className}`}
      style={backgroundStyle}
    >
      {/* Pattern overlay - always show with reduced opacity if low performance */}
      <div style={patternStyle} />

      {/* Gradient overlay */}
      {withGradient && (
        <div style={gradientOverlayStyle} className="lg:w-1/2 w-2/3" />
      )}

      {/* Connection point */}
      {!noSeam && <div style={connectionStyle} />}

      {children}
    </section>
  );
}

// Export pattern utilities for card usage
export const getCardPatternStyle = (
  patternType: keyof typeof PATTERNS = 'triangleCard'
): CSSProperties => ({
  backgroundImage: getPatternDataUri(patternType),
  backgroundSize: PATTERNS[patternType].size,
  backgroundRepeat: 'repeat',
  opacity: 0.1,
  position: 'absolute',
  inset: 0,
  zIndex: 0,
  pointerEvents: 'none',
  transform: 'translateZ(0)',
  backfaceVisibility: 'hidden',
  willChange: 'opacity, transform',
});

// Export for external usage
export { getPatternDataUri, PATTERNS };

// Legacy exports for backward compatibility
export const cardBackgroundPattern = getPatternDataUri('triangleCard');
export const cardPatternStyle: CSSProperties =
  getCardPatternStyle('triangleCard');
