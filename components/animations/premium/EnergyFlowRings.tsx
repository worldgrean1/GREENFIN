'use client';

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface EnergyFlowRingsProps {
  intensity?: 'low' | 'medium' | 'high';
  theme?: 'light' | 'dark';
  className?: string;
  centerElement?: React.ReactNode;
}

interface Ring {
  id: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

export function EnergyFlowRings({
  intensity = 'medium',
  theme = 'dark',
  className = '',
  centerElement,
}: EnergyFlowRingsProps) {
  const [rings, setRings] = useState<Ring[]>([]);
  const prefersReducedMotion = useReducedMotion();

  const ringCount = {
    low: 3,
    medium: 5,
    high: 7,
  }[intensity];

  useEffect(() => {
    if (prefersReducedMotion) return;

    const newRings: Ring[] = Array.from({ length: ringCount }, (_, i) => ({
      id: i,
      size: 60 + i * 40, // Rings get progressively larger
      delay: i * 0.8, // Staggered animation
      duration: 4 + i * 0.5, // Longer duration for outer rings
      opacity: 0.6 - i * 0.08, // Fade out for outer rings
    }));

    setRings(newRings);
  }, [ringCount, prefersReducedMotion]);

  const getRingColor = () => {
    if (theme === 'light') {
      return 'rgba(61, 213, 109, 0.3)';
    } else {
      return 'rgba(61, 213, 109, 0.4)';
    }
  };

  const getGlowColor = () => {
    if (theme === 'light') {
      return 'rgba(61, 213, 109, 0.2)';
    } else {
      return 'rgba(61, 213, 109, 0.3)';
    }
  };

  if (prefersReducedMotion) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        {centerElement}
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Energy rings */}
      {rings.map((ring) => (
        <motion.div
          key={ring.id}
          className="absolute rounded-full border-2"
          style={{
            width: `${ring.size}%`,
            height: `${ring.size}%`,
            borderColor: getRingColor(),
            boxShadow: `0 0 20px ${getGlowColor()}, inset 0 0 20px ${getGlowColor()}`,
          }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0, ring.opacity, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: ring.duration,
            delay: ring.delay,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.5, 1],
          }}
        />
      ))}

      {/* Pulsing energy bursts */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`burst-${i}`}
          className="absolute rounded-full"
          style={{
            width: '20%',
            height: '20%',
            background: `radial-gradient(circle, ${getRingColor()} 0%, transparent 70%)`,
            filter: 'blur(2px)',
          }}
          animate={{
            scale: [0, 2, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 0.7,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Lightning bolts */}
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={`lightning-${i}`}
          className="absolute"
          style={{
            width: '2px',
            height: '30%',
            background: `linear-gradient(to bottom, ${getRingColor()}, transparent)`,
            transformOrigin: 'bottom center',
            rotate: i * 90,
            filter: 'blur(1px)',
          }}
          animate={{
            scaleY: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 0.3,
            delay: i * 0.1 + 1,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Center element */}
      {centerElement && (
        <motion.div
          className="relative z-10"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {centerElement}
        </motion.div>
      )}

      {/* Floating energy particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: getRingColor(),
            filter: 'blur(0.5px)',
            left: '50%',
            top: '50%',
          }}
          animate={{
            x: [0, Math.cos(i * 45 * Math.PI / 180) * 100],
            y: [0, Math.sin(i * 45 * Math.PI / 180) * 100],
            opacity: [1, 0],
            scale: [1, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 0.1,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
