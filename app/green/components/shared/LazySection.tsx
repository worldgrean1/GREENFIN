'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

interface LazySectionProps {
  importFn: () => Promise<{ default: React.ComponentType<any> }>;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  componentProps?: any;
  priority?: 'low' | 'medium' | 'high';
}

const LoadingFallback = ({ priority }: { priority?: string }) => {
  const { isLowPerformance } = usePerformanceMonitor();

  if (isLowPerformance) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-800">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-slate-50 to-green-50/30 dark:from-slate-800 dark:to-slate-700">
      <div className="text-center">
        {/* Animated loading skeleton */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 animate-pulse mx-auto mb-4"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin"></div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32 mx-auto"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24 mx-auto"></div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
          Loading {priority} priority content...
        </p>
      </div>
    </div>
  );
};

export function LazySection({
  importFn,
  fallback,
  rootMargin = '100px',
  threshold = 0.1,
  componentProps = {},
  priority = 'medium'
}: LazySectionProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const { isLowPerformance, shouldReduceComplexity } = usePerformanceMonitor();

  // Adjust root margin based on performance and priority
  const adjustedRootMargin = React.useMemo(() => {
    if (isLowPerformance) {
      return '50px'; // Smaller margin for low performance
    }

    switch (priority) {
      case 'high':
        return '200px';
      case 'medium':
        return rootMargin;
      case 'low':
        return '50px';
      default:
        return rootMargin;
    }
  }, [isLowPerformance, priority, rootMargin]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !Component && !isLoading) {
          setIsIntersecting(true);
        }
      },
      {
        rootMargin: adjustedRootMargin,
        threshold
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [adjustedRootMargin, threshold, Component, isLoading]);

  useEffect(() => {
    if (isIntersecting && !Component && !isLoading) {
      setIsLoading(true);
      setError(null);

      // Add artificial delay for low priority components to prevent overwhelming
      const delay = priority === 'low' ? 100 : 0;

      setTimeout(() => {
        importFn()
          .then((module) => {
            // Handle both default and named exports
            const ComponentToRender = module.default || module;
            if (ComponentToRender) {
              setComponent(() => ComponentToRender);
            } else {
              throw new Error('No component found in module');
            }
          })
          .catch((err) => {
            console.error('Failed to load component:', err);
            // For chunk loading errors, try to provide a fallback
            if (err.name === 'ChunkLoadError') {
              console.warn('Chunk loading failed, component will be skipped');
              // Set a simple fallback component
              setComponent(() => () => (
                <div className="w-full h-32 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Content temporarily unavailable
                  </p>
                </div>
              ));
            } else {
              setError(err);
            }
          })
          .finally(() => {
            setIsLoading(false);
          });
      }, delay);
    }
  }, [isIntersecting, Component, isLoading, importFn, priority]);

  // Error fallback
  if (error) {
    return (
      <div className="w-full h-32 flex items-center justify-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-sm">
            Failed to load content
          </p>
          <button
            onClick={() => {
              setError(null);
              setIsIntersecting(true);
            }}
            className="mt-2 px-3 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show component if loaded
  if (Component) {
    return (
      <Suspense fallback={fallback || <LoadingFallback priority={priority} />}>
        <Component {...componentProps} />
      </Suspense>
    );
  }

  // Show loading state or placeholder
  return (
    <div ref={elementRef} className="w-full">
      {isIntersecting || isLoading ? (
        fallback || <LoadingFallback priority={priority} />
      ) : (
        // Placeholder that maintains layout
        <div className="w-full h-64 bg-transparent" />
      )}
    </div>
  );
}

// Optimized presets for common use cases
export const LazyHeroSection = (props: Omit<LazySectionProps, 'priority' | 'rootMargin'>) => (
  <LazySection {...props} priority="high" rootMargin="300px" />
);

export const LazyContentSection = (props: Omit<LazySectionProps, 'priority' | 'rootMargin'>) => (
  <LazySection {...props} priority="medium" rootMargin="150px" />
);

export const LazyFooterSection = (props: Omit<LazySectionProps, 'priority' | 'rootMargin'>) => (
  <LazySection {...props} priority="low" rootMargin="50px" />
);
