'use client';

import React, { useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useTheme } from '@/hooks/useTheme';
import { useBrandTheme } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { SystemStatus, FloatingStatus } from '@/components/ui/SystemStatus';

// Separate component that uses search params to prevent build errors
const ScrollToAnchor = () => {
  // We need to access window in a client component
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const elementId = hash.substring(1);
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 500); // Small delay to ensure component is rendered
    }
  }, []);

  return null;
};

interface MainLayoutWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const MainLayoutWrapper = ({
  children,
  className = '',
}: MainLayoutWrapperProps) => {
  const pathname = usePathname();
  const { effectiveTheme } = useTheme();
  const { isDarkMode } = useBrandTheme();

  // Check if the current path is green_home
  const isGreenHomePage = pathname === '/green_home';

  // Initialize keyboard shortcuts
  useKeyboardShortcuts({
    enabled: true,
  });

  return (
    <div className={`min-h-screen ${className}`}>
      {/* Theme Toggle - Fixed position */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <ThemeToggle variant="icon" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Only show the eco-glass background if not on green_home page */}
        {!isGreenHomePage && <div className="eco-glass fixed inset-0 z-0" />}
        <div className="relative z-10 flex-1">
          <Suspense fallback={null}>
            <ScrollToAnchor />
          </Suspense>
          {children}
        </div>
      </div>

      {/* Production status - Desktop/Tablet only */}
      {process.env.NODE_ENV === 'production' && (
        <div className="hidden sm:block">
          <FloatingStatus className="fixed bottom-28 left-4 z-40" />
        </div>
      )}
    </div>
  );
};

export default MainLayoutWrapper;
