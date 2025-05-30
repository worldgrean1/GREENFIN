'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CardBorderPowerFlowProps {
  isActive: boolean;
  className?: string;
  children: React.ReactNode;
  borderRadius?: number;
  glowIntensity?: 'low' | 'medium' | 'high' | 'extreme';
  particleCount?: number;
  animationSpeed?: number;
  dramatic?: boolean;
}

export function CardBorderPowerFlow({
  isActive,
  className = '',
  children,
  borderRadius = 16,
  glowIntensity = 'extreme',
  particleCount = 20,
  animationSpeed = 2,
  dramatic = true,
}: CardBorderPowerFlowProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // DRAMATIC Brand-compliant energy colors
  const energyColor = '#3DD56D'; // Primary GREAN color
  const glowColor = dramatic ? 'rgba(61, 213, 109, 1)' : 'rgba(61, 213, 109, 0.8)';
  const secondaryColor = '#2bb757'; // Secondary GREAN color
  const accentColor = '#23A455'; // Accent GREAN color
  const electricBlue = '#00FFFF'; // Electric accent for dramatic effect
  const plasmaWhite = '#FFFFFF'; // Plasma core effect

  // DRAMATIC Glow intensity settings
  const glowSettings = {
    low: { blur: 8, opacity: 0.6, shadowSize: 10 },
    medium: { blur: 12, opacity: 0.8, shadowSize: 15 },
    high: { blur: 16, opacity: 1, shadowSize: 20 },
    extreme: { blur: 25, opacity: 1, shadowSize: 40 },
  };

  const currentGlow = glowSettings[glowIntensity];

  // Calculate perimeter path for the card border
  const getPerimeterPath = (width: number, height: number, radius: number) => {
    const r = Math.min(radius, width / 2, height / 2);
    return `
      M ${r} 0
      L ${width - r} 0
      Q ${width} 0 ${width} ${r}
      L ${width} ${height - r}
      Q ${width} ${height} ${width - r} ${height}
      L ${r} ${height}
      Q 0 ${height} 0 ${height - r}
      L 0 ${r}
      Q 0 0 ${r} 0
      Z
    `;
  };

  // Calculate path length for animation timing
  const getPathLength = (width: number, height: number) => {
    return 2 * (width + height) - 8 * borderRadius;
  };

  useEffect(() => {
    const updateDimensions = () => {
      const element = document.getElementById('power-flow-card');
      if (element) {
        const rect = element.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const pathData = getPerimeterPath(dimensions.width, dimensions.height, borderRadius);
  const pathLength = getPathLength(dimensions.width, dimensions.height);

  return (
    <div
      id="power-flow-card"
      className={`relative overflow-hidden ${className}`}
      style={{ borderRadius: `${borderRadius}px` }}
    >
      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Power flow border animation */}
      {isActive && dimensions.width > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ borderRadius: `${borderRadius}px` }}
          >
            <defs>
              {/* DRAMATIC Power Flow Gradient */}
              <linearGradient id="powerFlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={energyColor} stopOpacity="0" />
                <stop offset="20%" stopColor={electricBlue} stopOpacity="0.8" />
                <stop offset="50%" stopColor={plasmaWhite} stopOpacity="1" />
                <stop offset="80%" stopColor={energyColor} stopOpacity="0.8" />
                <stop offset="100%" stopColor={secondaryColor} stopOpacity="0" />
              </linearGradient>

              {/* DRAMATIC Secondary Gradient */}
              <linearGradient id="secondaryFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={secondaryColor} stopOpacity="0" />
                <stop offset="50%" stopColor={accentColor} stopOpacity="0.6" />
                <stop offset="100%" stopColor={energyColor} stopOpacity="0" />
              </linearGradient>

              {/* EXTREME Glow Filter */}
              <filter id="borderGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation={currentGlow.blur} result="coloredBlur" />
                <feColorMatrix in="coloredBlur" values="0 0 0 0 0.24 0 0 0 0 0.84 0 0 0 0 0.43 0 0 0 1 0" result="greenGlow" />
                <feMerge>
                  <feMergeNode in="greenGlow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* DRAMATIC Particle Glow */}
              <filter id="particleGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                <feColorMatrix in="coloredBlur" values="0 0 0 0 0.24 0 0 0 0 0.84 0 0 0 0 0.43 0 0 0 2 0" result="intenseGlow" />
                <feMerge>
                  <feMergeNode in="intenseGlow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* PLASMA Core Filter */}
              <filter id="plasmaCore" x="-150%" y="-150%" width="400%" height="400%">
                <feGaussianBlur stdDeviation="3" result="coreBlur" />
                <feColorMatrix in="coreBlur" values="1 1 1 0 0 1 1 1 0 0 1 1 1 0 0 0 0 0 3 0" result="plasmaEffect" />
                <feMerge>
                  <feMergeNode in="plasmaEffect" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* ELECTRIC Arc Filter */}
              <filter id="electricArc" x="-200%" y="-200%" width="500%" height="500%">
                <feTurbulence baseFrequency="0.9" numOctaves="4" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
                <feGaussianBlur stdDeviation="1" result="electricBlur" />
                <feColorMatrix values="0 0 0 0 0 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" result="electricColor" />
                <feMerge>
                  <feMergeNode in="electricColor" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* DRAMATIC Base Border Glow - Layer 1 */}
            <motion.path
              d={pathData}
              fill="none"
              stroke={glowColor}
              strokeWidth="3"
              filter="url(#borderGlow)"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0.7, 1, 0],
                strokeWidth: ['3px', '8px', '5px', '8px', '3px']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* DRAMATIC Base Border Glow - Layer 2 */}
            <motion.path
              d={pathData}
              fill="none"
              stroke={energyColor}
              strokeWidth="1"
              filter="url(#borderGlow)"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.8, 1, 0.8, 0],
                strokeWidth: ['1px', '6px', '3px', '6px', '1px']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.3,
              }}
            />

            {/* MAIN DRAMATIC Power Flow Line */}
            <motion.path
              d={pathData}
              fill="none"
              stroke="url(#powerFlowGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${pathLength * 0.15} ${pathLength * 0.85}`}
              initial={{ strokeDashoffset: pathLength }}
              animate={{ strokeDashoffset: -pathLength }}
              transition={{
                duration: animationSpeed,
                repeat: Infinity,
                ease: 'linear',
              }}
              filter="url(#plasmaCore)"
            />

            {/* SECONDARY Power Flow Line */}
            <motion.path
              d={pathData}
              fill="none"
              stroke="url(#secondaryFlow)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${pathLength * 0.08} ${pathLength * 0.92}`}
              initial={{ strokeDashoffset: pathLength }}
              animate={{ strokeDashoffset: -pathLength }}
              transition={{
                duration: animationSpeed * 0.7,
                repeat: Infinity,
                ease: 'linear',
                delay: 0.5,
              }}
              filter="url(#borderGlow)"
            />

            {/* ELECTRIC Arc Effect */}
            <motion.path
              d={pathData}
              fill="none"
              stroke={electricBlue}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${pathLength * 0.05} ${pathLength * 0.95}`}
              initial={{ strokeDashoffset: pathLength }}
              animate={{
                strokeDashoffset: -pathLength,
                opacity: [0, 1, 0, 1, 0]
              }}
              transition={{
                duration: animationSpeed * 0.5,
                repeat: Infinity,
                ease: 'linear',
                delay: 1,
              }}
              filter="url(#electricArc)"
            />

            {/* DRAMATIC Energy Particles - Main Layer */}
            {Array.from({ length: particleCount }).map((_, i) => {
              const particleColor = i % 3 === 0 ? plasmaWhite : i % 3 === 1 ? energyColor : electricBlue;
              const particleSize = dramatic ? (i % 4 === 0 ? 6 : 4) : 3;

              return (
                <motion.circle
                  key={`particle-${i}`}
                  r={particleSize}
                  fill={particleColor}
                  filter="url(#particleGlow)"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 1, 0.8, 1, 0],
                    scale: [0.5, 2, 1, 2, 0.5],
                  }}
                  transition={{
                    duration: animationSpeed * 0.8,
                    repeat: Infinity,
                    delay: i * (animationSpeed / particleCount),
                    ease: 'easeInOut',
                  }}
                >
                  <animateMotion
                    dur={`${animationSpeed * 0.8}s`}
                    repeatCount="indefinite"
                    path={pathData}
                    begin={`${i * (animationSpeed / particleCount)}s`}
                  />
                </motion.circle>
              );
            })}

            {/* DRAMATIC Energy Particles - Secondary Layer */}
            {dramatic && Array.from({ length: Math.floor(particleCount / 2) }).map((_, i) => (
              <motion.circle
                key={`secondary-particle-${i}`}
                r="2"
                fill={accentColor}
                filter="url(#plasmaCore)"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0.8, 0],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: animationSpeed * 1.2,
                  repeat: Infinity,
                  delay: i * (animationSpeed / (particleCount / 2)) + 0.3,
                  ease: 'easeInOut',
                }}
              >
                <animateMotion
                  dur={`${animationSpeed * 1.2}s`}
                  repeatCount="indefinite"
                  path={pathData}
                  begin={`${i * (animationSpeed / (particleCount / 2)) + 0.3}s`}
                />
              </motion.circle>
            ))}

            {/* PLASMA Burst Particles */}
            {dramatic && Array.from({ length: 8 }).map((_, i) => (
              <motion.circle
                key={`plasma-burst-${i}`}
                r="1"
                fill={plasmaWhite}
                filter="url(#electricArc)"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 0, 1, 0],
                  scale: [0.5, 3, 0.5, 3, 0.5],
                }}
                transition={{
                  duration: animationSpeed * 0.4,
                  repeat: Infinity,
                  delay: i * (animationSpeed / 8) + 0.8,
                  ease: 'easeOut',
                }}
              >
                <animateMotion
                  dur={`${animationSpeed * 0.4}s`}
                  repeatCount="indefinite"
                  path={pathData}
                  begin={`${i * (animationSpeed / 8) + 0.8}s`}
                />
              </motion.circle>
            ))}

            {/* DRAMATIC Corner Energy Bursts */}
            {[
              { x: borderRadius, y: borderRadius },
              { x: dimensions.width - borderRadius, y: borderRadius },
              { x: dimensions.width - borderRadius, y: dimensions.height - borderRadius },
              { x: borderRadius, y: dimensions.height - borderRadius },
            ].map((corner, i) => (
              <g key={`corner-group-${i}`}>
                {/* Main Corner Burst */}
                <motion.circle
                  cx={corner.x}
                  cy={corner.y}
                  r="4"
                  fill={plasmaWhite}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0.5, 1, 0],
                    scale: [0, 3, 1, 3, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: 'easeOut',
                  }}
                  filter="url(#plasmaCore)"
                />

                {/* Secondary Corner Ring */}
                <motion.circle
                  cx={corner.x}
                  cy={corner.y}
                  r="6"
                  fill="none"
                  stroke={energyColor}
                  strokeWidth="2"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 0.8, 0],
                    scale: [0, 2, 4],
                    strokeWidth: ['2px', '1px', '0px']
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    delay: i * 0.4 + 0.2,
                    ease: 'easeOut',
                  }}
                  filter="url(#borderGlow)"
                />

                {/* Electric Corner Sparks */}
                {dramatic && Array.from({ length: 4 }).map((_, sparkIndex) => {
                  const angle = (sparkIndex * 90) * (Math.PI / 180);
                  const sparkX = corner.x + Math.cos(angle) * 15;
                  const sparkY = corner.y + Math.sin(angle) * 15;

                  return (
                    <motion.circle
                      key={`spark-${i}-${sparkIndex}`}
                      cx={sparkX}
                      cy={sparkY}
                      r="1"
                      fill={electricBlue}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 2, 0],
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.4 + sparkIndex * 0.1 + 0.5,
                        ease: 'easeOut',
                      }}
                      filter="url(#electricArc)"
                    />
                  );
                })}
              </g>
            ))}
          </svg>

          {/* DRAMATIC Multi-Layer Glow Overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: `${borderRadius}px`,
              boxShadow: `
                0 0 ${currentGlow.shadowSize}px ${glowColor},
                0 0 ${currentGlow.shadowSize * 1.5}px ${energyColor}40,
                0 0 ${currentGlow.shadowSize * 2}px ${secondaryColor}20,
                inset 0 0 ${currentGlow.shadowSize * 0.5}px ${plasmaWhite}10
              `,
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.6, 0.3, 0.6, 0],
              scale: [1, 1.02, 1, 1.02, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* EXTREME Outer Glow Pulse */}
          {dramatic && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: `${borderRadius}px`,
                boxShadow: `
                  0 0 ${currentGlow.shadowSize * 3}px ${energyColor}30,
                  0 0 ${currentGlow.shadowSize * 4}px ${glowColor}20,
                  0 0 ${currentGlow.shadowSize * 5}px ${electricBlue}10
                `,
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.4, 0],
                scale: [0.95, 1.05, 0.95]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
            />
          )}

          {/* PLASMA Field Effect */}
          {dramatic && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: `${borderRadius}px`,
                background: `radial-gradient(ellipse at center, ${plasmaWhite}05 0%, transparent 70%)`,
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.2, 0, 0.2, 0],
                scale: [1, 1.03, 1, 1.03, 1]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default CardBorderPowerFlow;
