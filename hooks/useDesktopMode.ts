'use client';

import { useState, useEffect } from 'react';

const DESKTOP_MODE_KEY = 'grean-desktop-mode-preference';

/**
 * Hook to detect and manage desktop mode preference on mobile devices
 * This allows mobile users to request the desktop version of the site
 */
export function useDesktopMode() {
  const [isDesktopMode, setIsDesktopMode] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  // Load desktop mode preference from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(DESKTOP_MODE_KEY);
      if (stored !== null) {
        setIsDesktopMode(JSON.parse(stored));
      }
    } catch (error) {
      console.warn('Failed to load desktop mode preference:', error);
    }

    setMounted(true);
  }, []);

  // Save desktop mode preference to localStorage
  const setDesktopMode = (enabled: boolean) => {
    setIsDesktopMode(enabled);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(DESKTOP_MODE_KEY, JSON.stringify(enabled));
      } catch (error) {
        console.warn('Failed to save desktop mode preference:', error);
      }
    }
  };

  // Toggle desktop mode
  const toggleDesktopMode = () => {
    setDesktopMode(!isDesktopMode);
  };

  // Check if user agent indicates desktop site request
  const isUserAgentDesktop = () => {
    if (typeof window === 'undefined') return false;

    const userAgent = navigator.userAgent.toLowerCase();

    // Check for common desktop site request patterns
    return (
      userAgent.includes('desktop') ||
      userAgent.includes('x11') ||
      userAgent.includes('windows nt') ||
      userAgent.includes('macintosh') ||
      (userAgent.includes('linux') && !userAgent.includes('mobile'))
    );
  };

  // Get effective desktop mode (preference or user agent)
  const effectiveDesktopMode = mounted
    ? isDesktopMode || isUserAgentDesktop()
    : false;

  return {
    isDesktopMode: effectiveDesktopMode,
    setDesktopMode,
    toggleDesktopMode,
    mounted,
    userPreference: isDesktopMode,
    userAgentDesktop: isUserAgentDesktop(),
  };
}
