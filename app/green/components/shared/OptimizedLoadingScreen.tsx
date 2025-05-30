'use client';

import React, { useEffect, useState } from 'react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

interface OptimizedLoadingScreenProps {
  onComplete: () => void;
  minDuration?: number;
}

export function OptimizedLoadingScreen({
  onComplete,
  minDuration = 2000
}: OptimizedLoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const { isLowPerformance, shouldReduceAnimations } = usePerformanceMonitor();

  // Manual skip function for testing
  const handleSkip = () => {
    setProgress(100);
    setIsComplete(true);
    setTimeout(onComplete, 100);
  };

  useEffect(() => {
    const startTime = Date.now();
    let animationFrame: number;
    let fallbackTimeout: NodeJS.Timeout;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / minDuration) * 100, 100);

      setProgress(newProgress);

      if (newProgress >= 100) {
        setIsComplete(true);
        setTimeout(onComplete, 300); // Small delay for smooth transition
      } else {
        animationFrame = requestAnimationFrame(updateProgress);
      }
    };

    // Start the progress animation
    animationFrame = requestAnimationFrame(updateProgress);

    // Fallback timeout to ensure loading always completes
    fallbackTimeout = setTimeout(() => {
      setProgress(100);
      setIsComplete(true);
      setTimeout(onComplete, 300);
    }, minDuration + 1000); // Extra 1 second as fallback

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      if (fallbackTimeout) {
        clearTimeout(fallbackTimeout);
      }
    };
  }, [minDuration, onComplete]);

  // Simplified loading animation for low performance devices
  if (isLowPerformance || shouldReduceAnimations) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#3DD56D]/30 border-t-[#3DD56D] rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Grean Energy</h2>
          <p className="text-gray-300 mb-4">Loading...</p>

          {/* Simple progress bar for low performance */}
          <div className="w-48 bg-slate-700 rounded-full h-1 mb-2 mx-auto">
            <div
              className="h-full bg-[#3DD56D] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mb-3">{Math.round(progress)}%</p>

          {/* Skip button */}
          <button
            onClick={handleSkip}
            className="px-3 py-1 text-xs bg-[#3DD56D]/20 hover:bg-[#3DD56D]/30 text-[#3DD56D] rounded border border-[#3DD56D]/30 transition-all duration-200"
          >
            Skip
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
      {/* Optimized background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent('<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><path d="M0,0 L30,60 L60,0 Z" fill="#3DD56D" fill-opacity="0.1"/></svg>')}")`,
          backgroundSize: '60px 60px',
          backgroundRepeat: 'repeat'
        }}
      />

      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* Logo/Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-[#3DD56D]/20 flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-[#3DD56D] flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
              </svg>
            </div>
          </div>

          {/* Animated rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-2 border-[#3DD56D]/30 rounded-full animate-ping"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-40 h-40 border border-[#3DD56D]/20 rounded-full animate-pulse"
              style={{ animationDelay: '0.5s' }}
            ></div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-2">
          Grean Energy
        </h1>
        <p className="text-gray-300 mb-8">
          Powering sustainable futures
        </p>

        {/* Progress bar */}
        <div className="w-full bg-slate-700 rounded-full h-2 mb-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#3DD56D] to-emerald-400 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress text */}
        <p className="text-sm text-gray-400 mb-4">
          {Math.round(progress)}% Complete
        </p>

        {/* Skip button for testing */}
        <button
          onClick={handleSkip}
          className="px-4 py-2 text-xs bg-[#3DD56D]/20 hover:bg-[#3DD56D]/30 text-[#3DD56D] rounded-full border border-[#3DD56D]/30 transition-all duration-200 mb-4"
        >
          Skip Loading
        </button>

        {/* Loading dots */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-[#3DD56D] rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-[#3DD56D] rounded-full animate-bounce"
            style={{ animationDelay: '0.1s' }}
          ></div>
          <div
            className="w-2 h-2 bg-[#3DD56D] rounded-full animate-bounce"
            style={{ animationDelay: '0.2s' }}
          ></div>
        </div>
      </div>

      {/* Fade out animation when complete */}
      {isComplete && (
        <div className="absolute inset-0 bg-slate-900 animate-fade-out pointer-events-none" />
      )}

      <style jsx>{`
        @keyframes fade-out {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        .animate-fade-out {
          animation: fade-out 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
