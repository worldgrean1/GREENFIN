'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ThemeProvider } from '@/components/theme-provider';

const MainLayoutWrapper = dynamic(
  () => import('@/components/layout/MainLayoutWrapper').catch(error => {
    console.error('Failed to load MainLayoutWrapper:', error);
    // Return a fallback component instead of throwing
    return {
      default: ({ children }: { children: React.ReactNode }) => (
        <div className="min-h-screen bg-slate-900 text-white">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <div className="text-red-500 mb-4">⚠️</div>
              <h2 className="text-xl mb-2">Loading Error</h2>
              <p className="text-gray-400 mb-4">Please refresh the page</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Refresh Page
              </button>
            </div>
            {children}
          </div>
        </div>
      )
    };
  }),
  {
    ssr: true,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    )
  }
);

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      themes={['light', 'dark']}
      disableTransitionOnChange
    >
      <MainLayoutWrapper>{children}</MainLayoutWrapper>
    </ThemeProvider>
  );
}
