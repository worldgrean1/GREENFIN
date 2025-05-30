'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { navItems } from './NavigationItems';
import { useBrandTheme } from '@/components/theme-provider';

interface MobileNavigationProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeNavItem: string | null;
  activeSubmenu: string | null;
  setActiveSubmenu: (submenu: string | null) => void;
  onNavigate?: (path: string) => void;
}

export function MobileNavigation({
  isOpen,
  setIsOpen,
  activeNavItem,
  activeSubmenu,
  setActiveSubmenu,
  onNavigate,
}: MobileNavigationProps) {
  const { isDarkMode } = useBrandTheme();

  // Wrapper to handle navigation via link or callback
  const handleNavClick = (
    e: React.MouseEvent,
    path: string,
    hasSubmenu: boolean = false
  ) => {
    if (hasSubmenu) return;

    if (onNavigate) {
      e.preventDefault();
      setIsOpen(false); // Close mobile menu
      onNavigate(path);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <motion.button
        className={`md:hidden transition-colors ${
          isDarkMode
            ? 'text-gray-400 hover:text-grean-primary'
            : 'text-gray-600 hover:text-grean-secondary'
        }`}
        whileTap={{ scale: 0.95 }}
        whileHover={{
          color: isDarkMode ? '#3DD56D' : '#2bb757',
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </motion.button>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className={`md:hidden backdrop-blur-md ${
            isDarkMode ? 'bg-slate-900/95' : 'bg-white/95'
          }`}
        >
          <div className="px-4 pt-2 pb-6 space-y-4">
            {navItems.map(item => (
              <div key={item.name} className="py-3">
                {onNavigate ? (
                  <div
                    className={`flex items-center justify-between text-base font-medium cursor-pointer ${
                      activeNavItem === item.href
                        ? isDarkMode ? 'text-grean-primary' : 'text-grean-secondary'
                        : isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                    onClick={e => {
                      if (item.submenu) {
                        setActiveSubmenu(
                          activeSubmenu === item.name ? null : item.name
                        );
                      } else {
                        handleNavClick(e, item.href);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                    {item.submenu && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transition-transform ${activeSubmenu === item.name ? 'rotate-180' : ''}`}
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between text-base font-medium ${
                      activeNavItem === item.href
                        ? isDarkMode ? 'text-grean-primary' : 'text-grean-secondary'
                        : isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                    onClick={e => {
                      if (item.submenu) {
                        e.preventDefault();
                        setActiveSubmenu(
                          activeSubmenu === item.name ? null : item.name
                        );
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                    {item.submenu && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transition-transform ${activeSubmenu === item.name ? 'rotate-180' : ''}`}
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    )}
                  </Link>
                )}

                {/* Mobile Submenu */}
                {item.submenu && activeSubmenu === item.name && (
                  <div className={`mt-2 ml-6 space-y-2 border-l-2 pl-4 ${
                    isDarkMode ? 'border-slate-700' : 'border-gray-300'
                  }`}>
                    {item.submenu.map(subItem =>
                      onNavigate ? (
                        <div
                          key={subItem.name}
                          className={`block py-2 text-sm cursor-pointer transition-colors ${
                            isDarkMode
                              ? 'text-slate-300 hover:text-grean-primary'
                              : 'text-gray-600 hover:text-grean-secondary'
                          }`}
                          onClick={e => handleNavClick(e, subItem.href)}
                        >
                          {subItem.name}
                        </div>
                      ) : (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={`block py-2 text-sm transition-colors ${
                            isDarkMode
                              ? 'text-slate-300 hover:text-grean-primary'
                              : 'text-gray-600 hover:text-grean-secondary'
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-4">
              {onNavigate ? (
                <Button
                  className={`w-full text-white ${
                    isDarkMode
                      ? 'bg-grean-primary hover:bg-grean-secondary'
                      : 'bg-grean-secondary hover:bg-grean-accent'
                  }`}
                  onClick={e => e.preventDefault()}
                >
                  Coming Soon
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button className={`w-full text-white ${
                  isDarkMode
                    ? 'bg-grean-primary hover:bg-grean-secondary'
                    : 'bg-grean-secondary hover:bg-grean-accent'
                }`}>
                  Coming Soon
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
