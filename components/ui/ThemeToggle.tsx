'use client';

import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';

interface ThemeToggleProps {
  variant?: 'icon' | 'button' | 'dropdown';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ThemeToggle({
  variant = 'icon',
  size = 'md',
  className = '',
}: ThemeToggleProps) {
  const { theme, effectiveTheme, toggleTheme, cycleTheme, mounted } =
    useTheme();

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 relative inline-flex items-center justify-center rounded-lg p-2 ${className}`}
        aria-hidden="true"
      />
    );
  }

  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;

  const getIcon = () => {
    if (!mounted) return <Moon size={iconSize} />;

    switch (theme) {
      case 'light':
        return <Sun size={iconSize} />;
      case 'dark':
        return <Moon size={iconSize} />;
      default:
        return <Moon size={iconSize} />;
    }
  };

  const getLabel = () => {
    if (!mounted) return 'Toggle theme';

    switch (theme) {
      case 'light':
        return 'Light mode';
      case 'dark':
        return 'Dark mode';
      default:
        return 'Toggle theme';
    }
  };

  if (variant === 'icon') {
    return (
      <motion.button
        className={`
          relative inline-flex items-center justify-center rounded-lg
          p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200
          hover:bg-gray-100 dark:hover:bg-gray-800
          transition-colors duration-200
          ${className}
        `}
        onClick={cycleTheme}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        title={getLabel()}
        aria-label={getLabel()}
      >
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {getIcon()}
        </motion.div>
      </motion.button>
    );
  }

  if (variant === 'button') {
    // Map our size prop to valid Button sizes
    const buttonSize = size === 'md' ? 'default' : size;

    return (
      <Button
        variant="outline"
        size={buttonSize as 'sm' | 'default' | 'lg'}
        onClick={cycleTheme}
        className={`gap-2 ${className}`}
        aria-label={getLabel()}
      >
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {getIcon()}
        </motion.div>
        <span className="hidden sm:inline">{getLabel()}</span>
      </Button>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <motion.button
          className="
            inline-flex items-center justify-center rounded-lg
            px-3 py-2 text-sm font-medium
            text-gray-700 dark:text-gray-200
            bg-white dark:bg-gray-800
            border border-gray-300 dark:border-gray-600
            hover:bg-gray-50 dark:hover:bg-gray-700
            focus:outline-none focus:ring-2 focus:ring-blue-500
            transition-colors duration-200
          "
          onClick={cycleTheme}
          whileTap={{ scale: 0.98 }}
          aria-label={getLabel()}
        >
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mr-2"
          >
            {getIcon()}
          </motion.div>
          {getLabel()}
        </motion.button>
      </div>
    );
  }

  return null;
}

// Theme indicator component for status display
export function ThemeIndicator({ className = '' }: { className?: string }) {
  const { theme, mounted } = useTheme();

  if (!mounted) return null;

  return (
    <div
      className={`flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 ${className}`}
    >
      <div className="flex items-center gap-1">
        {theme === 'light' && <Sun size={12} />}
        {theme === 'dark' && <Moon size={12} />}
        <span>{theme}</span>
      </div>
    </div>
  );
}
