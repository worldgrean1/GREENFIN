'use client';

import { useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

interface PerformanceMetrics {
  isLowPerformance: boolean;
  fps: number;
  memoryUsage?: number;
  shouldReduceAnimations: boolean;
  shouldReduceComplexity: boolean;
}

/**
 * Consolidated performance monitoring hook
 * Replaces duplicate performance monitoring across components
 * Provides consistent performance metrics and low-performance detection
 */
export const usePerformanceMonitor = (): PerformanceMetrics => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    isLowPerformance: false,
    fps: 60,
    shouldReduceAnimations: false,
    shouldReduceComplexity: false,
  });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // If user prefers reduced motion, only reduce animations but don't assume low performance
    if (prefersReducedMotion) {
      setMetrics(prev => ({
        ...prev,
        shouldReduceAnimations: true,
        shouldReduceComplexity: false,
        isLowPerformance: false, // Don't assume low performance just because of reduced motion preference
      }));
      return;
    }

    let frameCount = 0;
    let lastTime = performance.now();
    let lowPerformanceCount = 0;
    let rafId: number;

    const checkPerformance = () => {
      frameCount++;
      const currentTime = performance.now();

      // Check performance every second
      if (currentTime - lastTime >= 1000) {
        const fps = frameCount;

        // Consider low performance if FPS is below 20 (more lenient)
        if (fps < 20) {
          lowPerformanceCount++;
          // Only set low performance after 5 consecutive low FPS readings
          // This prevents temporary spikes from triggering low performance mode
          if (lowPerformanceCount >= 5) {
            setMetrics({
              isLowPerformance: true,
              fps,
              memoryUsage: (performance as any).memory?.usedJSHeapSize,
              shouldReduceAnimations: fps < 15,
              shouldReduceComplexity: fps < 10,
            });
          }
        } else {
          // Reset counter if performance is good
          lowPerformanceCount = Math.max(0, lowPerformanceCount - 1); // Gradually reduce counter
          setMetrics({
            isLowPerformance: false,
            fps,
            memoryUsage: (performance as any).memory?.usedJSHeapSize,
            shouldReduceAnimations: fps < 30,
            shouldReduceComplexity: false,
          });
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      // Continue monitoring if not in low performance mode
      if (!metrics.isLowPerformance) {
        rafId = requestAnimationFrame(checkPerformance);
      }
    };

    rafId = requestAnimationFrame(checkPerformance);
    return () => cancelAnimationFrame(rafId);
  }, [prefersReducedMotion, metrics.isLowPerformance]);

  return metrics;
};

/**
 * Legacy hook for backward compatibility
 * @deprecated Use usePerformanceMonitor instead
 */
export const useBackgroundPerformance = (): boolean => {
  const { isLowPerformance } = usePerformanceMonitor();
  return isLowPerformance;
};
