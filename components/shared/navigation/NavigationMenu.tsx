'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useEnergySystemStore } from '@/store/energySystemStore';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';
import {
  Power,
  Zap,
  Home,
  ShoppingBag,
  Info,
  MessageSquare,
  ExternalLink,
  Sparkles,
  Leaf,
  Battery,
  Sun,
  Mail,
  Moon,
} from 'lucide-react';

export function NavigationMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const { setInverterActive, setSwitchActive } = useEnergySystemStore();
  const { isDark, isLight, mounted, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('green-intro');
  const [clickedSection, setClickedSection] = useState<string | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-hide functionality states
  const [isVisible, setIsVisible] = useState(true);
  const [isHoverZoneActive, setIsHoverZoneActive] = useState(false);
  const [isNavHovered, setIsNavHovered] = useState(false);
  const [showDiscoveryHint, setShowDiscoveryHint] = useState(false);
  const autoHideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mouseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const discoveryHintTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if we're on the green route
  const isGreenPage = pathname === '/green';

  // Enhanced scroll detection with better viewport calculation
  const handleScroll = useCallback(() => {
    const sectionIds = [
      'green-intro',
      'green-home',
      'green-about',
      'green-solutions',
      'green-products',
      'green-contact',
    ];

    // Find the section that's most visible in the viewport
    let currentSection = sectionIds[0];
    let maxVisibleArea = 0;

    sectionIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Calculate visible area of the section
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(viewportHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);

        // Calculate percentage of section visible
        const sectionHeight = rect.height;
        const visiblePercentage =
          sectionHeight > 0 ? visibleHeight / sectionHeight : 0;

        // Prioritize sections that are more than 30% visible
        // or if the section takes up significant viewport space
        const visibleArea = visibleHeight * visiblePercentage;

        // Special handling for sections near the top of viewport
        const isNearTop =
          rect.top <= viewportHeight * 0.3 &&
          rect.bottom >= viewportHeight * 0.1;

        if (
          (visibleArea > maxVisibleArea && visiblePercentage > 0.3) ||
          (isNearTop && visibleArea > maxVisibleArea * 0.5)
        ) {
          maxVisibleArea = visibleArea;
          currentSection = id;
        }
      }
    });

    setActiveSection(currentSection);
  }, []);

  // Throttled scroll handler for better performance
  const throttledScrollHandler = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      handleScroll();
    }, 16); // ~60fps
  }, [handleScroll]);

  // Mouse detection for auto-hide functionality
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isGreenPage) return;

      const rightEdgeThreshold = 50; // 50px from right edge
      const windowWidth = window.innerWidth;
      const mouseX = e.clientX;
      const distanceFromRightEdge = windowWidth - mouseX;

      // Check if mouse is near the right edge
      if (distanceFromRightEdge <= rightEdgeThreshold) {
        setIsHoverZoneActive(true);
        setIsVisible(true);
        setShowDiscoveryHint(false); // Hide discovery hint when user finds the zone

        // Clear any existing hide timeout
        if (mouseTimeoutRef.current) {
          clearTimeout(mouseTimeoutRef.current);
          mouseTimeoutRef.current = null;
        }
      } else {
        setIsHoverZoneActive(false);

        // Only hide if mouse is not hovering over the navigation itself
        if (!isNavHovered) {
          // Set timeout to hide sidebar when mouse leaves the area
          if (mouseTimeoutRef.current) {
            clearTimeout(mouseTimeoutRef.current);
          }

          mouseTimeoutRef.current = setTimeout(() => {
            // Double-check that nav is still not hovered before hiding
            if (!isNavHovered) {
              setIsVisible(false);
            }
          }, 500); // 500ms delay before hiding
        }
      }
    },
    [isGreenPage, isNavHovered]
  );

  // Auto-hide after 2 seconds on page load
  useEffect(() => {
    if (!isGreenPage) return;

    // Clear any existing timeout
    if (autoHideTimeoutRef.current) {
      clearTimeout(autoHideTimeoutRef.current);
    }

    // Set auto-hide timeout
    autoHideTimeoutRef.current = setTimeout(() => {
      // Only hide if navigation is not being hovered
      if (!isNavHovered) {
        setIsVisible(false);

        // Show discovery hint 1 second after hiding
        discoveryHintTimeoutRef.current = setTimeout(() => {
          setShowDiscoveryHint(true);

          // Hide discovery hint after 3 seconds
          setTimeout(() => {
            setShowDiscoveryHint(false);
          }, 3000);
        }, 1000);
      }
    }, 2000);

    return () => {
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current);
      }
      if (discoveryHintTimeoutRef.current) {
        clearTimeout(discoveryHintTimeoutRef.current);
      }
    };
  }, [isGreenPage, isNavHovered]);

  useEffect(() => {
    // Initial call to set active section
    handleScroll();

    window.addEventListener('scroll', throttledScrollHandler, {
      passive: true,
    });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Add mouse move listener for auto-hide functionality
    if (isGreenPage) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      window.removeEventListener('resize', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (mouseTimeoutRef.current) {
        clearTimeout(mouseTimeoutRef.current);
      }
      if (discoveryHintTimeoutRef.current) {
        clearTimeout(discoveryHintTimeoutRef.current);
      }
    };
  }, [throttledScrollHandler, handleScroll, handleMouseMove, isGreenPage]);

  const handlePowerOff = () => {
    // Only turn off the switch, leave inverter state unchanged
    setSwitchActive(false);

    // Add a small delay to ensure the state is updated before redirecting
    setTimeout(() => {
      router.push('/');
    }, 100);
  };

  // Brand-compliant color helper function
  const getBrandColors = (brandColor: 'primary' | 'secondary' | 'accent') => {
    switch (brandColor) {
      case 'primary':
        return {
          main: '#3DD56D',
          gradient: 'from-[#3DD56D] to-[#2bb757]',
          shadow: 'shadow-[#3DD56D]/40',
          hoverShadow: 'hover:shadow-[#3DD56D]/50',
          glow: 'shadow-[0_0_20px_rgba(61,213,109,0.4)]',
          border: 'border-[#3DD56D]/50',
        };
      case 'secondary':
        return {
          main: '#2bb757',
          gradient: 'from-[#2bb757] to-[#23A455]',
          shadow: 'shadow-[#2bb757]/40',
          hoverShadow: 'hover:shadow-[#2bb757]/50',
          glow: 'shadow-[0_0_20px_rgba(43,183,87,0.4)]',
          border: 'border-[#2bb757]/50',
        };
      case 'accent':
        return {
          main: '#23A455',
          gradient: 'from-[#23A455] to-[#3DD56D]',
          shadow: 'shadow-[#23A455]/40',
          hoverShadow: 'hover:shadow-[#23A455]/50',
          glow: 'shadow-[0_0_20px_rgba(35,164,85,0.4)]',
          border: 'border-[#23A455]/50',
        };
    }
  };

  // Brand-compliant menu items using official GREAN WORLD colors
  const menuItems = [
    {
      icon: <Sparkles className="w-[20px] h-[20px]" />,
      label: 'Intro',
      description: 'Welcome to Green Energy',
      href: '#green-intro',
      sectionId: 'green-intro',
      brandColor: 'primary' as const, // Uses #3DD56D
    },
    {
      icon: <Home className="w-[20px] h-[20px]" />,
      label: 'Home',
      description: 'Green Living Solutions',
      href: '#green-home',
      sectionId: 'green-home',
      brandColor: 'secondary' as const, // Uses #2bb757
    },
    {
      icon: <Leaf className="w-[20px] h-[20px]" />,
      label: 'About',
      description: 'Our Mission & Vision',
      href: '#green-about',
      sectionId: 'green-about',
      brandColor: 'accent' as const, // Uses #23A455
    },
    {
      icon: <Sun className="w-[20px] h-[20px]" />,
      label: 'Solutions',
      description: 'Renewable Energy Systems',
      href: '#green-solutions',
      sectionId: 'green-solutions',
      brandColor: 'primary' as const, // Uses #3DD56D
    },
    {
      icon: <Battery className="w-[20px] h-[20px]" />,
      label: 'Products',
      description: 'Energy Storage & More',
      href: '#green-products',
      sectionId: 'green-products',
      brandColor: 'secondary' as const, // Uses #2bb757
    },
    {
      icon: <Mail className="w-[20px] h-[20px]" />,
      label: 'Contact',
      description: 'Get in Touch',
      href: '#green-contact',
      sectionId: 'green-contact',
      brandColor: 'accent' as const, // Uses #23A455
    },
  ];

  // Brand-compliant Coming Soon nav item
  const comingSoonItem = {
    icon: <ExternalLink className="w-[20px] h-[20px]" />,
    label: 'Coming Soon',
    description: 'Sister Projects',
    href: '/green/sister',
    brandColor: 'accent' as const, // Uses #23A455
  };

  return (
    <div
      className={`fixed right-4 sm:right-6 top-1/2 transform -translate-y-1/2 z-[100] flex flex-col items-end transition-all duration-700 ease-out ${
        isGreenPage && !isVisible
          ? 'translate-x-full opacity-0 pointer-events-none'
          : 'translate-x-0 opacity-100 pointer-events-auto'
      }`}
    >
      {/* Compact Navigation Container */}
      <div
        className="relative"
        onMouseEnter={() => {
          setIsNavHovered(true);
          // Clear any pending hide timeout when hovering over nav
          if (mouseTimeoutRef.current) {
            clearTimeout(mouseTimeoutRef.current);
            mouseTimeoutRef.current = null;
          }
        }}
        onMouseLeave={() => {
          setIsNavHovered(false);
          // Start hide timer when leaving nav (if not in hover zone)
          if (!isHoverZoneActive && isGreenPage) {
            if (mouseTimeoutRef.current) {
              clearTimeout(mouseTimeoutRef.current);
            }
            mouseTimeoutRef.current = setTimeout(() => {
              setIsVisible(false);
            }, 500);
          }
        }}
      >
        <ul className="flex flex-col items-end gap-2">
          {menuItems.map((item, index) => {
            const isActive = activeSection === item.sectionId;
            const brandColors = getBrandColors(item.brandColor);

            return (
              <li key={index} className="relative group">
                <a
                  href={item.href}
                  className="flex items-center cursor-pointer"
                  onClick={e => {
                    if (item.href.startsWith('#')) {
                      e.preventDefault();
                      const sectionId = item.href.slice(1);
                      setClickedSection(sectionId);
                      const element = document.getElementById(sectionId);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }
                  }}
                  aria-label={`Navigate to ${item.label} section - ${item.description}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {/* Tooltip on Hover */}
                  <div
                    className={`
                  mr-4 text-right transition-all duration-300 ease-out absolute right-full whitespace-nowrap
                  opacity-0 translate-x-2 scale-95 group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100
                  pointer-events-none
                `}
                  >
                    {/* Compact Tooltip */}
                    <div className={`backdrop-blur-sm rounded-lg px-3 py-2 shadow-xl border ${
                      isDark
                        ? 'bg-black/80 border-white/10'
                        : 'bg-white/95 border-gray-200/50'
                    }`}>
                      <div className={`text-sm font-medium ${
                        isDark ? 'text-white' : 'text-green-800'
                      }`}>
                        {item.label}
                      </div>
                    </div>
                  </div>

                  {/* Brand-Compliant Compact Round Navigation Button */}
                  <div
                    className={`
                  relative w-12 h-12 rounded-full
                  flex items-center justify-center
                  transition-all duration-300 ease-out transform
                  ${isActive
                    ? `bg-gradient-to-br ${brandColors.gradient} text-white shadow-lg ${brandColors.shadow} scale-110`
                    : isDark
                      ? `bg-white/90 hover:bg-white text-gray-700 shadow-md hover:shadow-lg ${brandColors.hoverShadow} hover:scale-110`
                      : `bg-gray-800/90 hover:bg-gray-800 text-white shadow-md hover:shadow-lg ${brandColors.hoverShadow} hover:scale-110`
                  }
                  backdrop-blur-sm border ${isDark ? 'border-white/40' : 'border-gray-600/40'}
                  ${brandColors.border}
                `}
                    style={{
                      color: isActive ? 'white' : (isDark ? '#374151' : 'white'),
                      '--hover-color': brandColors.main,
                    } as React.CSSProperties & { '--hover-color': string }}
                  >
                    {/* Icon with Modern Styling */}
                    <span
                      className={`transition-all duration-300 ${
                        isActive ? 'scale-110 drop-shadow-sm' : 'group-hover:scale-110'
                      }`}
                    >
                      {item.icon}
                    </span>

                    {/* Brand-Compliant Active State Glow */}
                    {isActive && (
                      <>
                        <div
                          className="absolute inset-0 rounded-full bg-gradient-to-br via-transparent animate-pulse"
                          style={{
                            backgroundImage: `linear-gradient(to bottom right, ${brandColors.main}20, transparent, ${brandColors.main.replace('#3DD56D', '#2bb757').replace('#2bb757', '#23A455').replace('#23A455', '#3DD56D')}20)`
                          }}
                        />
                        <div
                          className="absolute -inset-0.5 rounded-full blur-sm -z-10"
                          style={{
                            backgroundImage: `linear-gradient(to bottom right, ${brandColors.main}40, ${brandColors.main.replace('#3DD56D', '#2bb757').replace('#2bb757', '#23A455').replace('#23A455', '#3DD56D')}40)`
                          }}
                        />
                      </>
                    )}

                    {/* Brand-Compliant Hover Glow Effect */}
                    <div
                      className="absolute inset-0 rounded-full bg-gradient-to-br via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        backgroundImage: `linear-gradient(to bottom right, ${brandColors.main}10, transparent, ${brandColors.main.replace('#3DD56D', '#2bb757').replace('#2bb757', '#23A455').replace('#23A455', '#3DD56D')}10)`
                      }}
                    />
                  </div>

                  {/* Click Ripple Effect */}
                  {item.href.startsWith('#') &&
                    clickedSection === item.href.slice(1) &&
                    !isActive && (
                      <div className="absolute inset-0 rounded-full border-2 border-[#3DD56D]/60 animate-ping" />
                    )}
                </a>
              </li>
            );
          })}
          {/* Brand-Compliant Coming Soon Item */}
          <li className="relative group mt-4">
            <a
              href={comingSoonItem.href}
              className="flex items-center cursor-pointer"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* Tooltip on Hover */}
              <div className="mr-4 text-right transition-all duration-300 ease-out absolute right-full whitespace-nowrap opacity-0 translate-x-2 scale-95 group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 pointer-events-none">
                <div className={`backdrop-blur-sm rounded-lg px-3 py-2 shadow-xl border ${
                  isDark
                    ? 'bg-black/80 border-white/10'
                    : 'bg-white/95 border-gray-200/50'
                }`}>
                  <div className={`text-sm font-medium ${
                    isDark ? 'text-white' : 'text-green-800'
                  }`}>
                    {comingSoonItem.label}
                  </div>
                </div>
              </div>

              {/* Brand-Compliant Coming Soon Button */}
              {(() => {
                const comingBrandColors = getBrandColors(comingSoonItem.brandColor);
                return (
                  <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ease-out transform bg-gradient-to-br ${comingBrandColors.gradient} text-white shadow-lg ${comingBrandColors.shadow} hover:shadow-xl ${comingBrandColors.hoverShadow} hover:scale-110 backdrop-blur-sm border ${isDark ? 'border-white/40' : 'border-gray-600/40'}`}>
                    <span className="transition-all duration-300 group-hover:scale-110 drop-shadow-sm">
                      {comingSoonItem.icon}
                    </span>

                    {/* Brand-Compliant Glow Effects */}
                    <div
                      className="absolute inset-0 rounded-full bg-gradient-to-br via-transparent animate-pulse"
                      style={{
                        backgroundImage: `linear-gradient(to bottom right, ${comingBrandColors.main}20, transparent, ${comingBrandColors.main.replace('#3DD56D', '#2bb757').replace('#2bb757', '#23A455').replace('#23A455', '#3DD56D')}20)`
                      }}
                    />
                    <div
                      className="absolute -inset-0.5 rounded-full blur-sm -z-10"
                      style={{
                        backgroundImage: `linear-gradient(to bottom right, ${comingBrandColors.main}40, ${comingBrandColors.main.replace('#3DD56D', '#2bb757').replace('#2bb757', '#23A455').replace('#23A455', '#3DD56D')}40)`
                      }}
                    />

                    {/* Hover Effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                );
              })()}
            </a>
          </li>

          {/* Compact Power Off Button */}
          <li className="relative group mt-4">
            <button
              onClick={handlePowerOff}
              className="flex items-center cursor-pointer"
            >
              {/* Tooltip on Hover */}
              <div className="mr-4 text-right transition-all duration-300 ease-out absolute right-full whitespace-nowrap opacity-0 translate-x-2 scale-95 group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 pointer-events-none">
                <div className={`backdrop-blur-sm rounded-lg px-3 py-2 shadow-xl border ${
                  isDark
                    ? 'bg-black/80 border-white/10'
                    : 'bg-white/95 border-gray-200/50'
                }`}>
                  <div className={`text-sm font-medium ${
                    isDark ? 'text-white' : 'text-green-800'
                  }`}>
                    Power Off
                  </div>
                </div>
              </div>

              {/* Brand-Compliant Power Off Button */}
              <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ease-out transform bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/40 hover:shadow-xl hover:shadow-red-500/50 hover:scale-110 backdrop-blur-sm border ${isDark ? 'border-white/40' : 'border-gray-600/40'} hover:border-red-400/50`}>
                <span className="transition-all duration-300 group-hover:scale-110 drop-shadow-sm">
                  <Power className="w-[20px] h-[20px]" />
                </span>

                {/* Power Off Glow Effects */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-400/20 via-transparent to-red-600/20 animate-pulse" />
                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-red-500/40 to-red-600/40 blur-sm -z-10" />

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </button>
          </li>

          {/* Theme Toggle Button */}
          <li className="relative group mt-4">
            <button
              onClick={toggleTheme}
              className="flex items-center cursor-pointer"
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {/* Tooltip on Hover */}
              <div className="mr-4 text-right transition-all duration-300 ease-out absolute right-full whitespace-nowrap opacity-0 translate-x-2 scale-95 group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100 pointer-events-none">
                <div className={`backdrop-blur-sm rounded-lg px-3 py-2 shadow-xl border ${
                  isDark
                    ? 'bg-black/80 border-white/10'
                    : 'bg-white/95 border-gray-200/50'
                }`}>
                  <div className={`text-sm font-medium ${
                    isDark ? 'text-white' : 'text-green-800'
                  }`}>
                    {isDark ? 'Light Mode' : 'Dark Mode'}
                  </div>
                </div>
              </div>

              {/* Brand-Compliant Theme Toggle Button */}
              <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ease-out transform ${
                isDark
                  ? 'bg-gradient-to-br from-[#3DD56D] to-[#2bb757] text-white shadow-lg shadow-[#3DD56D]/40 hover:shadow-xl hover:shadow-[#3DD56D]/50'
                  : 'bg-gradient-to-br from-[#23A455] to-[#2bb757] text-white shadow-lg shadow-[#23A455]/40 hover:shadow-xl hover:shadow-[#23A455]/50'
              } hover:scale-110 backdrop-blur-sm border ${isDark ? 'border-white/40' : 'border-gray-600/40'} hover:border-[#3DD56D]/50`}>
                <span className="transition-all duration-300 group-hover:scale-110 drop-shadow-sm">
                  {mounted && isDark ? (
                    <Sun className="w-[20px] h-[20px]" />
                  ) : (
                    <Moon className="w-[20px] h-[20px]" />
                  )}
                </span>

                {/* Brand-Compliant Theme Toggle Glow Effects */}
                <div className={`absolute inset-0 rounded-full ${
                  isDark
                    ? 'bg-gradient-to-br from-[#3DD56D]/20 via-transparent to-[#2bb757]/20'
                    : 'bg-gradient-to-br from-[#23A455]/20 via-transparent to-[#2bb757]/20'
                } animate-pulse`} />
                <div className={`absolute -inset-0.5 rounded-full ${
                  isDark
                    ? 'bg-gradient-to-br from-[#3DD56D]/40 to-[#2bb757]/40'
                    : 'bg-gradient-to-br from-[#23A455]/40 to-[#2bb757]/40'
                } blur-sm -z-10`} />

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
