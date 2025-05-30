'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEnergySystemStore } from '@/store/energySystemStore';
import { useRouter } from 'next/navigation';

export function Logo() {
  const { setInverterActive, setSwitchActive } = useEnergySystemStore();
  const router = useRouter();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setInverterActive(false);
    setSwitchActive(false);
    router.push('/');
  };

  return (
    <div className="flex-shrink-0 items-center gap-3" style={{ opacity: 1, transform: 'none' }}>
      <Link href="/" onClick={handleLogoClick} className="flex items-center">
        <div className="flex items-center">
          <motion.div
            className="logo-container relative mr-3"
            tabIndex={0}
            style={{ transform: 'none' }}
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
                loading="lazy"
                decoding="async"
                data-nimg="1"
                className="object-contain"
                style={{ color: 'transparent' }}
              />
            </div>
          </motion.div>
          <div>
            <motion.div className="flex flex-col" transition={{ duration: 0.5 }}>
              <div className="flex items-center">
                <span className="text-[#3DD56D] text-xl sm:text-2xl font-bold tracking-wide">
                  GREAN
                </span>
                <span className="text-xl sm:text-2xl font-bold tracking-wide ml-1 text-gray-200">
                  WORLD
                </span>
              </div>
              <p className="text-xs tracking-wide text-gray-400">
                ENERGY TECHNOLOGY
              </p>
            </motion.div>
          </div>
        </div>
      </Link>
    </div>
  );
}
