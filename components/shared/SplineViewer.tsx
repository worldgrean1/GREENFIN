'use client';

import { useState, useCallback, memo, useEffect, useRef } from 'react';
import { useMobileGestures, usePinchGesture } from '@/hooks/useMobileGestures';
import { playButtonClickSound, playAlarmSound } from '@/utils/sound';

interface SplineViewerProps {
  /** Optional scene URL - if not provided, will use NEXT_PUBLIC_SPLINE_SCENE from environment */
  scene?: string;
  /** Additional CSS classes */
  className?: string;
  /** Height of the container */
  height?: string | number;
  /** Width of the container */
  width?: string | number;
  /** Callback when Spline loads successfully */
  onLoad?: () => void;
  /** Callback when Spline encounters an error */
  onError?: (error: any) => void;
  /** Whether to show loading state */
  showLoading?: boolean;
  /** Enable mobile gesture controls */
  enableGestures?: boolean;
  /** Enable 3D model reset functionality */
  enableReset?: boolean;
}

const SplineViewer = memo(function SplineViewer({
  scene: propScene,
  className = '',
  height = '100%',
  width = '100%',
  onLoad,
  onError,
  showLoading = true,
  enableGestures = true,
  enableReset = true,
}: SplineViewerProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const splineRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use provided scene or fallback to environment variable
  const scene = propScene || process.env.NEXT_PUBLIC_SPLINE_SCENE;

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setRetryCount(0);
    onLoad?.();
    playButtonClickSound();
  }, [onLoad]);

  const handleError = useCallback(
    (err: any) => {
      setIsLoading(false);
      const errorMessage =
        retryCount >= 2
          ? 'Failed to load 3D model after multiple attempts. Please check your connection and try again later.'
          : 'Failed to load 3D model. Please check your connection and try again.';
      setError(errorMessage);
      onError?.(err);
      playAlarmSound();
      console.error('Spline Error:', err);
    },
    [onError, retryCount]
  );

  const handleRetry = useCallback(() => {
    setError(null);
    setIsLoading(true);
    setRetryCount(prev => prev + 1);
    playButtonClickSound();
  }, []);

  const resetView = useCallback(() => {
    if (splineRef.current && enableReset) {
      try {
        // Reset camera position if Spline API supports it
        if (splineRef.current.setZoom) {
          splineRef.current.setZoom(1);
        }
        playButtonClickSound();
        console.log('3D view reset');
      } catch (error) {
        console.warn('Failed to reset 3D view:', error);
      }
    }
  }, [enableReset]);

  // Mobile gesture handlers
  const handleSwipeLeft = useCallback(() => {
    // Rotate model left
    console.log('Swipe left - rotate model');
  }, []);

  const handleSwipeRight = useCallback(() => {
    // Rotate model right
    console.log('Swipe right - rotate model');
  }, []);

  const handlePinchMove = useCallback((scale: number) => {
    // Handle zoom
    if (splineRef.current && splineRef.current.setZoom) {
      splineRef.current.setZoom(scale);
    }
  }, []);

  // Initialize mobile gestures
  useMobileGestures({
    onSwipeLeft: enableGestures ? handleSwipeLeft : undefined,
    onSwipeRight: enableGestures ? handleSwipeRight : undefined,
    enabled: enableGestures,
  });

  usePinchGesture({
    onPinchMove: enableGestures ? handlePinchMove : undefined,
    enabled: enableGestures,
  });

  // Listen for global 3D reset events
  useEffect(() => {
    const handleResetEvent = () => resetView();

    if (enableReset && typeof window !== 'undefined') {
      window.addEventListener('grean:reset-3d-view', handleResetEvent);
      return () =>
        window.removeEventListener('grean:reset-3d-view', handleResetEvent);
    }
  }, [resetView, enableReset]);

  // Early return for missing scene configuration
  if (!scene) {
    return (
      <div
        className={`spline-error-container flex items-center justify-center p-8 ${className}`}
      >
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Configuration Required
          </h3>
          <p className="text-sm text-gray-600">
            Spline scene URL is not configured. Please set
            NEXT_PUBLIC_SPLINE_SCENE in your .env.local file or provide a scene
            prop.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`spline-container relative w-full ${className}`}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        width: typeof width === 'number' ? `${width}px` : width,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#f8f9fa',
      }}
    >
      {error ? (
        <div className="spline-error-container flex items-center justify-center h-full p-8">
          <div className="text-center">
            <div className="text-red-500 mb-2 text-2xl">❌</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              3D Model Unavailable
            </h3>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleRetry}
                disabled={retryCount >= 3}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {retryCount >= 3
                  ? 'Max Retries Reached'
                  : `Try Again ${retryCount > 0 ? `(${retryCount}/3)` : ''}`}
              </button>
              {enableReset && (
                <button
                  onClick={resetView}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  Reset View
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {isLoading && showLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading 3D model...</p>
              </div>
            </div>
          )}
          <iframe
            src={scene}
            frameBorder="0"
            width="100%"
            height="100%"
            title="Spline 3D Scene"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
              background: 'transparent',
            }}
            onLoad={handleLoad}
            onError={handleError}
          />
        </>
      )}
    </div>
  );
});

export default SplineViewer;
