'use client';

import { useEffect, useCallback, useRef } from 'react';
import { playButtonClickSound } from '@/utils/sound';

interface SwipeGestureConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number; // Minimum distance for swipe
  velocity?: number; // Minimum velocity for swipe
  enabled?: boolean;
}

interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

export function useMobileGestures(config: SwipeGestureConfig = {}) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    velocity = 0.3,
    enabled = true,
  } = config;

  const touchStart = useRef<TouchPoint | null>(null);
  const touchEnd = useRef<TouchPoint | null>(null);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled) return;

      const touch = e.touches[0];
      touchStart.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
      touchEnd.current = null;
    },
    [enabled]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!enabled || !touchStart.current) return;

      const touch = e.touches[0];
      touchEnd.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
    },
    [enabled]
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!enabled || !touchStart.current || !touchEnd.current) return;

      const deltaX = touchEnd.current.x - touchStart.current.x;
      const deltaY = touchEnd.current.y - touchStart.current.y;
      const deltaTime = touchEnd.current.time - touchStart.current.time;

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const swipeVelocity = distance / deltaTime;

      // Check if swipe meets threshold and velocity requirements
      if (distance < threshold || swipeVelocity < velocity) {
        return;
      }

      // Determine swipe direction
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > 0) {
          // Swipe right
          onSwipeRight?.();
          playButtonClickSound();
        } else {
          // Swipe left
          onSwipeLeft?.();
          playButtonClickSound();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          // Swipe down
          onSwipeDown?.();
          playButtonClickSound();
        } else {
          // Swipe up
          onSwipeUp?.();
          playButtonClickSound();
        }
      }

      // Reset touch points
      touchStart.current = null;
      touchEnd.current = null;
    },
    [
      enabled,
      threshold,
      velocity,
      onSwipeLeft,
      onSwipeRight,
      onSwipeUp,
      onSwipeDown,
    ]
  );

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Add touch event listeners
    document.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    isEnabled: enabled,
  };
}

// Hook for pinch-to-zoom gestures (useful for 3D model interaction)
interface PinchGestureConfig {
  onPinchStart?: (scale: number) => void;
  onPinchMove?: (scale: number, delta: number) => void;
  onPinchEnd?: (scale: number) => void;
  enabled?: boolean;
}

export function usePinchGesture(config: PinchGestureConfig = {}) {
  const { onPinchStart, onPinchMove, onPinchEnd, enabled = true } = config;

  const initialDistance = useRef<number | null>(null);
  const currentScale = useRef<number>(1);

  const getDistance = useCallback((touch1: Touch, touch2: Touch): number => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled || e.touches.length !== 2) return;

      const distance = getDistance(e.touches[0], e.touches[1]);
      initialDistance.current = distance;
      onPinchStart?.(currentScale.current);
    },
    [enabled, getDistance, onPinchStart]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (
        !enabled ||
        e.touches.length !== 2 ||
        initialDistance.current === null
      )
        return;

      e.preventDefault(); // Prevent default zoom behavior

      const distance = getDistance(e.touches[0], e.touches[1]);
      const scale = distance / initialDistance.current;
      const delta = scale - currentScale.current;

      currentScale.current = scale;
      onPinchMove?.(scale, delta);
    },
    [enabled, getDistance, onPinchMove]
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!enabled || e.touches.length > 0) return;

      if (initialDistance.current !== null) {
        onPinchEnd?.(currentScale.current);
        initialDistance.current = null;
      }
    },
    [enabled, onPinchEnd]
  );

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    document.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    currentScale: currentScale.current,
    isEnabled: enabled,
  };
}
