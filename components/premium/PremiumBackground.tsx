'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

// Official Brand CSS from brand guidelines
const brandCSS = `
  :root {
    --grean-primary: #3dd56d;
    --grean-secondary: #2bb757;
    --grean-accent: #23a455;
  }
`;

export default function PremiumBackground() {
  const { isDark, isLight } = useTheme();

  // Inject official brand CSS
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = brandCSS;
    document.head.appendChild(styleElement);

    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Official Brand Background Gradients */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%)'
            : 'linear-gradient(135deg, #fff 0%, #f8fafc 50%, #f1f5f9 100%)',
          transition: 'background 0.3s ease-in-out'
        }}
      ></div>

      {/* Official Brand Dot Pattern Overlay */}
      <motion.div
        className={`absolute inset-0 ${isDark ? 'opacity-20' : 'opacity-12'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isDark ? 0.2 : 0.12 }}
        transition={{ duration: 1.2 }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
              <svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="dots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                    <circle cx="5" cy="5" r="1" fill="var(--grean-primary)" opacity="0.3"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dots)"/>
              </svg>
            `)}")`,
            backgroundSize: '60px 60px',
            backgroundRepeat: 'repeat',
          }}
        />
      </motion.div>

      {/* Right side decorative elements - visible on larger screens */}
      <div className="absolute right-0 top-0 w-1/3 h-full opacity-40 hidden xl:block overflow-hidden pointer-events-none">
        {/* Official Brand Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? 'linear-gradient(to left, rgba(61, 213, 109, 0.2) 0%, transparent 100%)'
              : 'linear-gradient(to left, rgba(61, 213, 109, 0.25) 0%, transparent 100%)'
          }}
        ></div>

        {/* Official Brand Animated Elements */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[60%] h-[60%]">
            <motion.div
              className="absolute w-48 h-48 rounded-full"
              style={{
                backgroundColor: isDark
                  ? 'rgba(61, 213, 109, 0.08)'
                  : 'rgba(61, 213, 109, 0.12)'
              }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute w-36 h-36 rounded-full"
              style={{
                backgroundColor: isDark
                  ? 'rgba(43, 183, 87, 0.12)'
                  : 'rgba(43, 183, 87, 0.18)'
              }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
            />
            <motion.div
              className="absolute w-24 h-24 rounded-full"
              style={{
                backgroundColor: isDark
                  ? 'rgba(35, 164, 85, 0.18)'
                  : 'rgba(35, 164, 85, 0.25)'
              }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
            />
            <div
              className="absolute w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: isDark
                  ? 'rgba(61, 213, 109, 0.45)'
                  : 'rgba(61, 213, 109, 0.50)'
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10 text-white"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>

            {/* Official Brand Connection Lines */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 400 400"
            >
              <g
                stroke={isDark ? "rgba(61, 213, 109, 0.2)" : "rgba(43, 183, 87, 0.3)"}
                fill="none"
                strokeWidth="1"
              >
                <path d="M200,200 L150,150"></path>
                <path d="M200,200 L250,150"></path>
                <path d="M200,200 L150,250"></path>
                <path d="M200,200 L250,250"></path>
                <path d="M200,200 L120,200"></path>
                <path d="M200,200 L280,200"></path>
                <path d="M200,200 L200,120"></path>
                <path d="M200,200 L200,280"></path>
              </g>
              <g fill={isDark ? "rgba(61, 213, 109, 0.4)" : "rgba(35, 164, 85, 0.5)"}>
                <circle cx="150" cy="150" r="4"></circle>
                <circle cx="250" cy="150" r="4"></circle>
                <circle cx="150" cy="250" r="4"></circle>
                <circle cx="250" cy="250" r="4"></circle>
                <circle cx="120" cy="200" r="4"></circle>
                <circle cx="280" cy="200" r="4"></circle>
                <circle cx="200" cy="120" r="4"></circle>
                <circle cx="200" cy="280" r="4"></circle>
              </g>
            </svg>
          </div>
        </div>
      </div>


    </div>
  );
}
