'use client';

import React, { useState, useEffect, ReactNode } from 'react';

interface HydrationSafeWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

/**
 * HydrationSafeWrapper - Prevents hydration mismatches by ensuring
 * content only renders after client-side hydration is complete.
 * 
 * This wrapper is particularly useful for components that:
 * - Use theme-dependent styling
 * - Access localStorage or other browser APIs
 * - Have different server/client rendering logic
 * 
 * @param children - Content to render after hydration
 * @param fallback - Optional content to show during SSR/before hydration
 * @param className - Optional CSS classes for the wrapper
 */
export function HydrationSafeWrapper({ 
  children, 
  fallback = null, 
  className = '' 
}: HydrationSafeWrapperProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return fallback ? <div className={className}>{fallback}</div> : null;
  }

  return <div className={className}>{children}</div>;
}

/**
 * Hook for hydration-safe theme detection
 * Returns safe theme values that prevent hydration mismatches
 */
export function useHydrationSafeTheme() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return {
    isHydrated,
    // Safe defaults that match server-side rendering
    getSafeThemeClass: (darkClass: string, lightClass: string, defaultToDark = true) => {
      if (!isHydrated) {
        return defaultToDark ? darkClass : lightClass;
      }
      // After hydration, use actual theme detection
      const isDark = document.documentElement.classList.contains('dark');
      return isDark ? darkClass : lightClass;
    }
  };
}

export default HydrationSafeWrapper;
