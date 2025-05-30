'use client';

import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Wifi, Users, Home } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

interface NetworkNode {
  id: string;
  icon: React.ComponentType<any>;
  x: number;
  y: number;
  level: number;
  size: 'sm' | 'md' | 'lg';
}

interface Connection {
  from: string;
  to: string;
}

const NetworkImpactMetrics = memo(() => {
  const { isDark } = useTheme();
  const { shouldReduceAnimations } = usePerformanceMonitor();

  // Define network nodes with mathematically precise positioning for perfect symmetry
  // Moved all symbols to the left by 200px total (2x more) for better positioning
  const nodes: NetworkNode[] = useMemo(() => [
    // Top level (root) - moved significantly left from center
    { id: 'root', icon: Calculator, x: 200, y: 80, level: 0, size: 'lg' },

    // Second level - moved significantly left while maintaining symmetry
    { id: 'left-branch', icon: Wifi, x: 50, y: 180, level: 1, size: 'md' },
    { id: 'right-branch', icon: Wifi, x: 350, y: 180, level: 1, size: 'md' },

    // Third level - moved significantly left while maintaining alignment
    { id: 'left-leaf-1', icon: Users, x: 20, y: 280, level: 2, size: 'sm' },
    { id: 'left-leaf-2', icon: Users, x: 120, y: 280, level: 2, size: 'sm' },
    { id: 'right-leaf-1', icon: Users, x: 280, y: 280, level: 2, size: 'sm' },
    { id: 'right-leaf-2', icon: Users, x: 420, y: 280, level: 2, size: 'sm' },

    // Fourth level - moved significantly left while maintaining vertical alignment
    { id: 'bottom-1', icon: Home, x: 20, y: 380, level: 3, size: 'sm' },
    { id: 'bottom-2', icon: Home, x: 120, y: 380, level: 3, size: 'sm' },
    { id: 'bottom-3', icon: Home, x: 280, y: 380, level: 3, size: 'sm' },
    { id: 'bottom-4', icon: Home, x: 420, y: 380, level: 3, size: 'sm' },
  ], []);

  // Define connections between nodes
  const connections: Connection[] = useMemo(() => [
    // Root to second level
    { from: 'root', to: 'left-branch' },
    { from: 'root', to: 'right-branch' },

    // Second level to third level
    { from: 'left-branch', to: 'left-leaf-1' },
    { from: 'left-branch', to: 'left-leaf-2' },
    { from: 'right-branch', to: 'right-leaf-1' },
    { from: 'right-branch', to: 'right-leaf-2' },

    // Third level to fourth level
    { from: 'left-leaf-1', to: 'bottom-1' },
    { from: 'left-leaf-2', to: 'bottom-2' },
    { from: 'right-leaf-1', to: 'bottom-3' },
    { from: 'right-leaf-2', to: 'bottom-4' },
  ], []);

  // Get node size classes
  const getNodeSize = (size: string) => {
    switch (size) {
      case 'lg': return 'w-20 h-20';
      case 'md': return 'w-16 h-16';
      case 'sm': return 'w-12 h-12';
      default: return 'w-12 h-12';
    }
  };

  // Get icon size classes
  const getIconSize = (size: string) => {
    switch (size) {
      case 'lg': return 'w-10 h-10';
      case 'md': return 'w-8 h-8';
      case 'sm': return 'w-6 h-6';
      default: return 'w-6 h-6';
    }
  };

  // Calculate connection line path
  const getConnectionPath = (from: NetworkNode, to: NetworkNode) => {
    return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  };

  // Find node by ID
  const findNode = (id: string) => nodes.find(node => node.id === id);

  return (
    <div className="w-full max-w-6xl mx-auto py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        {/* Background with deep dark blue gradient matching the image */}
        <div className="relative rounded-3xl overflow-hidden p-8 bg-gradient-to-br from-[#0a1628] via-[#0f1b2e] to-[#0a1628] shadow-2xl border border-slate-700/30">
          {/* SVG Container for the network diagram */}
          <div className="relative w-full h-96">
            <svg
              width="800"
              height="400"
              viewBox="0 0 800 400"
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Connection lines */}
              {connections.map((connection, index) => {
                const fromNode = findNode(connection.from);
                const toNode = findNode(connection.to);

                if (!fromNode || !toNode) return null;

                return (
                  <motion.path
                    key={`${connection.from}-${connection.to}`}
                    d={getConnectionPath(fromNode, toNode)}
                    stroke="#22c55e"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                      pathLength: 1,
                      opacity: 0.8,
                    }}
                    transition={{
                      duration: shouldReduceAnimations ? 0.3 : 1.5,
                      delay: index * 0.1,
                      ease: "easeInOut"
                    }}
                    style={{
                      filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.5))',
                    }}
                  />
                );
              })}
            </svg>

            {/* Network nodes */}
            {nodes.map((node, index) => {
              const IconComponent = node.icon;

              return (
                <motion.div
                  key={node.id}
                  className="absolute"
                  style={{
                    left: `${(node.x / 800) * 100}%`,
                    top: `${(node.y / 400) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: shouldReduceAnimations ? 0.3 : 0.6,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                >
                  <motion.div
                    className={`
                      ${getNodeSize(node.size)}
                      rounded-full
                      bg-gradient-to-br from-green-400 to-green-600
                      flex items-center justify-center
                      relative
                      cursor-pointer
                      shadow-lg
                    `}
                    animate={shouldReduceAnimations ? {} : {
                      boxShadow: [
                        '0 0 30px rgba(34, 197, 94, 0.6)',
                        '0 0 50px rgba(34, 197, 94, 0.8)',
                        '0 0 30px rgba(34, 197, 94, 0.6)',
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Enhanced pulsing ring effect */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-3 border-green-400"
                      animate={shouldReduceAnimations ? {} : {
                        scale: [1, 1.8, 1],
                        opacity: [0.9, 0, 0.9],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                      style={{
                        filter: 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.4))',
                      }}
                    />

                    {/* Secondary ring for more dramatic effect */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-green-300"
                      animate={shouldReduceAnimations ? {} : {
                        scale: [1, 2.2, 1],
                        opacity: [0.6, 0, 0.6],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeOut",
                        delay: 0.5
                      }}
                    />

                    {/* Icon */}
                    <IconComponent
                      className={`${getIconSize(node.size)} text-white`}
                    />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-center mt-8 text-green-400"
          >
            Network Impact Metrics
          </motion.h2>
        </div>
      </motion.div>
    </div>
  );
});

NetworkImpactMetrics.displayName = 'NetworkImpactMetrics';

export default NetworkImpactMetrics;
