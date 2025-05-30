'use client';

import { useState, useEffect, useRef } from 'react';
import { useWindowDimensions } from '@/hooks/useWindowDimensions';
import { useEnergySystemStore } from '@/store/energySystemStore';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useMobileGestures } from '@/hooks/useMobileGestures';
import PremiumHeader from '@/components/premium/PremiumHeader';
import PremiumInteractiveDemo from '@/components/premium/PremiumInteractiveDemo';
import PremiumBackground from '@/components/premium/PremiumBackground';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import '@/styles/animations.css';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { TypingTextAnimation } from '@/components/animations/text/TypingTextAnimation';
import { logError } from '@/utils/error-logging';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDesktopMode } from '@/hooks/useDesktopMode';
import { useTheme } from '@/hooks/useTheme';
import { GreanButton } from '@/components/ui/grean-button';
import { GreanCard } from '@/components/ui/grean-card';

// Official Brand CSS from brand guidelines
const brandCSS = `
  :root {
    --grean-primary: #3dd56d;
    --grean-secondary: #2bb757;
    --grean-accent: #23a455;
  }

  .light body {
    background: linear-gradient(135deg, #fff 0%, #f8fafc 50%, #f1f5f9 100%);
  }

  .dark body {
    background: linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%);
  }
`;

// Dynamically import the mobile component to avoid SSR issues
const MobileLandingDemo = dynamic(
  () => import('@/components/premium/MobileLandingDemo'),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{
          background: 'linear-gradient(135deg, #fff 0%, #f8fafc 50%, #f1f5f9 100%)',
          transition: 'background 0.3s ease-in-out'
        }}
      >
        <div className="text-hero-title text-lg">Loading...</div>
      </div>
    ),
  }
);

// Enhanced dynamic import with better error handling and retry logic
const GreenPage = dynamic(
  () => import('@/app/green/page').catch(error => {
    console.error('Failed to load green page:', error);
    // Return a fallback component instead of throwing
    return {
      default: () => (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
          <div className="text-center p-8">
            <div className="text-red-500 mb-4">⚠️</div>
            <h2 className="text-white text-xl mb-2">Page temporarily unavailable</h2>
            <p className="text-gray-400 mb-4">Please try refreshing the page</p>
            <GreanButton
              onClick={() => window.location.reload()}
              variant="primary"
              size="md"
            >
              Refresh Page
            </GreanButton>
          </div>
        </div>
      )
    };
  }),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#3DD56D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading Green Energy Page...</p>
        </div>
      </div>
    )
  }
);

export default function LandingPage() {
  // Mobile detection and desktop mode preference
  const isMobile = useIsMobile();
  const { isDesktopMode, mounted } = useDesktopMode();
  const { isDark, isLight } = useTheme();

  // Determine if we should show mobile layout
  // Show mobile layout only if: device is mobile AND user hasn't requested desktop mode
  const shouldShowMobileLayout = mounted && isMobile && !isDesktopMode;

  // Local UI state
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [prevBulbState, setPrevBulbState] = useState(false);
  const [animationCompleted, setAnimationCompleted] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(true);
  const [showEnergyAnimation, setShowEnergyAnimation] = useState(false);
  const [powerFlowToEdge, setPowerFlowToEdge] = useState(false);
  const [showGreenPage, setShowGreenPage] = useState(false);
  const [greenPageLoaded, setGreenPageLoaded] = useState(false);
  const [slideOutActive, setSlideOutActive] = useState(false);

  // Desktop loading state
  const [isLoading, setIsLoading] = useState(true);
  const [loadingComplete, setLoadingComplete] = useState(false);

  // Refs for interactive components
  const demoRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Get window dimensions and scroll state
  const { windowHeight, windowWidth, scrolled } = useWindowDimensions();

  // Get energy system state from store
  const {
    inverterActive,
    switchActive,
    showHeroSection,
    showTagSection,
    setInverterActive,
    setSwitchActive,
    booting,
    animationsPaused,
    toggleAnimations,
  } = useEnergySystemStore();

  // Inject official brand CSS
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = brandCSS;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const cardRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    // Component mounted
  }, []);

  // Desktop loading effect
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

  // Initialize keyboard shortcuts
  useKeyboardShortcuts({
    onSpacePress: () => {
      toggleAnimations();
    },
    enabled: true,
  });

  // Initialize mobile gestures for navigation
  useMobileGestures({
    onSwipeLeft: () => {
      if (!switchActive) {
        setSwitchActive(true);
      }
    },
    onSwipeRight: () => {
      if (switchActive) {
        setSwitchActive(false);
      } else if (inverterActive) {
        setInverterActive(false);
      }
    },
    enabled: true,
  });

  // Track previous bulb state for animations
  useEffect(() => {
    setPrevBulbState(inverterActive);
  }, [inverterActive]);

  // Show Green Page in background when inverter is active
  useEffect(() => {
    if (inverterActive) {
      setShowGreenPage(true);
    } else {
      // If the inverter is turned off, reset the slide-out animation
      setSlideOutActive(false);
      setShowGreenPage(false);
    }
  }, [inverterActive]);

  // Cycle through feature buttons when switch is active
  useEffect(() => {
    if (!switchActive) {
      setActiveFeature(null);
      return;
    }

    const features = [
      'solarPower',
      'energyStorage',
      'smartGrids',
      'sustainability',
      'cleanEnergy',
    ];
    let currentIndex = 0;

    const interval = setInterval(() => {
      setActiveFeature(features[currentIndex]);
      currentIndex = (currentIndex + 1) % features.length;
    }, 3000);

    return () => clearInterval(interval);
  }, [switchActive]);

  // Apply global styles
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.innerHTML = `
      /* Custom styles to modify PremiumInteractiveDemo */
      .components-premium-PremiumInteractiveDemo [class*="Power Flow Label"],
      .power-flow-label {
        display: none !important;
      }

      /* Hide scrollbars and ensure full viewport mode */
      html, body {
        overflow: hidden !important;
        height: 100vh !important;
        width: 100vw !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      /* Hide scrollbars for webkit browsers */
      ::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }

      /* Hide scrollbars for Firefox */
      html {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }

      /* Ensure main container fits viewport */
      #__next {
        height: 100vh !important;
        width: 100vw !important;
        overflow: hidden !important;
      }
      `;
      document.head.appendChild(style);

      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);

  useEffect(() => {
    function updateSize() {
      if (cardRef.current) {
        setContainerWidth(cardRef.current.offsetWidth);
        setContainerHeight(cardRef.current.offsetHeight);
      }
      // Always update viewport height
      setViewportHeight(window.innerHeight);
    }

    // Only calculate size after loading is complete
    if (loadingComplete) {
      // Add a small delay to ensure DOM is fully rendered
      const timer = setTimeout(() => {
        updateSize();
      }, 100);

      window.addEventListener('resize', updateSize);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', updateSize);
      };
    }
  }, [loadingComplete]);

  // Add this effect to reset animationCompleted when bulb state changes
  useEffect(() => {
    // Reset animation completion state when bulb is turned off
    if (!inverterActive) {
      setAnimationCompleted(false);
    }
  }, [inverterActive]);

  const router = useRouter();

  // Update switch handler to trigger a normal redirect to the /green page when switch is turned ON
  const handleSwitchChange = (active: boolean) => {
    // If switch is turned ON, redirect to the /green page
    if (active) {
      // Navigate to the green page
      router.push('/green');
    }
  };

  // Enhanced preloading logic with better error handling and deduplication
  useEffect(() => {
    if (inverterActive && !greenPageLoaded) {
      let retryCount = 0;
      const maxRetries = 3;
      const retryDelay = 1000;

      const preloadGreenPage = async (attempt = 1) => {
        try {
          // Use the same import path as the dynamic component to avoid conflicts
          const module = await import('@/app/green/page');
          if (typeof module.default === 'function') {
            setGreenPageLoaded(true);
            console.log('Green page preloaded successfully');
          }
        } catch (error) {
          console.error(`Failed to preload green page (attempt ${attempt}):`, error);

          // Retry for ChunkLoadError
          if (error instanceof Error && error.name === 'ChunkLoadError' && attempt < maxRetries) {
            setTimeout(() => {
              preloadGreenPage(attempt + 1);
            }, retryDelay * attempt);
          } else {
            logError('Failed to preload green page after retries', error as Error);
          }
        }
      };

      // Add a small delay to avoid race conditions with the main dynamic import
      const timeoutId = setTimeout(() => {
        preloadGreenPage();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [inverterActive, greenPageLoaded]);

  // Early return for mobile layout
  if (shouldShowMobileLayout) {
    return <MobileLandingDemo />;
  }

  // Show loading state while determining layout
  if (!mounted) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%)'
            : 'linear-gradient(135deg, #fff 0%, #f8fafc 50%, #f1f5f9 100%)',
          transition: 'background 0.3s ease-in-out'
        }}
      >
        <div className={`text-lg ${isDark ? 'text-white' : 'text-hero-title'}`}>Loading...</div>
      </div>
    );
  }

  // Default desktop layout
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Desktop Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="desktop-loading-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%)'
                : 'linear-gradient(135deg, #fff 0%, #f8fafc 50%, #f1f5f9 100%)',
              transition: 'background 0.3s ease-in-out'
            }}
          >
            <div className="flex flex-col items-center">
              {/* Animated Logo */}
              <motion.div
                className="relative mb-8"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.div
                  className="relative w-32 h-32"
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
                    width={128}
                    height={128}
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
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-none mb-3">
                  <span className="text-[var(--grean-primary)]">GREAN</span>
                  <span className={`ml-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>WORLD</span>
                </h1>
                <p className={`text-xl leading-relaxed tracking-wide ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                  ENERGY TECHNOLOGY PLC
                </p>
              </motion.div>

              {/* Loading Animation */}
              <motion.div
                className="mt-12 flex space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 bg-[#3DD56D] rounded-full"
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
                className={`mt-6 text-lg ${isDark ? 'text-gray-500' : 'text-gray-600'}`}
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

      {/* Premium Background Layer */}
      {loadingComplete && (
        <motion.div
          className="fixed inset-0"
          style={{ zIndex: 5 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: slideOutActive ? 0 : 1 }}
          transition={{ duration: 0.6 }}
        >
          <PremiumBackground />
        </motion.div>
      )}

      {/* Main Content Layer - Only show after loading */}
      {loadingComplete && (
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0 }}
          animate={{
            x: slideOutActive ? '-100%' : '0%',
            opacity: slideOutActive ? 0 : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 80,
            damping: 20,
            duration: 0.8,
          }}
        >
          <header className="w-full fixed top-0 left-0 z-30">
            <PremiumHeader scrolled={false} />
          </header>

          <main
            className={
              inverterActive
                ? 'flex-1 flex flex-col items-center w-full h-full pt-20 pb-4 overflow-hidden'
                : 'flex-1 flex flex-col items-center justify-center w-full overflow-hidden'
            }
            style={
              !inverterActive
                ? {
                    height: viewportHeight > 0 ? `${viewportHeight}px` : '100vh',
                    minHeight: viewportHeight > 0 ? `${viewportHeight}px` : '100vh',
                    paddingTop: '80px', // Account for header
                  }
                : {}
            }
          >
            <motion.div
              layout
              className={`w-full flex flex-col items-center overflow-hidden ${
                !inverterActive ? 'justify-center h-full' : 'h-full'
              }`}
              style={
                !inverterActive
                  ? {
                      paddingTop: '10vh', // Move content down by 10% of viewport height
                    }
                  : {}
              }
            >
              {/* Spacer for smooth transition - Increased for hero section */}
              <motion.div
                layout
                animate={{ height: inverterActive && !booting ? 280 : 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                style={{ width: '100%' }}
              >
                <AnimatePresence>
                  {inverterActive && !booting && (
                    <motion.section
                      key="hero-section"
                      layout
                      className="w-full max-w-4xl mx-auto px-4 sm:px-6 mt-16 pt-12 pb-10 mb-8"
                      initial={{ opacity: 0, y: -100 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -100 }}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                      style={{ position: 'absolute', left: 0, right: 0 }}
                    >
                      <div className="flex flex-col items-center text-center px-4">
                        <h1 className={`text-6xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight mb-2 flex flex-col sm:flex-row items-center justify-center gap-2 ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          <TypingTextAnimation
                            text="Intelligent Energy Systems"
                            speed="medium"
                          />
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`lucide lucide-zap w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 ${
                              isDark ? 'text-green-500' : 'text-[#3DD56D]'
                            }`}
                          >
                            <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
                          </svg>
                        </h1>
                        <p className={`text-xl leading-relaxed max-w-3xl mx-auto mb-2 ${
                          isDark ? 'text-slate-300' : 'text-gray-700'
                        }`}>
                          <span className={`${
                            isDark ? 'text-green-400' : 'text-[#3dd56d]'
                          }`}>
                            <TypingTextAnimation
                              text="At GREAN WORLD"
                              speed="medium"
                            />
                          </span>{' '}
                          Energy Technology, we don't just sell solar — we
                          deliver intelligent energy systems built for
                          reliability, efficiency, and a{' '}
                          <span className={`${
                            isDark ? 'text-green-400' : 'text-[#3dd56d]'
                          }`}>
                            sustainable future.
                          </span>
                        </p>
                      </div>
                    </motion.section>
                  )}
                </AnimatePresence>
              </motion.div>
              <motion.div
                layout
                ref={cardRef}
                className={`w-full max-w-4xl mx-auto p-2 sm:p-4 md:p-6 lg:p-8 flex flex-col items-center ${
                  inverterActive && !booting ? 'mt-20' : 'mt-0'
                } ${
                  !inverterActive ? 'justify-center flex-1' : ''
                }`}
                style={
                  {
                    minHeight: !inverterActive ? 'auto' : (inverterActive ? 320 : 480),
                    height: !inverterActive ? 'auto' : undefined,
                    position: inverterActive ? 'relative' : 'static',
                    width: '100%',
                    maxWidth: '56rem',
                  } as React.CSSProperties
                }
                animate={{
                  y: inverterActive ? 0 : 0,
                  opacity: 1,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                  duration: 0.5,
                }}
              >
                {containerWidth > 0 && containerHeight > 0 && (
                  <PremiumInteractiveDemo
                    showInfoPanel={false}
                    setShowInfoPanel={() => {}}
                    containerWidth={containerWidth}
                    containerHeight={containerHeight}
                    onSwitchChange={handleSwitchChange}
                  />
                )}
              </motion.div>

              {/* Contact GREAN WORLD - Conditional Layout */}
              <div className={`w-full ${
                !inverterActive ? 'flex-1 flex items-center justify-center' : 'mb-4'
              } ${
                inverterActive && !booting ? 'mt-16' : (!inverterActive ? 'mt-0' : 'mt-8')
              }`}>
                {/* When inverter is deactivated: Always show centered full contact card */}
                {!inverterActive && (
                  <div className="flex flex-col items-center justify-center max-w-3xl mx-auto w-full">
                    <GreanCard pattern="dots" gradient className="relative backdrop-blur-sm shadow-xl p-4 overflow-hidden">
                      {/* Background accent elements */}
                      <div className={`absolute -bottom-16 -right-16 w-48 h-48 rounded-full ${
                        isDark ? 'bg-[#3DD56D]/10' : 'bg-[#2bb757]/20'
                      }`}></div>
                      <div className={`absolute -top-16 -left-16 w-32 h-32 rounded-full ${
                        isDark ? 'bg-[#3DD56D]/10' : 'bg-[#2bb757]/20'
                      }`}></div>

                      {/* Section Header */}
                      <h2 className={`text-2xl font-bold leading-tight mb-3 drop-shadow-lg tracking-tight text-center ${
                        isDark
                          ? 'text-transparent bg-clip-text bg-gradient-to-r from-[var(--grean-primary)] to-[var(--grean-secondary)]'
                          : 'text-[var(--grean-secondary)]'
                      }`}>
                        Contact GREAN WORLD
                      </h2>

                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        {/* QR Code Column */}
                        <div className="flex flex-col items-center justify-center mb-2 sm:mb-0">
                          <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3DD56D] to-[#2bb757] rounded-lg blur opacity-40 group-hover:opacity-70 transition duration-1000"></div>
                            <img
                              src="/images/qr-greanworld.png"
                              alt="GREAN WORLD QR Code"
                              className="relative w-24 h-24 rounded-lg shadow-lg group-hover:scale-105 transition-all duration-500"
                              style={{ background: 'white' }}
                            />
                          </div>
                          <span className={`block mt-1 text-xs font-medium tracking-wide ${
                            isDark ? 'text-[#3DD56D]/90' : 'text-[#2bb757]'
                          }`}>
                            <motion.span
                              initial={{ opacity: 0.7 }}
                              animate={{ opacity: 1 }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                repeatType: 'reverse',
                              }}
                            >
                              Scan
                            </motion.span>
                          </span>
                        </div>

                        {/* Contact Information Column */}
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {/* Phone Number */}
                          <motion.div
                            whileHover={{ scale: 1.02, x: 5 }}
                            className={`p-2 rounded-lg border backdrop-blur-sm flex items-center gap-2 transition-all hover:shadow-md ${
                              isDark
                                ? 'border-[#23A455]/30 bg-slate-900/50 hover:border-[#3DD56D]/50'
                                : 'border-[#2bb757]/60 bg-white/80 hover:border-[#23A455]/80'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isDark ? 'bg-[#23A455]/50' : 'bg-[#2bb757]'
                            }`}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`w-4 h-4 ${
                                  isDark ? 'text-[#3DD56D]' : 'text-white'
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                              </svg>
                            </div>
                            <div className="min-w-0">
                              <div className={`text-[10px] font-medium uppercase tracking-wider ${
                                isDark ? 'text-[#3DD56D]/80' : 'text-[#2bb757]'
                              }`}>
                                Phone
                              </div>
                              <div className={`text-sm font-mono font-bold truncate ${
                                isDark ? 'text-white' : 'text-[#2bb757]'
                              }`}>
                                +251 913 330000
                              </div>
                            </div>
                          </motion.div>

                          {/* Email */}
                          <motion.div
                            whileHover={{ scale: 1.02, x: 5 }}
                            className={`p-2 rounded-lg border backdrop-blur-sm flex items-center gap-2 transition-all hover:shadow-md ${
                              isDark
                                ? 'border-[#23A455]/30 bg-slate-900/50 hover:border-[#3DD56D]/50'
                                : 'border-[#2bb757]/60 bg-white/80 hover:border-[#23A455]/80'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isDark ? 'bg-[#23A455]/50' : 'bg-[#2bb757]'
                            }`}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`w-4 h-4 ${
                                  isDark ? 'text-[#3DD56D]' : 'text-white'
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <div className="min-w-0">
                              <div className={`text-[10px] font-medium uppercase tracking-wider ${
                                isDark ? 'text-[#3DD56D]/80' : 'text-[#2bb757]'
                              }`}>
                                Email
                              </div>
                              <div className={`text-sm font-mono font-bold truncate ${
                                isDark ? 'text-white' : 'text-[#2bb757]'
                              }`}>
                                info@greanworld.com
                              </div>
                            </div>
                          </motion.div>

                          {/* Location */}
                          <motion.div
                            whileHover={{ scale: 1.02, x: 5 }}
                            className={`p-2 rounded-lg border backdrop-blur-sm flex items-center gap-2 transition-all hover:shadow-md ${
                              isDark
                                ? 'border-[#23A455]/30 bg-slate-900/50 hover:border-[#3DD56D]/50'
                                : 'border-[#2bb757]/60 bg-white/80 hover:border-[#23A455]/80'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isDark ? 'bg-[#23A455]/50' : 'bg-[#2bb757]'
                            }`}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`w-4 h-4 ${
                                  isDark ? 'text-[#3DD56D]' : 'text-white'
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            </div>
                            <div className="min-w-0">
                              <div className={`text-[10px] font-medium uppercase tracking-wider ${
                                isDark ? 'text-[#3DD56D]/80' : 'text-[#2bb757]'
                              }`}>
                                Address
                              </div>
                              <div className={`text-sm font-medium truncate ${
                                isDark ? 'text-white' : 'text-[#2bb757]'
                              }`}>
                                Addis Ababa, Ethiopia
                              </div>
                            </div>
                          </motion.div>

                          {/* Social Media Links */}
                          <div className="flex items-center justify-around sm:justify-start sm:space-x-3 p-2">
                            <motion.a
                              href="#"
                              whileHover={{ scale: 1.2, rotate: 5 }}
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                                isDark
                                  ? 'bg-[#23A455]/30 hover:bg-[#23A455]/50'
                                  : 'bg-[#2bb757]/80 hover:bg-[#23A455]'
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                fill="currentColor"
                                className={`${
                                  isDark ? 'text-[#3DD56D]' : 'text-white'
                                }`}
                                viewBox="0 0 16 16"
                              >
                                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                              </svg>
                            </motion.a>
                            <motion.a
                              href="#"
                              whileHover={{ scale: 1.2, rotate: 5 }}
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                                isDark
                                  ? 'bg-[#23A455]/30 hover:bg-[#23A455]/50'
                                  : 'bg-[#2bb757]/80 hover:bg-[#23A455]'
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                fill="currentColor"
                                className={`${
                                  isDark ? 'text-[#3DD56D]' : 'text-white'
                                }`}
                                viewBox="0 0 16 16"
                              >
                                <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                              </svg>
                            </motion.a>
                            <motion.a
                              href="#"
                              whileHover={{ scale: 1.2, rotate: 5 }}
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                                isDark
                                  ? 'bg-[#23A455]/30 hover:bg-[#23A455]/50'
                                  : 'bg-[#2bb757]/80 hover:bg-[#23A455]'
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                fill="currentColor"
                                className={`${
                                  isDark ? 'text-[#3DD56D]' : 'text-white'
                                }`}
                                viewBox="0 0 16 16"
                              >
                                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
                              </svg>
                            </motion.a>
                            <motion.a
                              href="#"
                              whileHover={{ scale: 1.2, rotate: 5 }}
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                                isDark
                                  ? 'bg-[#23A455]/30 hover:bg-[#23A455]/50'
                                  : 'bg-[#2bb757]/80 hover:bg-[#23A455]'
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                fill="currentColor"
                                className={`${
                                  isDark ? 'text-[#3DD56D]' : 'text-white'
                                }`}
                                viewBox="0 0 16 16"
                              >
                                <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                              </svg>
                            </motion.a>
                          </div>
                        </div>
                      </div>
                    </GreanCard>
                  </div>
                )}

                {/* When inverter is activated: Responsive layout based on screen size */}
                {inverterActive && (
                  <>
                    {/* Mobile (xs-sm): QR code only, centered */}
                    <div className="flex sm:hidden flex-col items-center justify-center max-w-xs mx-auto">
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3DD56D] to-[#2bb757] rounded-lg blur opacity-40 group-hover:opacity-70 transition duration-1000"></div>
                        <img
                          src="/images/qr-greanworld.png"
                          alt="GREAN WORLD QR Code"
                          className="relative w-16 h-16 rounded-lg shadow-lg group-hover:scale-105 transition-all duration-500"
                          style={{ background: 'white' }}
                        />
                      </div>
                      <span className={`block mt-1 text-xs font-medium tracking-wide ${
                        isDark ? 'text-[#3DD56D]/90' : 'text-[#2bb757]'
                      }`}>
                        <motion.span
                          initial={{ opacity: 0.7 }}
                          animate={{ opacity: 1 }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatType: 'reverse',
                          }}
                        >
                          Scan
                        </motion.span>
                      </span>
                    </div>

                    {/* Small-Medium screens (sm-lg): Vertical card on right side */}
                    <div className="hidden sm:flex lg:hidden justify-end">
                      <div className="fixed right-2 top-1/2 transform -translate-y-1/2 z-20">
                        <GreanCard pattern="dots" gradient className="relative backdrop-blur-sm shadow-xl p-3 overflow-hidden w-48 max-h-[80vh] overflow-y-auto">
                          {/* Vertical contact card content - same as before */}
                          <h3 className={`text-sm font-bold leading-tight mb-3 drop-shadow-lg tracking-tight text-center ${
                            isDark
                              ? 'text-transparent bg-clip-text bg-gradient-to-r from-[var(--grean-primary)] to-[var(--grean-secondary)]'
                              : 'text-[var(--grean-secondary)]'
                          }`}>
                            Contact GREAN WORLD
                          </h3>
                          {/* QR and contact info in vertical layout */}
                          <div className="flex flex-col items-center space-y-3">
                            <div className="flex flex-col items-center justify-center">
                              <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3DD56D] to-[#2bb757] rounded-lg blur opacity-40 group-hover:opacity-70 transition duration-1000"></div>
                                <img
                                  src="/images/qr-greanworld.png"
                                  alt="GREAN WORLD QR Code"
                                  className="relative w-16 h-16 rounded-lg shadow-lg group-hover:scale-105 transition-all duration-500"
                                  style={{ background: 'white' }}
                                />
                              </div>
                              <span className={`block mt-1 text-xs font-medium tracking-wide ${
                                isDark ? 'text-[#3DD56D]/90' : 'text-[#2bb757]'
                              }`}>
                                <motion.span
                                  initial={{ opacity: 0.7 }}
                                  animate={{ opacity: 1 }}
                                  transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    repeatType: 'reverse',
                                  }}
                                >
                                  Scan
                                </motion.span>
                              </span>
                            </div>
                            {/* Compact contact info */}
                            <div className="w-full space-y-2 text-xs">
                              <div className="text-center">
                                <div className={`font-bold ${isDark ? 'text-white' : 'text-[#2bb757]'}`}>
                                  +251 913 330000
                                </div>
                                <div className={`font-bold ${isDark ? 'text-white' : 'text-[#2bb757]'}`}>
                                  info@greanworld.com
                                </div>
                                <div className={`font-medium ${isDark ? 'text-white' : 'text-[#2bb757]'}`}>
                                  Addis Ababa, Ethiopia
                                </div>
                              </div>
                            </div>
                          </div>
                        </GreanCard>
                      </div>
                    </div>

                    {/* Large screens: Full contact card (horizontal layout) */}
                    <div className="hidden lg:block max-w-3xl mx-auto">
                      <GreanCard pattern="dots" gradient className="relative backdrop-blur-sm shadow-xl p-4 overflow-hidden">
                    {/* Background accent elements */}
                    <div className={`absolute -bottom-16 -right-16 w-48 h-48 rounded-full ${
                      isDark ? 'bg-[#3DD56D]/10' : 'bg-[#2bb757]/20'
                    }`}></div>
                    <div className={`absolute -top-16 -left-16 w-32 h-32 rounded-full ${
                      isDark ? 'bg-[#3DD56D]/10' : 'bg-[#2bb757]/20'
                    }`}></div>

                    {/* Section Header */}
                    <h2 className={`text-2xl font-bold leading-tight mb-3 drop-shadow-lg tracking-tight text-center ${
                      isDark
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-[var(--grean-primary)] to-[var(--grean-secondary)]'
                        : 'text-[var(--grean-secondary)]'
                    }`}>
                      Contact GREAN WORLD
                    </h2>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* QR Code Column */}
                      <div className="flex flex-col items-center justify-center mb-2 sm:mb-0">
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3DD56D] to-[#2bb757] rounded-lg blur opacity-40 group-hover:opacity-70 transition duration-1000"></div>
                          <img
                            src="/images/qr-greanworld.png"
                            alt="GREAN WORLD QR Code"
                            className="relative w-24 h-24 rounded-lg shadow-lg group-hover:scale-105 transition-all duration-500"
                            style={{ background: 'white' }}
                          />
                        </div>
                        <span className={`block mt-1 text-xs font-medium tracking-wide ${
                          isDark ? 'text-[#3DD56D]/90' : 'text-[#2bb757]'
                        }`}>
                          <motion.span
                            initial={{ opacity: 0.7 }}
                            animate={{ opacity: 1 }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              repeatType: 'reverse',
                            }}
                          >
                            Scan
                          </motion.span>
                        </span>
                      </div>

                      {/* Contact Information Column - Desktop only */}
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* Phone Number */}
                        <motion.div
                          whileHover={{ scale: 1.02, x: 5 }}
                          className={`p-2 rounded-lg border backdrop-blur-sm flex items-center gap-2 transition-all hover:shadow-md ${
                            isDark
                              ? 'border-[#23A455]/30 bg-slate-900/50 hover:border-[#3DD56D]/50'
                              : 'border-[#2bb757]/60 bg-white/80 hover:border-[#23A455]/80'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isDark ? 'bg-[#23A455]/50' : 'bg-[#2bb757]'
                          }`}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`w-4 h-4 ${
                                isDark ? 'text-[#3DD56D]' : 'text-white'
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <div className={`text-[10px] font-medium uppercase tracking-wider ${
                              isDark ? 'text-[#3DD56D]/80' : 'text-[#2bb757]'
                            }`}>
                              Phone
                            </div>
                            <div className={`text-sm font-mono font-bold truncate ${
                              isDark ? 'text-white' : 'text-[#2bb757]'
                            }`}>
                              +251 913 330000
                            </div>
                          </div>
                        </motion.div>

                        {/* Email */}
                        <motion.div
                          whileHover={{ scale: 1.02, x: 5 }}
                          className={`p-2 rounded-lg border backdrop-blur-sm flex items-center gap-2 transition-all hover:shadow-md ${
                            isDark
                              ? 'border-[#23A455]/30 bg-slate-900/50 hover:border-[#3DD56D]/50'
                              : 'border-[#2bb757]/60 bg-white/80 hover:border-[#23A455]/80'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isDark ? 'bg-[#23A455]/50' : 'bg-[#2bb757]'
                          }`}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`w-4 h-4 ${
                                isDark ? 'text-[#3DD56D]' : 'text-white'
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <div className={`text-[10px] font-medium uppercase tracking-wider ${
                              isDark ? 'text-[#3DD56D]/80' : 'text-[#2bb757]'
                            }`}>
                              Email
                            </div>
                            <div className={`text-sm font-mono font-bold truncate ${
                              isDark ? 'text-white' : 'text-[#2bb757]'
                            }`}>
                              info@greanworld.com
                            </div>
                          </div>
                        </motion.div>

                        {/* Location */}
                        <motion.div
                          whileHover={{ scale: 1.02, x: 5 }}
                          className={`p-2 rounded-lg border backdrop-blur-sm flex items-center gap-2 transition-all hover:shadow-md ${
                            isDark
                              ? 'border-[#23A455]/30 bg-slate-900/50 hover:border-[#3DD56D]/50'
                              : 'border-[#2bb757]/60 bg-white/80 hover:border-[#23A455]/80'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isDark ? 'bg-[#23A455]/50' : 'bg-[#2bb757]'
                          }`}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`w-4 h-4 ${
                                isDark ? 'text-[#3DD56D]' : 'text-white'
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <div className={`text-[10px] font-medium uppercase tracking-wider ${
                              isDark ? 'text-[#3DD56D]/80' : 'text-[#2bb757]'
                            }`}>
                              Address
                            </div>
                            <div className={`text-sm font-medium truncate ${
                              isDark ? 'text-white' : 'text-[#2bb757]'
                            }`}>
                              Addis Ababa, Ethiopia
                            </div>
                          </div>
                        </motion.div>

                        {/* Social Media Links */}
                        <div className="flex items-center justify-around sm:justify-start sm:space-x-3 p-2">
                          <motion.a
                            href="#"
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                              isDark
                                ? 'bg-[#23A455]/30 hover:bg-[#23A455]/50'
                                : 'bg-[#2bb757]/80 hover:bg-[#23A455]'
                            }`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              fill="currentColor"
                              className={`${
                                isDark ? 'text-[#3DD56D]' : 'text-white'
                              }`}
                              viewBox="0 0 16 16"
                            >
                              <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                            </svg>
                          </motion.a>
                          <motion.a
                            href="#"
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                              isDark
                                ? 'bg-[#23A455]/30 hover:bg-[#23A455]/50'
                                : 'bg-[#2bb757]/80 hover:bg-[#23A455]'
                            }`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              fill="currentColor"
                              className={`${
                                isDark ? 'text-[#3DD56D]' : 'text-white'
                              }`}
                              viewBox="0 0 16 16"
                            >
                              <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                            </svg>
                          </motion.a>
                          <motion.a
                            href="#"
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                              isDark
                                ? 'bg-[#23A455]/30 hover:bg-[#23A455]/50'
                                : 'bg-[#2bb757]/80 hover:bg-[#23A455]'
                            }`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              fill="currentColor"
                              className={`${
                                isDark ? 'text-[#3DD56D]' : 'text-white'
                              }`}
                              viewBox="0 0 16 16"
                            >
                              <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
                            </svg>
                          </motion.a>
                          <motion.a
                            href="#"
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                              isDark
                                ? 'bg-[#23A455]/30 hover:bg-[#23A455]/50'
                                : 'bg-[#2bb757]/80 hover:bg-[#23A455]'
                            }`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              fill="currentColor"
                              className={`${
                                isDark ? 'text-[#3DD56D]' : 'text-white'
                              }`}
                              viewBox="0 0 16 16"
                            >
                              <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                            </svg>
                          </motion.a>
                        </div>
                      </div>
                    </div>
                      </GreanCard>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </main>
        </motion.div>
      )}
    </div>
  );
}
