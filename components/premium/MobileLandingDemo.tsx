'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useEnergySystemStore } from '@/store/energySystemStore';
import { useMobileGestures } from '@/hooks/useMobileGestures';
import { useDesktopMode } from '@/hooks/useDesktopMode';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';
import StaticSwitchNode from '@/components/static-nodes/static-switch-node';
import StaticInverterNode from '@/components/static-nodes/inverter';
import PowerFlowAnimation from '@/components/animations/power-flow-animation';
import { TypingTextAnimation } from '@/components/animations/text/TypingTextAnimation';
import { Zap } from 'lucide-react';
import { playButtonClickSound } from '@/utils/sound';

interface MobileLandingDemoProps {
  className?: string;
}

export default function MobileLandingDemo({
  className = '',
}: MobileLandingDemoProps) {
  const router = useRouter();
  const { isDark, isLight } = useTheme();

  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  const [loadingComplete, setLoadingComplete] = useState(false);

  // Desktop mode control
  const { setDesktopMode } = useDesktopMode();

  // Energy system state
  const {
    inverterActive,
    switchActive,
    animationsPaused,
    setInverterActive,
    setSwitchActive,
    toggleAnimations,
    deactivateFullSystem,
  } = useEnergySystemStore();

  // Animation refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Add a small delay before showing content
      setTimeout(() => {
        setLoadingComplete(true);
      }, 500);
    }, 2500); // 2.5 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  // Mobile gestures for navigation to green page
  useMobileGestures({
    onSwipeUp: () => {
      handleExploreMore();
    },
    enabled: true,
  });

  // Calculate component positions for mobile layout
  const getComponentPositions = () => {
    // Always return positions, even if container ref is not ready
    const containerWidth =
      containerRef.current?.getBoundingClientRect().width || 375; // Default mobile width
    const containerHeight = Math.max(
      800,
      (typeof window !== 'undefined' ? window.innerHeight : 800) - 100
    ); // Increased height for proper spacing

    const centerX = containerWidth / 2;
    const scale = 0.8; // Slightly smaller for mobile

    // Position inverter with proper spacing below the hero section
    const inverterX = centerX;
    const inverterY = 200; // Good space below hero section

    // Position switch with proper spacing from inverter
    const switchX = centerX; // Back to center
    const switchY = containerHeight - 120; // Proper spacing from both inverter and bottom

    // PowerFlow connects them (from inverter center to switch center, more to the right)
    const powerFlowStart = { x: centerX, y: inverterY + 60 };
    const powerFlowEnd = { x: switchX + 35, y: switchY - 60 }; // Moved 35px to the right

    return {
      inverterPosition: { x: inverterX, y: inverterY },
      switchPosition: { x: switchX, y: switchY },
      powerFlowStart,
      powerFlowEnd,
      scale,
      containerWidth,
      containerHeight,
    };
  };

  // Handle inverter activation
  const handleInverterChange = (active: boolean) => {
    setInverterActive(active);
    playButtonClickSound();
  };

  // Handle switch activation - redirect to /green when turned ON
  const handleSwitchChange = (active: boolean) => {
    // If switch is turned ON, redirect to the /green page
    if (active) {
      playButtonClickSound();
      // Navigate to the green page
      router.push('/green');
    } else {
      setSwitchActive(active);
      playButtonClickSound();
    }
  };

  // Handle explore more action
  const handleExploreMore = () => {
    playButtonClickSound();
    router.push('/green');
  };

  // Handle reset
  const handleReset = () => {
    deactivateFullSystem();
    playButtonClickSound();
  };

  // Handle desktop mode switch
  const handleDesktopMode = () => {
    playButtonClickSound();
    setDesktopMode(true);
  };

  return (
    <div
      className={`relative w-full h-full min-h-screen ${
        isDark
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
          : 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50'
      } ${className}`}
    >
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loading-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          >
            <div className="flex flex-col items-center">
              {/* Animated Logo */}
              <motion.div
                className="relative mb-6"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.div
                  className="relative w-20 h-20"
                  animate={{
                    rotate: 360,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
                    scale: {
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                  }}
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#3DD56D]/30 to-[#2bb757]/30 blur-xl animate-pulse" />
                  <Image
                    src="/images/grean-logo-icon.png"
                    alt="GREAN WORLD Logo"
                    width={80}
                    height={80}
                    className="relative z-10 object-contain drop-shadow-2xl"
                  />
                </motion.div>
              </motion.div>

              {/* Company Name */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <h1 className="text-2xl font-bold mb-2">
                  <span className="text-[#3DD56D]">GREAN</span>
                  <span className="text-white ml-1">WORLD</span>
                </h1>
                <p className="text-sm text-gray-400 tracking-wide">
                  ENERGY TECHNOLOGY PLC
                </p>
              </motion.div>

              {/* Loading Animation */}
              <motion.div
                className="mt-8 flex space-x-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-[#3DD56D] rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </motion.div>

              {/* Loading Text */}
              <motion.p
                className="mt-4 text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                Initializing Energy Systems...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(59,130,246,0.05)_49%,rgba(59,130,246,0.05)_51%,transparent_52%)] bg-[length:20px_20px]" />
      </div>

      {/* Main Content - Only show after loading */}
      {loadingComplete && (
        <>
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative z-20 flex justify-center items-center pt-6 pb-2"
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="logo-container relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="logo-glow-effect"></div>
                <div className="relative w-10 h-10">
                  <Image
                    src="/images/grean-logo-icon.png"
                    alt="GREAN WORLD Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
              </motion.div>
              <div>
                <motion.div
                  className="flex flex-col"
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center">
                    <span className="text-[#3DD56D] text-lg font-bold tracking-wide">
                      GREAN
                    </span>
                    <span className="text-lg font-bold text-gray-200 tracking-wide ml-1">
                      WORLD
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 tracking-wide">
                    ENERGY TECHNOLOGY PLC
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div
            ref={containerRef}
            className="relative z-10 flex flex-col items-start justify-start min-h-screen px-6 pt-4"
          >
            {/* Energy System Components */}
            {(() => {
              const positions = getComponentPositions();

              if (!positions) {
                return null;
              }

              return (
                <div className="absolute inset-0 flex items-start justify-center pt-0">
                  <div
                    className="relative"
                    style={{
                      width: positions.containerWidth,
                      height: positions.containerHeight,
                    }}
                  >
                    {/* Power Flow Animation */}
                    <PowerFlowAnimation
                      inverterOn={inverterActive}
                      inverterPosition={positions.powerFlowStart}
                      switchPosition={positions.powerFlowEnd}
                      scale={positions.scale}
                    />

                    {/* Inverter Component */}
                    <div
                      className="absolute"
                      style={{
                        left: `${positions.inverterPosition.x}px`,
                        top: `${positions.inverterPosition.y}px`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10,
                      }}
                    >
                      <StaticInverterNode
                        position={{ x: 0, y: 0 }}
                        inverterOn={inverterActive}
                        onInverterChange={handleInverterChange}
                        scale={positions.scale}
                      />
                    </div>

                    {/* Switch Component */}
                    <div
                      className="absolute"
                      style={{
                        left: `${positions.switchPosition.x}px`,
                        top: `${positions.switchPosition.y}px`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10,
                      }}
                    >
                      <StaticSwitchNode
                        position={{ x: 0, y: 0 }}
                        switchOn={switchActive}
                        onSwitchChange={handleSwitchChange}
                        scale={positions.scale * 1.5}
                      />
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Desktop Hero Section - Mobile Version (Triggered by Inverter) */}
            <AnimatePresence>
              {inverterActive && (
                <motion.div
                  key="mobile-hero-section"
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  className="absolute top-12 left-4 right-4 z-20"
                >
                  <div className="text-center p-4">
                    <motion.h1
                      className="text-lg font-bold tracking-tight text-white mb-2 flex items-center justify-center"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      <TypingTextAnimation
                        text="Intelligent Energy Systems"
                        speed="medium"
                      />
                      <Zap className="w-4 h-4 ml-1 text-green-500" />
                    </motion.h1>

                    <motion.p
                      className="text-xs text-gray-300 leading-relaxed"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      <span className="text-green-400">
                        <TypingTextAnimation
                          text="At GREAN WORLD"
                          speed="medium"
                        />
                      </span>{' '}
                      Energy Technology, we don't just sell solar — we deliver
                      intelligent energy systems built for reliability,
                      efficiency, and a{' '}
                      <span className="text-green-400">
                        sustainable future.
                      </span>
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}
