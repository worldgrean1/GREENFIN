'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

interface MainBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
  variant?: 'energy' | 'minimal' | 'dynamic';
  className?: string;
  greenOverlay?: 'none' | 'light' | 'medium' | 'strong';
}

export function MainBackground({
  intensity = 'medium',
  variant = 'energy',
  className = '',
  greenOverlay = 'medium',
}: MainBackgroundProps) {
  const { isDark, isLight } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Performance settings based on intensity
  const settings = useMemo(() => {
    const baseSettings = {
      low: { particles: 8, patterns: 2, animationSpeed: 0.5 },
      medium: { particles: 12, patterns: 3, animationSpeed: 0.7 },
      high: { particles: 16, patterns: 4, animationSpeed: 1 },
    };
    return baseSettings[intensity];
  }, [intensity]);

  // Generate particle positions
  const particles = useMemo(() => {
    if (!isClient) return [];
    return Array.from({ length: settings.particles }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 4,
    }));
  }, [isClient, settings.particles]);

  // Theme-aware colors
  const colors = useMemo(() => {
    return isDark
      ? {
          primary: '#3DD56D',
          secondary: '#2bb757',
          tertiary: '#23A455',
          background: 'rgba(15, 23, 42, 0.95)',
          gradientStart: 'rgba(15, 23, 42, 0.9)',
          gradientEnd: 'rgba(30, 41, 59, 0.8)',
        }
      : {
          primary: '#3DD56D',
          secondary: '#2bb757',
          tertiary: '#23A455',
          background: 'rgba(248, 250, 252, 0.95)',
          gradientStart: 'rgba(248, 250, 252, 0.9)',
          gradientEnd: 'rgba(241, 245, 249, 0.8)',
        };
  }, [isDark]);

  // Green overlay configurations
  const greenOverlayConfig = useMemo(() => {
    const configs = {
      none: { opacity: 0, radialOpacity: 0 },
      light: { opacity: isDark ? 0.1 : 0.05, radialOpacity: isDark ? 0.08 : 0.04 },
      medium: { opacity: isDark ? 0.2 : 0.12, radialOpacity: isDark ? 0.15 : 0.08 },
      strong: { opacity: isDark ? 0.35 : 0.25, radialOpacity: isDark ? 0.25 : 0.15 },
    };
    return configs[greenOverlay];
  }, [greenOverlay, isDark]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Base Gradient Background - GreenSolutions Style */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? 'linear-gradient(to bottom, rgb(2, 6, 23) 0%, rgb(15, 23, 42) 100%)'
            : 'linear-gradient(to bottom, rgb(248, 250, 252) 0%, rgb(241, 245, 249) 100%)',
        }}
      />

      {/* GreenSolutions-style Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? 'linear-gradient(to left, rgba(34, 197, 94, 0.15) 0%, transparent 70%)'
            : 'linear-gradient(to left, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
        }}
      />

      {/* Green Half-Transparent Color Overlay */}
      {greenOverlay !== 'none' && (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, rgba(61, 213, 109, ${greenOverlayConfig.opacity}) 0%, rgba(34, 197, 94, ${greenOverlayConfig.opacity * 0.7}) 50%, rgba(35, 164, 85, ${greenOverlayConfig.opacity * 0.5}) 100%)`,
            opacity: greenOverlayConfig.opacity > 0 ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
          }}
        />
      )}

      {/* Additional Green Radial Overlay for Center Focus */}
      {greenOverlay !== 'none' && (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at center, rgba(61, 213, 109, ${greenOverlayConfig.radialOpacity}) 0%, rgba(34, 197, 94, ${greenOverlayConfig.radialOpacity * 0.6}) 40%, transparent 70%)`,
            opacity: greenOverlayConfig.radialOpacity > 0 ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
          }}
        />
      )}

      {/* Radial Glow Effects */}
      <div className="absolute inset-0">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{
            background: `radial-gradient(circle, ${colors.secondary} 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* GreenSolutions-style Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
            <svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
              <circle cx="30" cy="30" r="2" fill="${colors.primary}" fill-opacity="0.3"/>
              <circle cx="10" cy="10" r="1" fill="${colors.primary}" fill-opacity="0.2"/>
              <circle cx="50" cy="20" r="1.5" fill="${colors.primary}" fill-opacity="0.25"/>
              <circle cx="20" cy="50" r="1" fill="${colors.primary}" fill-opacity="0.2"/>
              <path d="M0,0 L15,30 L30,0 Z" fill="${colors.primary}" fill-opacity="0.1"/>
              <path d="M30,30 L45,60 L60,30 Z" fill="${colors.primary}" fill-opacity="0.08"/>
            </svg>
          `)}")`,
          backgroundSize: '60px 60px',
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Additional Grid Pattern for Enhanced Detail */}
      <svg
        className="absolute inset-0 w-full h-full opacity-8"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="main-grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke={colors.primary}
              strokeWidth="1"
              opacity="0.2"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#main-grid)" />
      </svg>

      {/* Geometric Patterns */}
      {variant === 'energy' && (
        <svg
          className="absolute inset-0 w-full h-full opacity-15"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.primary} stopOpacity="0.6" />
              <stop offset="50%" stopColor={colors.secondary} stopOpacity="0.4" />
              <stop offset="100%" stopColor={colors.tertiary} stopOpacity="0.2" />
            </linearGradient>
          </defs>
          
          {/* Energy Hexagons */}
          {[...Array(6)].map((_, i) => {
            const x = (i % 3) * 33.33 + 16.67;
            const y = Math.floor(i / 3) * 50 + 25;
            return (
              <motion.polygon
                key={`hex-${i}`}
                points="0,-20 17.32,-10 17.32,10 0,20 -17.32,10 -17.32,-10"
                fill="none"
                stroke="url(#energyGradient)"
                strokeWidth="1.5"
                transform={`translate(${x}%, ${y}%)`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 6,
                  delay: i * 0.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            );
          })}
        </svg>
      )}

      {/* Floating Particles */}
      {!prefersReducedMotion && isClient && (
        <div className="absolute inset-0">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                width: particle.size,
                height: particle.size,
                backgroundColor: colors.primary,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                opacity: 0.4,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.sin(particle.id) * 20, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}

      {/* Energy Waves */}
      {variant === 'energy' && !prefersReducedMotion && (
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.primary} stopOpacity="0" />
              <stop offset="50%" stopColor={colors.primary} stopOpacity="0.8" />
              <stop offset="100%" stopColor={colors.primary} stopOpacity="0" />
            </linearGradient>
          </defs>

          {[...Array(3)].map((_, i) => (
            <motion.path
              key={`wave-${i}`}
              d={`M0,${50 + i * 15} Q25,${35 + i * 15} 50,${50 + i * 15} T100,${50 + i * 15}`}
              fill="none"
              stroke="url(#waveGradient)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 0] }}
              transition={{
                duration: 4,
                delay: i * 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </svg>
      )}

      {/* Central Energy Core */}
      {variant === 'energy' && !prefersReducedMotion && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="relative"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div
              className="w-32 h-32 rounded-full blur-2xl"
              style={{
                background: `radial-gradient(circle, ${colors.primary}40 0%, transparent 70%)`,
              }}
            />
          </motion.div>
        </div>
      )}

      {/* Corner Accent Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top-left corner */}
        <div className="absolute top-0 left-0 w-32 h-32 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 128 128">
            <path
              d="M0,0 L128,0 L0,128 Z"
              fill={colors.primary}
              opacity="0.3"
            />
          </svg>
        </div>

        {/* Bottom-right corner */}
        <div className="absolute bottom-0 right-0 w-32 h-32 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 128 128">
            <path
              d="M128,128 L0,128 L128,0 Z"
              fill={colors.secondary}
              opacity="0.3"
            />
          </svg>
        </div>
      </div>

      {/* Performance optimization layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          willChange: 'transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
      />
    </div>
  );
}
