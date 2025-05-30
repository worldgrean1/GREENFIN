'use client';

import React, { useEffect, useState, useRef } from 'react';
import { NavigationMenu } from '@/components/shared/navigation/NavigationMenu';
import { Logo } from '@/components/shared/navigation/Logo';
import GreenIntro from './components/sections/GreenIntro';
import GreenHome from './components/sections/GreenHome';
import GreenFooter from './components/sections/GreenFooter';
import { OptimizedLoadingScreen } from './components/shared/OptimizedLoadingScreen';
import { motion } from 'framer-motion';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { useTheme } from '@/hooks/useTheme';
import { LEDTextDisplay } from '@/components/ui/LEDTextDisplay';

/**
 * ScrollProgressBar Component
 * Displays a progress bar at the top of the page that fills based on scroll position
 */
const ScrollProgressBar = () => {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      setScroll(totalHeight > 0 ? scrollPosition / totalHeight : 0);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-2 z-[100]"
      initial={{ width: 0 }}
      animate={{ width: `${scroll * 100}%` }}
      style={{
        background: 'linear-gradient(90deg, #3DD56D 0%, #2bb757 100%)',
        boxShadow: '0 0 8px 2px #3DD56D55',
        pointerEvents: 'none',
      }}
    />
  );
};

/**
 * Optimized ScrollProgressBar with performance monitoring
 */
const OptimizedScrollProgressBar = () => {
  const [scroll, setScroll] = useState(0);
  const { shouldReduceAnimations } = usePerformanceMonitor();

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const totalHeight = document.body.scrollHeight - window.innerHeight;
          const scrollPosition = window.scrollY;
          setScroll(totalHeight > 0 ? scrollPosition / totalHeight : 0);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (shouldReduceAnimations) {
    return (
      <div
        className="fixed top-0 left-0 right-0 h-1 z-[100] bg-[#3DD56D]"
        style={{ width: `${scroll * 100}%` }}
      />
    );
  }

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-2 z-[100]"
      initial={{ width: 0 }}
      animate={{ width: `${scroll * 100}%` }}
      style={{
        background: 'linear-gradient(90deg, #3DD56D 0%, #2bb757 100%)',
        boxShadow: '0 0 8px 2px #3DD56D55',
        pointerEvents: 'none',
      }}
    />
  );
};

// Enhanced lazy loading with robust error handling and retry mechanisms
interface RobustLazyComponentProps {
  importFn: () => Promise<any>;
  fallback?: React.ReactNode;
  rootMargin?: string;
  priority?: 'low' | 'medium' | 'high';
  maxRetries?: number;
  retryDelay?: number;
}

const RobustLazyComponent: React.FC<RobustLazyComponentProps> = ({
  importFn,
  fallback,
  rootMargin = '100px',
  priority = 'medium',
  maxRetries = 3,
  retryDelay = 1000
}) => {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { isLowPerformance } = usePerformanceMonitor();

  // Adjust loading strategy based on performance
  const adjustedRootMargin = isLowPerformance ? '50px' : rootMargin;
  const shouldPreload = priority === 'high' && !isLowPerformance;

  const loadComponent = async (attempt = 1) => {
    try {
      setIsLoading(true);
      setError(null);

      const module = await importFn();
      const ComponentToRender = module.default || module;

      if (ComponentToRender) {
        setComponent(() => ComponentToRender);
      } else {
        throw new Error('No component found in module');
      }
    } catch (err: any) {
      console.error(`Failed to load component (attempt ${attempt}):`, err);

      if (err.name === 'ChunkLoadError' && attempt < maxRetries) {
        // Retry after delay for chunk loading errors
        setTimeout(() => {
          setRetryCount(attempt);
          loadComponent(attempt + 1);
        }, retryDelay * attempt);
      } else {
        // Final fallback - show error state
        setError(err.message || 'Failed to load component');
        setComponent(() => () => (
          <div className="w-full min-h-[200px] flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-center p-6">
              <div className="text-red-500 mb-2">⚠️</div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                Content temporarily unavailable
              </p>
              <button
                onClick={() => {
                  setRetryCount(0);
                  setError(null);
                  loadComponent(1);
                }}
                className="px-4 py-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !Component && !isLoading) {
          setIsVisible(true);
          loadComponent();
        }
      },
      { rootMargin: adjustedRootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [Component, isLoading, adjustedRootMargin]);

  // Preload high priority components
  useEffect(() => {
    if (shouldPreload && !Component && !isLoading) {
      loadComponent();
    }
  }, [shouldPreload]);

  const defaultFallback = (
    <div className="w-full min-h-[300px] flex items-center justify-center bg-gradient-to-br from-slate-50 to-green-50/30 dark:from-slate-800 dark:to-slate-700 rounded-lg">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Loading {priority} priority content...
          {retryCount > 0 && ` (Retry ${retryCount}/${maxRetries})`}
        </p>
      </div>
    </div>
  );

  return (
    <div ref={ref}>
      {Component ? (
        <Component />
      ) : isVisible || isLoading || shouldPreload ? (
        fallback || defaultFallback
      ) : (
        <div style={{ height: '300px' }} />
      )}
    </div>
  );
};

// Optimized lazy-loaded components with robust error handling
const OptimizedGreenAbout = () => {
  return (
    <RobustLazyComponent
      importFn={() => import('./components/sections/GreenAbout')}
      priority="high"
      rootMargin="200px"
      fallback={
        <div className="min-h-[300px] animate-pulse rounded-lg my-8 bg-slate-200/40 dark:bg-slate-800/40" />
      }
    />
  );
};

const OptimizedGreenSolutions = () => {
  return (
    <RobustLazyComponent
      importFn={() => import('./components/sections/GreenSolutions')}
      priority="medium"
      rootMargin="150px"
      fallback={
        <div className="min-h-[300px] animate-pulse rounded-lg my-8 bg-slate-200/40 dark:bg-slate-800/40" />
      }
    />
  );
};

const OptimizedInverterShowcase = () => {
  return (
    <RobustLazyComponent
      importFn={() => import('@/components/inverter-showcase').then(module => ({ default: module.InverterShowcase }))}
      priority="high"
      rootMargin="100px"
      fallback={
        <div className="min-h-[400px] animate-pulse rounded-lg my-8 bg-slate-200/40 dark:bg-slate-800/40" />
      }
    />
  );
};

const OptimizedGreenProducts = () => {
  return (
    <RobustLazyComponent
      importFn={() => import('./components/sections/GreenProducts')}
      priority="high"
      rootMargin="100px"
      fallback={
        <div className="min-h-[400px] animate-pulse rounded-lg my-8 bg-slate-200/40 dark:bg-slate-800/40" />
      }
    />
  );
};

const OptimizedGreenContact = () => {
  return (
    <RobustLazyComponent
      importFn={() => import('./components/sections/GreenContact')}
      priority="medium"
      rootMargin="150px"
      fallback={
        <div className="min-h-[300px] animate-pulse rounded-lg my-8 bg-slate-200/40 dark:bg-slate-800/40" />
      }
    />
  );
};

// Use direct import for GreenFooter to avoid chunk loading issues
const OptimizedGreenFooter = () => <GreenFooter />;

/**
 * GreenPage Component
 * Main page component for the green energy section with optimized loading
 * Includes performance monitoring and adaptive loading strategies
 */
const GreenPage = () => {
  // Temporarily disable loading screen for testing - set to false
  const [isLoading, setIsLoading] = useState(false); // Changed from true to false
  const { isLowPerformance } = usePerformanceMonitor();
  const { isDark, isLight } = useTheme();

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // Show loading screen initially (with quick bypass for testing)
  if (isLoading) {
    return (
      <OptimizedLoadingScreen
        onComplete={handleLoadingComplete}
        minDuration={isLowPerformance ? 500 : 1000} // Reduced duration for faster testing
      />
    );
  }

  return (
    <main
      className={`min-h-screen overflow-x-hidden relative w-full max-w-full ${
        isDark ? 'bg-grean-dark-main' : 'bg-grean-light-main'
      }`}
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #011428 0%, #021428 100%)'  // Custom deep dark blue-green gradient
          : 'linear-gradient(135deg, hsl(120, 30%, 98%) 0%, hsl(140, 25%, 95%) 25%, hsl(160, 20%, 92%) 50%, hsl(120, 15%, 94%) 75%, hsl(100, 20%, 96%) 100%)',
        minHeight: '100vh',
        transition: 'background 0.3s ease-in-out'
      }}
    >
      {/* Content with optimized structure */}
      <div className="relative z-10 w-full max-w-full overflow-x-hidden">
        {/* Optimized scrollbar styles */}
        <style jsx global>{`
          .hide-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }

          html,
          body {
            overflow-x: hidden;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          html::-webkit-scrollbar,
          body::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <OptimizedScrollProgressBar />
        <NavigationMenu />

        {/* Critical above-the-fold content - 60px overlap with LED display */}
        <div className="relative">
          <GreenIntro />

          {/* LED Display at top of overlap area */}
          <div className="relative z-60" style={{ marginTop: '-60px' }}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="w-full mb-0"
            >
              <LEDTextDisplay
                messages={[
                  'TRANSFORMING ETHIOPIA\'S ENERGY LANDSCAPE WITH SUSTAINABLE SOLUTIONS',
                  'SOLAR INSTALLATIONS • ENERGY STORAGE • SMART GRID TECHNOLOGY',
                  'POWERING 20 GREEN VILLAGES BY 2030 • REDUCING CARBON FOOTPRINT',
                  'GREAN WORLD ENERGY TECHNOLOGY PLC • CONTACT: +251-913-330000',
                ]}
              />
            </motion.div>

            <div className="relative z-50">
              <GreenHome />
            </div>
          </div>
        </div>

        {/* Performance-optimized lazy-loaded sections */}
        <OptimizedGreenAbout />
        <OptimizedGreenSolutions />
        <OptimizedInverterShowcase />
        <OptimizedGreenProducts />
        <OptimizedGreenContact />
        <OptimizedGreenFooter />
      </div>
    </main>
  );
};

export default GreenPage;
