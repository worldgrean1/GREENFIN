'use client';

import * as React from 'react';
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes';

// Brand-compatible theme provider that maintains existing API
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // For now, keep using next-themes but prepare for migration
  // TODO: Gradually migrate to BrandThemeProvider
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

// Create a simple brand theme hook that works with next-themes
export function useBrandTheme() {
  const [mounted, setMounted] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  React.useEffect(() => {
    setMounted(true);

    // Check current theme from document class
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    updateTheme();

    // Listen for theme changes
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  return {
    isDarkMode: mounted ? isDarkMode : true, // Default to dark during SSR
    theme: mounted ? (isDarkMode ? 'dark' : 'light') : 'dark',
    setTheme: (theme: 'light' | 'dark') => {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
      setIsDarkMode(theme === 'dark');
    }
  };
}
