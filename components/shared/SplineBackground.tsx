'use client';

import { useState, useEffect } from 'react';

interface SplineBackgroundProps {
  opacity?: number;
}

export function SplineBackground({ opacity = 1 }: SplineBackgroundProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Preload the iframe to improve performance
    const timer = setTimeout(() => {
      if (!isLoaded && !hasError) {
        setIsLoaded(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isLoaded, hasError]);

  const handleIframeLoad = () => {
    console.log('✅ Spline scene loaded successfully!');
    setIsLoaded(true);
  };

  const handleIframeError = () => {
    console.warn('❌ Spline scene failed to load, using fallback');
    setHasError(true);
    setIsLoaded(true);
  };

  const splineUrl = process.env.NEXT_PUBLIC_SPLINE_SCENE;

  return (
    <div
      className="absolute inset-0 z-20"
      style={{
        opacity: isLoaded ? opacity : 0,
        transition: 'opacity 1s ease-in-out',
        transform: 'translateZ(0)',
        willChange: 'opacity, transform',
        backfaceVisibility: 'hidden',
      }}
    >
      {/* Spline 3D Scene Container */}
      <div
        className="spline-container absolute inset-0 w-full h-full"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          backgroundColor: 'transparent',
        }}
      >
        {!hasError && splineUrl ? (
          <>
            <iframe
              src={splineUrl}
              frameBorder="0"
              width="100%"
              height="100%"
              title="Lightning Bulb 3D Animation - Sustainable Energy Innovation"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              loading="eager"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none',
                background: 'transparent',
                zIndex: 100, // Much higher z-index to ensure visibility
              }}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            />
          </>
        ) : (
          // Enhanced fallback content when Spline fails to load
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white/70">
                {/* Animated lightbulb fallback */}
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-400/20 blur-2xl animate-pulse"></div>
                  <div className="relative w-full h-full flex items-center justify-center">
                    <svg className="w-20 h-20 text-yellow-400 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-sm opacity-75">Sustainable Energy Innovation</p>
                <p className="text-xs opacity-50 mt-2">3D Scene Fallback Active</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading indicator overlay */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm z-10">
          <div className="text-center text-white">
            <div className="relative w-12 h-12 mx-auto mb-3">
              <div className="absolute inset-0 border-2 border-yellow-400/30 rounded-full"></div>
              <div className="absolute inset-0 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-sm opacity-75">Loading 3D Lightning Bulb...</p>
          </div>
        </div>
      )}
    </div>
  );
}
