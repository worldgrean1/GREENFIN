'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Leaf, Zap, Wind, Sun, Sparkles } from 'lucide-react';

interface EcoEnergyParticlesProps {
  intensity?: 'low' | 'medium' | 'high';
  theme?: 'light' | 'dark';
  className?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  type: 'leaf' | 'energy' | 'wind' | 'sun' | 'sparkle';
  duration: number;
  delay: number;
  opacity: number;
}

export function EcoEnergyParticles({
  intensity = 'medium',
  theme = 'dark',
  className = '',
}: EcoEnergyParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const prefersReducedMotion = useReducedMotion();

  const particleCount = useMemo(() => {
    if (prefersReducedMotion) return 0;
    switch (intensity) {
      case 'low': return 8;
      case 'medium': return 15;
      case 'high': return 25;
      default: return 15;
    }
  }, [intensity, prefersReducedMotion]);

  const particleTypes: Particle['type'][] = ['leaf', 'energy', 'wind', 'sun', 'sparkle'];

  useEffect(() => {
    if (prefersReducedMotion) return;

    const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 12 + Math.random() * 8,
      type: particleTypes[Math.floor(Math.random() * particleTypes.length)],
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 5,
      opacity: 0.1 + Math.random() * 0.3,
    }));

    setParticles(newParticles);
  }, [particleCount, prefersReducedMotion]);

  const getParticleIcon = (type: Particle['type']) => {
    const iconProps = { size: 16, className: "w-full h-full" };
    switch (type) {
      case 'leaf': return <Leaf {...iconProps} />;
      case 'energy': return <Zap {...iconProps} />;
      case 'wind': return <Wind {...iconProps} />;
      case 'sun': return <Sun {...iconProps} />;
      case 'sparkle': return <Sparkles {...iconProps} />;
      default: return <Leaf {...iconProps} />;
    }
  };

  const getParticleColor = (type: Particle['type']) => {
    if (theme === 'light') {
      switch (type) {
        case 'leaf': return '#16a34a';
        case 'energy': return '#3DD56D';
        case 'wind': return '#0ea5e9';
        case 'sun': return '#f59e0b';
        case 'sparkle': return '#8b5cf6';
        default: return '#16a34a';
      }
    } else {
      switch (type) {
        case 'leaf': return '#4ade80';
        case 'energy': return '#3DD56D';
        case 'wind': return '#38bdf8';
        case 'sun': return '#fbbf24';
        case 'sparkle': return '#a78bfa';
        default: return '#4ade80';
      }
    }
  };

  if (prefersReducedMotion) return null;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            color: getParticleColor(particle.type),
            opacity: particle.opacity,
            filter: 'drop-shadow(0 0 4px currentColor)',
          }}
          animate={{
            x: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
            y: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 0.8, 1],
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity * 0.5, particle.opacity],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.33, 0.66, 1],
          }}
        >
          {getParticleIcon(particle.type)}
        </motion.div>
      ))}
    </div>
  );
}
