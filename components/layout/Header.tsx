'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useEnergySystemStore } from '@/store/energySystemStore';
import { LEDTextDisplay } from '@/components/ui/LEDTextDisplay';
import { useBrandTheme } from '@/components/theme-provider';

interface HeaderProps {
  scrolled: boolean;
}

export default function Header({ scrolled }: HeaderProps) {
  const { switchActive } = useEnergySystemStore();
  const { isDarkMode } = useBrandTheme();

  return (
    <motion.header
      className={`py-3 px-4 sm:px-6 transition-all duration-500 ${
        scrolled
          ? isDarkMode
            ? 'bg-slate-900/90 backdrop-blur-md border-b border-grean-primary/10'
            : 'bg-white/90 backdrop-blur-md border-b border-grean-secondary/10'
          : ''
      }`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-2">
        {/* Top row with logo and mobile menu button */}
        <div className="flex justify-between items-center">
          <Link href="/">
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="logo-container relative mr-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="logo-glow-effect"></div>
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 logo-spin">
                  <Image
                    src="/logos/grean-world-logo.png"
                    alt="GREAN WORLD Logo"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                  <motion.div
                    className={`absolute inset-0 rounded-full ${
                      isDarkMode ? 'bg-grean-primary/20' : 'bg-grean-secondary/20'
                    }`}
                    animate={{
                      opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: 'easeInOut',
                    }}
                  />
                </div>
              </motion.div>

              <div>
                <motion.div
                  className="flex flex-col"
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center">
                    <span className={`text-xl sm:text-2xl font-bold tracking-wide typography-h2 ${
                      isDarkMode ? 'text-grean-primary' : 'text-grean-secondary'
                    }`}>
                      GREAN
                    </span>
                    <span className={`text-xl sm:text-2xl font-bold tracking-wide ml-1 typography-h2 ${
                      isDarkMode ? 'text-gray-200' : 'text-slate-800'
                    }`}>
                      WORLD
                    </span>
                  </div>
                  <p className={`text-xs tracking-wide typography-small ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    ENERGY TECHNOLOGY PLC
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </Link>

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
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </motion.button>
        </div>

        {/* LED Text Display - always visible */}
        <div className="flex-1">
          <LEDTextDisplay
            messages={[
              'POWERING SUSTAINABLE ENERGY SOLUTIONS ACROSS AFRICA',
              'SOLAR INSTALLATIONS • ENERGY STORAGE • SMART GRIDS',
              'REDUCING CARBON FOOTPRINT SINCE 2015',
              '24/7 CUSTOMER SUPPORT: +251-911-123456',
            ]}
          />
        </div>
      </div>
    </motion.header>
  );
}
