'use client';

import { motion } from 'framer-motion';
import { useEnergySystemStore } from '@/store/energySystemStore';
import { useTheme } from '@/hooks/useTheme';
import { Zap } from 'lucide-react';

export default function PremiumHeroSection() {
  const { switchActive } = useEnergySystemStore();
  const { isDark, isLight } = useTheme();

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 md:pt-[15rem] pb-0 relative">
      <div className="flex flex-col items-center text-center">
        <motion.h1
          className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-2 flex items-center justify-center ${
            isDark ? 'text-white' : 'text-hero-title'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Intelligent Energy{' '}
          <span className={`bg-clip-text text-transparent ml-2 ${
            isDark
              ? 'bg-gradient-to-r from-green-400 to-green-500'
              : 'bg-gradient-to-r from-[#167a3c] to-[#3DD56D]'
          }`}>
            Systems
          </span>{' '}
          <Zap className={`w-10 h-10 ml-2 ${
            isDark ? 'text-green-500' : 'text-[#3DD56D]'
          }`} />
        </motion.h1>

        <motion.p
          className={`text-lg md:text-xl max-w-3xl mx-auto mb-2 ${
            isDark ? 'text-white' : 'text-description-text'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <span className={isDark ? 'text-green-400' : 'text-[#3DD56D]'}>"At GREAN WORLD</span> Energy
          Technology, we don't just sell solar — we deliver intelligent energy
          systems built for reliability, efficiency, and a{' '}
          <span className={isDark ? 'text-green-400' : 'text-[#3DD56D]'}>sustainable future.</span>"
        </motion.p>
      </div>
    </section>
  );
}
