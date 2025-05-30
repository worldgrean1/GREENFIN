'use client';

import React, { useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  HTMLMotionProps,
} from 'framer-motion';
import type { ReactNode } from 'react';

interface Premium3DCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  depth?: 'subtle' | 'medium' | 'dramatic';
  glowEffect?: boolean;
  hoverScale?: number;
  className?: string;
  delay?: number;
}

export function Premium3DCard({
  children,
  depth = 'medium',
  glowEffect = true,
  hoverScale = 1.02,
  className = '',
  delay = 0,
  ...props
}: Premium3DCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Motion values for mouse position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Transform mouse position to rotation values
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  // Spring animations for smooth movement
  const springConfig = { damping: 20, stiffness: 300 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  // Depth multiplier based on depth prop
  const depthMultiplier = {
    subtle: 0.5,
    medium: 1,
    dramatic: 1.5,
  }[depth];

  // Scale transform
  const scale = useSpring(1, springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;
    
    const maxDistance = Math.max(rect.width, rect.height) / 2;
    
    x.set((mouseX / maxDistance) * 100 * depthMultiplier);
    y.set((mouseY / maxDistance) * 100 * depthMultiplier);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!prefersReducedMotion) {
      scale.set(hoverScale);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!prefersReducedMotion) {
      x.set(0);
      y.set(0);
      scale.set(1);
    }
  };

  const glowStyles = glowEffect && isHovered ? {
    boxShadow: '0 0 30px rgba(61, 213, 109, 0.3), 0 0 60px rgba(61, 213, 109, 0.1)',
    borderColor: 'rgba(61, 213, 109, 0.4)',
  } : {};

  return (
    <motion.div
      ref={ref}
      className={`relative transform-gpu ${className}`}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
        scale,
        rotateX: prefersReducedMotion ? 0 : springRotateX,
        rotateY: prefersReducedMotion ? 0 : springRotateY,
        ...glowStyles,
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.8,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Background glow effect */}
      {glowEffect && isHovered && !prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 rounded-inherit bg-gradient-to-r from-[#3DD56D]/20 to-[#2bb757]/20 blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ zIndex: -1 }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
      
      {/* Subtle inner glow */}
      {glowEffect && isHovered && !prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 rounded-inherit bg-gradient-to-br from-[#3DD56D]/5 to-transparent pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
}
