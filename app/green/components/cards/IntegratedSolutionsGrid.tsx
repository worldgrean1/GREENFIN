'use client';

import React, { memo, useState, useCallback, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { useTheme } from '@/hooks/useTheme';
import { IntegratedSolutionCard } from './IntegratedSolutionCard';

// Types
interface IntegratedSolution {
  title: string;
  description: string;
  shortDescription: string;
  tags: string[];
  gradient: string;
  borderColor: string;
  hoverBorder: string;
  accentColor: string;
  bgAccent: string;
  features: string[];
  stats: { value: string; label: string };
}

interface IntegratedSolutionsGridProps {
  solutions: IntegratedSolution[];
  onSolutionSelect?: (solution: IntegratedSolution) => void;
  className?: string;
  maxInitialCards?: number;
}

// Loading skeleton component
const CardSkeleton = memo(() => {
  const { isDark } = useTheme();

  return (
    <div className={`
      animate-pulse rounded-2xl min-h-[400px] sm:min-h-[450px] p-6 sm:p-8
      ${isDark
        ? 'bg-slate-800/50 border border-slate-700/50'
        : 'bg-gray-100/50 border border-gray-200/50'
      }
    `}>
      <div className="space-y-4">
        {/* Title skeleton */}
        <div className={`h-6 rounded ${isDark ? 'bg-slate-700' : 'bg-gray-300'}`} />

        {/* Tags skeleton */}
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-6 w-20 rounded-full ${isDark ? 'bg-slate-700' : 'bg-gray-300'}`}
            />
          ))}
        </div>

        {/* Description skeleton */}
        <div className="space-y-2">
          <div className={`h-4 rounded ${isDark ? 'bg-slate-700' : 'bg-gray-300'}`} />
          <div className={`h-4 w-3/4 rounded ${isDark ? 'bg-slate-700' : 'bg-gray-300'}`} />
        </div>

        {/* Features skeleton */}
        <div className="space-y-2 mt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${isDark ? 'bg-slate-700' : 'bg-gray-300'}`} />
              <div className={`h-4 flex-1 rounded ${isDark ? 'bg-slate-700' : 'bg-gray-300'}`} />
            </div>
          ))}
        </div>

        {/* Button skeleton */}
        <div className={`h-12 rounded-xl mt-auto ${isDark ? 'bg-slate-700' : 'bg-gray-300'}`} />
      </div>
    </div>
  );
});

CardSkeleton.displayName = 'CardSkeleton';

// Error boundary component
const ErrorCard = memo(({ error, onRetry }: { error: Error; onRetry: () => void }) => {
  const { isDark } = useTheme();

  return (
    <div className={`
      rounded-2xl min-h-[400px] sm:min-h-[450px] p-6 sm:p-8
      flex flex-col items-center justify-center text-center
      ${isDark
        ? 'bg-red-900/20 border border-red-800/50 text-red-300'
        : 'bg-red-50/50 border border-red-200/50 text-red-700'
      }
    `}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Failed to load solution</h3>
        <p className="text-sm opacity-80">{error.message}</p>
      </div>
      <button
        onClick={onRetry}
        className={`
          px-4 py-2 rounded-lg text-sm font-medium transition-colors
          ${isDark
            ? 'bg-red-800/50 hover:bg-red-800/70 text-red-200'
            : 'bg-red-100 hover:bg-red-200 text-red-800'
          }
        `}
      >
        Try Again
      </button>
    </div>
  );
});

ErrorCard.displayName = 'ErrorCard';

// Main grid component
export const IntegratedSolutionsGrid = memo<IntegratedSolutionsGridProps>(({
  solutions,
  onSolutionSelect,
  className = '',
  maxInitialCards = 4
}) => {
  const [showAll, setShowAll] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [errors, setErrors] = useState<Map<number, Error>>(new Map());

  const { isLowPerformance, shouldReduceAnimations } = usePerformanceMonitor();
  const { isDark } = useTheme();

  // Memoized solutions display logic
  const { visibleSolutions, hasMore } = useMemo(() => {
    const visible = showAll ? solutions : solutions.slice(0, maxInitialCards);
    return {
      visibleSolutions: visible,
      hasMore: solutions.length > maxInitialCards && !showAll
    };
  }, [solutions, showAll, maxInitialCards]);

  // Handlers
  const handleLoadMore = useCallback(async () => {
    if (loadingMore) return;

    setLoadingMore(true);

    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));

    setShowAll(true);
    setLoadingMore(false);
  }, [loadingMore]);

  const handleSolutionSelect = useCallback((solution: IntegratedSolution) => {
    onSolutionSelect?.(solution);
  }, [onSolutionSelect]);

  const handleCardError = useCallback((index: number, error: Error) => {
    setErrors(prev => new Map(prev).set(index, error));
  }, []);

  const handleRetry = useCallback((index: number) => {
    setErrors(prev => {
      const newErrors = new Map(prev);
      newErrors.delete(index);
      return newErrors;
    });
  }, []);

  // Animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceAnimations ? 0.05 : 0.1,
        delayChildren: 0.2
      }
    }
  }), [shouldReduceAnimations]);

  const loadMoreVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  }), []);

  return (
    <div className={`w-full ${className}`}>
      {/* Grid Container */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {visibleSolutions.map((solution, index) => {
          const error = errors.get(index);

          if (error) {
            return (
              <ErrorCard
                key={`error-${index}`}
                error={error}
                onRetry={() => handleRetry(index)}
              />
            );
          }

          return (
            <Suspense key={solution.title} fallback={<CardSkeleton />}>
              <IntegratedSolutionCard
                solution={solution}
                index={index}
                onLearnMore={handleSolutionSelect}
                priority={index < 2 ? 'high' : 'normal'}
                className="w-full"
              />
            </Suspense>
          );
        })}

        {/* Loading skeletons for "Load More" */}
        <AnimatePresence>
          {loadingMore && (
            <>
              {Array.from({ length: solutions.length - maxInitialCards }).map((_, index) => (
                <motion.div
                  key={`skeleton-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <CardSkeleton />
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Load More Button */}
      <AnimatePresence>
        {hasMore && !loadingMore && (
          <motion.div
            className="flex justify-center mt-12"
            variants={loadMoreVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className={`
                group px-8 py-4 rounded-xl font-semibold text-base
                transition-all duration-300 shadow-lg hover:shadow-xl
                ${isDark
                  ? 'bg-gradient-to-r from-[#3DD56D] to-[#2bb757] text-white hover:from-[#2bb757] hover:to-[#3DD56D]'
                  : 'bg-gradient-to-r from-[#3DD56D] to-[#2bb757] text-white hover:from-[#2bb757] hover:to-[#3DD56D]'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              whileHover={!shouldReduceAnimations ? { scale: 1.05 } : {}}
              whileTap={!shouldReduceAnimations ? { scale: 0.95 } : {}}
            >
              <span className="flex items-center space-x-2">
                <span>View All Solutions</span>
                <motion.span
                  animate={!shouldReduceAnimations ? { x: [0, 4, 0] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
});

IntegratedSolutionsGrid.displayName = 'IntegratedSolutionsGrid';

export default IntegratedSolutionsGrid;
