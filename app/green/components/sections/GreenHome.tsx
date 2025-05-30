'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { SunMedium, Leaf, Wind, Zap, ArrowRight } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useBrandTheme } from '@/components/theme-provider';
import { GreanButton } from '@/components/ui/grean-button';
import { GreanCard } from '@/components/ui/grean-card';
import { TypingTextAnimation } from '@/components/animations/text/TypingTextAnimation';

// OFFICIAL Brand CSS from Brand Guidelines - EXACT Implementation
const brandCSS = `
  /* Official GREAN WORLD Brand Colors - 60-30-10 Rule */
  :root {
    --grean-primary: #3dd56d;
    --grean-secondary: #2bb757;
    --grean-accent: #23a455;
    --grean-primary-light: #2bb757;
    --grean-secondary-light: #23a455;
    --grean-accent-light: #1e7e34;
  }

  /* Official Brand Typography Classes */
  .typography-display {
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.02em;
  }

  .typography-h1 {
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.01em;
  }

  .typography-h2 {
    font-weight: 600;
    line-height: 1.25;
  }

  .typography-h3 {
    font-weight: 600;
    line-height: 1.3;
  }

  .typography-body {
    font-weight: 400;
    line-height: 1.6;
  }

  .typography-small {
    font-weight: 500;
    line-height: 1.4;
  }
`;

export default function GreenHome() {
  const [isVisible, setIsVisible] = useState(false);
  const { isDark, isLight } = useTheme();
  const { isDarkMode } = useBrandTheme();

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

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

  useEffect(() => {
    if (inView) {
      setIsVisible(true);
    }
  }, [inView]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen pt-20 overflow-hidden"
      style={{ marginTop: '-60px' }}
    >


      {/* Brand Gradient Overlay */}
      <div className={`absolute inset-0 ${
        isDarkMode
          ? 'bg-gradient-to-br from-[#3dd56d]/5 via-transparent to-[#2bb757]/5'
          : 'bg-gradient-to-br from-[#2bb757]/10 via-transparent to-[#23a455]/10'
      }`} />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-[#3dd56d]/20"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 h-full flex items-center justify-center min-h-screen">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >


            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border mb-8 typography-small ${
                isDarkMode
                  ? 'bg-[#3dd56d]/20 text-[#3dd56d] border-[#3dd56d]/30'
                  : 'bg-[#2bb757]/20 text-[#2bb757] border-[#2bb757]/50'
              }`}
            >
              <SunMedium className="mr-2 h-4 w-4" />
              Powering a Sustainable Future
            </motion.div>

            {/* BRAND COMPLIANT Main Title - Following 60-30-10 Rule */}
            <div className="space-y-6">
              <h1 className={`text-6xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight flex flex-col sm:flex-row items-center justify-center gap-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <TypingTextAnimation
                  text="Building a Greener Future Together"
                  speed="medium"
                  className="inline-block"
                />
              </h1>

              {/* BRAND COMPLIANT Subtitle with Official Typography */}
              <div className="space-y-4">
                <p className="text-xl typography-h3 text-[#2bb757]">
                  Transforming <span className="text-[#3dd56d] font-semibold">20 Villages</span> into Green Villages by 2030.
                </p>
                <p className={`text-lg max-w-2xl typography-body ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Leading Ethiopia's energy transition with <span className={`font-semibold text-[#23a455]`}>sustainable, reliable, and affordable innovations</span>.
                </p>
              </div>
            </div>

            {/* Brand-Compliant Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 mt-8"
            >
              <motion.div
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(61, 213, 109, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <GreanButton
                  variant="primary"
                  size="lg"
                  className="flex items-center justify-center min-w-[200px]"
                >
                  Explore Solutions
                  <ArrowRight className="ml-2 h-5 w-5" />
                </GreanButton>
              </motion.div>

              <motion.div
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(43, 183, 87, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <GreanButton
                  variant="outline"
                  size="lg"
                  className="flex items-center justify-center min-w-[200px]"
                >
                  Contact Us
                </GreanButton>
              </motion.div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ delay: 1 }}
              className="flex items-center space-x-6"
            >
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Trusted by:</span>
              <div className="flex space-x-4">
                {[SunMedium, Leaf, Wind, Zap].map((Icon, index) => (
                  <div
                    key={index}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isDark
                        ? 'bg-[#3dd56d]/20'
                        : 'bg-[#2bb757]/10 border border-[#2bb757]/30'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isDark ? 'text-[#3dd56d]' : 'text-[#2bb757]'}`} />
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual - Brand-Compliant GreanCard */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative w-full h-96 lg:h-[500px]">
              {/* New Solar Panel Design from HTML */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative w-full h-full max-w-[350px] max-h-[300px] sm:max-w-[400px] sm:max-h-[350px] mx-auto"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Solar Panel Grid Container */}
                  <div className="relative w-full h-full max-w-[280px] max-h-[200px] sm:max-w-[350px] sm:max-h-[250px] md:max-w-[400px] md:max-h-[300px] rounded-xl overflow-hidden shadow-2xl z-0">
                    {/* Glow Effect - ORIGINAL COLORS */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3DD56D]/30 to-[#2bb757]/30 opacity-30 blur-sm rounded-xl" />

                    {/* Panel Background - Original Colors */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0c253a] to-[#071221] border border-slate-700/50" />

                    {/* Solar Panel Grid - 4x4 */}
                    <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-1 p-2 sm:p-3">
                      {[...Array(16)].map((_, i) => (
                        <div
                          key={i}
                          className="rounded-sm relative overflow-hidden transition-all duration-500 bg-[#2bb757]/70"
                          style={{ transitionDelay: `${i * 50}ms` }}
                        />
                      ))}
                    </div>

                    {/* Gradient Overlay - ORIGINAL COLORS */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#3DD56D]/10 to-transparent opacity-20" />
                  </div>
                </div>

                {/* Central Energy Visualization */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  {/* Pulsing Circles - ORIGINAL COLORS */}
                  <div className="w-full h-full max-w-[250px] max-h-[250px] sm:max-w-[280px] sm:max-h-[280px] rounded-full bg-[#3DD56D]/20 animate-pulse" />

                  <div
                    className="absolute w-[80%] h-[80%] max-w-[200px] max-h-[200px] sm:max-w-[220px] sm:max-h-[220px] rounded-full bg-[#3DD56D]/30 animate-pulse"
                    style={{ animationDelay: '0.5s' }}
                  />

                  <div
                    className="absolute w-[60%] h-[60%] max-w-[150px] max-h-[150px] sm:max-w-[160px] sm:max-h-[160px] rounded-full bg-[#3DD56D]/40 animate-pulse"
                    style={{ animationDelay: '1s' }}
                  />

                  {/* Central Icon - ORIGINAL COLORS */}
                  <div className="absolute w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-[#2bb757]/60 flex items-center justify-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white">
                      <line x1="18" x2="18" y1="20" y2="10"></line>
                      <line x1="12" x2="12" y1="20" y2="4"></line>
                      <line x1="6" x2="6" y1="20" y2="14"></line>
                    </svg>
                  </div>

                  {/* Energy Flow Lines - ORIGINAL COLORS */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                    <g stroke="rgba(61, 213, 109, 0.4)" fill="none" strokeWidth="1">
                      <path d="M200,100 L100,200 L200,300 L300,200 Z"></path>
                      <path d="M200,100 L300,200"></path>
                      <path d="M100,200 L300,200"></path>
                      <path d="M200,300 L200,100"></path>
                    </g>
                    <g fill="rgba(61, 213, 109, 0.8)">
                      <circle cx="200" cy="100" r="5"></circle>
                      <circle cx="100" cy="200" r="5"></circle>
                      <circle cx="200" cy="300" r="5"></circle>
                      <circle cx="300" cy="200" r="5"></circle>
                    </g>
                  </svg>
                </div>
              </motion.div>

              {/* Brand-Compliant Efficiency Stats */}
              <motion.div
                className={`absolute -top-4 -right-4 rounded-xl p-4 backdrop-blur-sm ${
                  isDarkMode
                    ? 'bg-slate-800/90 shadow-lg'
                    : 'bg-white/90 shadow-lg'
                }`}
                style={{
                  borderWidth: '2px',
                  borderColor: isDarkMode ? '#3dd56d4d' : '#2bb7574d', // 30% opacity
                }}
                initial={{ opacity: 0, y: -20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.2 }}
              >
                <div className="text-3xl font-bold text-[#3dd56d]">98%</div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Efficiency</div>
                <div className="flex items-center mt-1">
                  <Zap className="h-4 w-4 mr-1 text-[#2bb757]" />
                  <span className="text-xs text-[#2bb757]">Active</span>
                </div>
              </motion.div>

              {/* Brand-Compliant Homes Count */}
              <motion.div
                className={`absolute -bottom-4 -right-4 rounded-xl p-4 backdrop-blur-sm ${
                  isDarkMode
                    ? 'bg-slate-800/90 shadow-lg'
                    : 'bg-white/90 shadow-lg'
                }`}
                style={{
                  borderWidth: '2px',
                  borderColor: isDarkMode ? '#3dd56d4d' : '#2bb7574d', // 30% opacity
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.4 }}
              >
                <div className="text-2xl font-bold text-[#3dd56d]">5k+</div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Homes</div>
                <div className="flex items-center mt-1">
                  <Leaf className="h-4 w-4 mr-1 text-[#2bb757]" />
                  <span className="text-xs text-[#2bb757]">Powered</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}