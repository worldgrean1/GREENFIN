'use client';

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface PremiumEcoBackgroundProps {
  theme?: 'light' | 'dark';
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  type: 'circle' | 'hexagon' | 'triangle';
}

export function PremiumEcoBackground({
  theme = 'dark',
  intensity = 'medium',
  className = '',
}: PremiumEcoBackgroundProps) {
  const [elements, setElements] = useState<FloatingElement[]>([]);
  const prefersReducedMotion = useReducedMotion();

  const elementCount = {
    low: 6,
    medium: 12,
    high: 20,
  }[intensity];

  useEffect(() => {
    if (prefersReducedMotion) return;

    const newElements: FloatingElement[] = Array.from({ length: elementCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 20 + Math.random() * 60,
      duration: 15 + Math.random() * 10,
      delay: Math.random() * 5,
      type: ['circle', 'hexagon', 'triangle'][Math.floor(Math.random() * 3)] as FloatingElement['type'],
    }));

    setElements(newElements);
  }, [elementCount, prefersReducedMotion]);

  const getElementColor = (opacity: number = 0.1) => {
    if (theme === 'light') {
      return `rgba(61, 213, 109, ${opacity})`;
    } else {
      return `rgba(61, 213, 109, ${opacity * 0.8})`;
    }
  };

  const getGradientBackground = () => {
    if (theme === 'light') {
      return `
        radial-gradient(circle at 20% 80%, rgba(61, 213, 109, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(43, 183, 87, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)
      `;
    } else {
      return `
        radial-gradient(circle at 20% 80%, rgba(61, 213, 109, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(43, 183, 87, 0.12) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.08) 0%, transparent 50%)
      `;
    }
  };

  const renderShape = (element: FloatingElement) => {
    const baseProps = {
      width: element.size,
      height: element.size,
    };

    switch (element.type) {
      case 'circle':
        return (
          <div
            {...baseProps}
            className="rounded-full"
            style={{
              background: `radial-gradient(circle, ${getElementColor(0.2)} 0%, ${getElementColor(0.05)} 70%, transparent 100%)`,
              filter: 'blur(1px)',
            }}
          />
        );
      case 'hexagon':
        return (
          <div
            {...baseProps}
            style={{
              background: getElementColor(0.15),
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              filter: 'blur(0.5px)',
            }}
          />
        );
      case 'triangle':
        return (
          <div
            {...baseProps}
            style={{
              background: getElementColor(0.12),
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              filter: 'blur(0.8px)',
            }}
          />
        );
      default:
        return null;
    }
  };

  if (prefersReducedMotion) {
    return (
      <div 
        className={`absolute inset-0 ${className}`}
        style={{ background: getGradientBackground() }}
      />
    );
  }

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Gradient background */}
      <div 
        className="absolute inset-0"
        style={{ background: getGradientBackground() }}
      />

      {/* Animated mesh gradient */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(45deg, ${getElementColor(0.05)} 0%, transparent 50%),
            linear-gradient(-45deg, ${getElementColor(0.03)} 0%, transparent 50%)
          `,
          backgroundSize: '100px 100px',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Floating elements */}
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {renderShape(element)}
        </motion.div>
      ))}

      {/* Energy waves */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`wave-${i}`}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, transparent 40%, ${getElementColor(0.1)} 50%, transparent 60%)`,
            transform: `rotate(${i * 60}deg)`,
          }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            delay: i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
