'use client';

import { useTheme as useNextTheme } from 'next-themes';
import { useCallback, useEffect, useState } from 'react';
import { playButtonClickSound } from '@/utils/sound';

export type Theme = 'light' | 'dark';

export function useTheme() {
  const [mounted, setMounted] = useState(false);
  const {
    theme,
    setTheme: setNextTheme,
    resolvedTheme,
    systemTheme,
  } = useNextTheme();

  // Handle mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Set theme with sound effect
  const setTheme = useCallback(
    (newTheme: Theme) => {
      setNextTheme(newTheme);
      playButtonClickSound();

      // Dispatch custom event for theme change
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('grean:theme-change', {
            detail: { theme: newTheme, effectiveTheme: resolvedTheme },
          })
        );
      }
    },
    [setNextTheme, resolvedTheme]
  );

  // Toggle between light and dark (skips system)
  const toggleTheme = useCallback(() => {
    const currentEffective = resolvedTheme || 'dark';
    const newTheme = currentEffective === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }, [resolvedTheme, setTheme]);

  // Cycle between light and dark themes only
  const cycleTheme = useCallback(() => {
    const themeOrder: Theme[] = ['light', 'dark'];
    const currentIndex = themeOrder.indexOf(theme as Theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  }, [theme, setTheme]);

  // Get current effective theme with hydration safety
  const effectiveTheme = mounted ? (resolvedTheme as 'light' | 'dark') || 'dark' : 'dark';
  const systemPreference = (systemTheme as 'light' | 'dark') || 'dark';

  return {
    theme: theme as Theme,
    effectiveTheme,
    systemPreference,
    mounted,
    setTheme,
    toggleTheme,
    cycleTheme,
    isLight: mounted ? effectiveTheme === 'light' : false,
    isDark: mounted ? effectiveTheme === 'dark' : true, // Default to dark during SSR
    isSystem: theme === 'system',
  };
}
