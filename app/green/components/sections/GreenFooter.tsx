'use client';

import Image from 'next/image';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useBrandTheme } from '@/components/theme-provider';

// Component props type
interface GreenFooterProps {
  noSeam?: boolean;
}

export default function GreenFooter({ noSeam = false }: GreenFooterProps) {
  const { effectiveTheme, isDark, isLight } = useTheme();
  const { isDarkMode } = useBrandTheme();

  return (
    <footer
      id="green-footer"
      className={`py-3 px-4 sm:px-6 w-full border-t typography-small ${
        isDarkMode ? 'border-slate-700/20' : 'border-gray-200/50'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left side - Copyright */}
        <div
          className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}
        >
          © {new Date().getFullYear()}{' '}
          <span className={isDarkMode ? 'text-grean-primary' : 'text-grean-secondary'}>GREAN</span> WORLD
        </div>

        {/* Center - Logo and tagline */}
        <div className="hidden md:flex items-center gap-2">
          <div className="relative w-6 h-6">
            <Image
              src="/logos/grean-world-logo.png"
              alt="GREAN WORLD logo icon, green energy brand"
              width={24}
              height={24}
              className="object-contain"
              placeholder="blur"
              blurDataURL="/logos/grean-world-logo.png"
            />
          </div>
          <span
            className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}
          >
            <span className={isDarkMode ? 'text-grean-primary' : 'text-grean-secondary'}>#</span>PoweringDignity
          </span>
        </div>

        {/* Right side - Social icons */}
        <div className="flex space-x-4">
          <a
            href="#"
            className={`transition-colors ${
              isDarkMode
                ? 'text-slate-400 hover:text-grean-primary'
                : 'text-gray-600 hover:text-grean-secondary'
            }`}
            aria-label="Facebook"
          >
            <Facebook className="h-4 w-4" />
          </a>
          <a
            href="#"
            className={`transition-colors ${
              isDarkMode
                ? 'text-slate-400 hover:text-grean-primary'
                : 'text-gray-600 hover:text-grean-secondary'
            }`}
            aria-label="Twitter"
          >
            <Twitter className="h-4 w-4" />
          </a>
          <a
            href="#"
            className={`transition-colors ${
              isDarkMode
                ? 'text-slate-400 hover:text-grean-primary'
                : 'text-gray-600 hover:text-grean-secondary'
            }`}
            aria-label="Instagram"
          >
            <Instagram className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
