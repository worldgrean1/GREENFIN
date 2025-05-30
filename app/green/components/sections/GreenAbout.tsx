'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Sparkles, ArrowRight } from 'lucide-react';

import { useTheme } from '@/hooks/useTheme';
import { GreanButton } from '@/components/ui/grean-button';
import { GreanCard } from '@/components/ui/grean-card';
import { TypingTextAnimation } from '@/components/animations/text/TypingTextAnimation';
import { useState, useEffect, useRef } from 'react';

// Official Brand CSS from Brand Guidelines
const brandCSS = `
  /* Official GREAN WORLD Brand Colors - 60-30-10 Rule */
  :root {
    --grean-primary: #3dd56d;
    --grean-secondary: #2bb757;
    --grean-accent: #23a455;
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

  /* Smooth Card Animation Keyframes */
  @keyframes slideInFromLeft {
    0% {
      opacity: 0;
      transform: translateX(-100px) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }

  @keyframes slideInFromRight {
    0% {
      opacity: 0;
      transform: translateX(100px) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }

  @keyframes slideInFromBottom {
    0% {
      opacity: 0;
      transform: translateY(80px) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes slideOutToLeft {
    0% {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translateX(-100px) scale(0.95);
    }
  }

  @keyframes slideOutToRight {
    0% {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translateX(100px) scale(0.95);
    }
  }

  @keyframes slideOutToBottom {
    0% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translateY(80px) scale(0.95);
    }
  }

  /* Animation Classes */
  .card-slide-in-left {
    animation: slideInFromLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }

  .card-slide-in-right {
    animation: slideInFromRight 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }

  .card-slide-in-bottom {
    animation: slideInFromBottom 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }

  .card-slide-out-left {
    animation: slideOutToLeft 0.6s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
  }

  .card-slide-out-right {
    animation: slideOutToRight 0.6s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
  }

  .card-slide-out-bottom {
    animation: slideOutToBottom 0.6s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
  }

  /* Initial hidden state */
  .card-hidden {
    opacity: 0;
    transform: translateY(80px) scale(0.95);
  }
`;

// Component props type
interface GreenAboutProps {
  noSeam?: boolean;
}

// Custom hook for intersection observer
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [hasAnimated, options]);

  return { ref, isIntersecting, hasAnimated };
};

export default function GreenAbout({ noSeam = false }: GreenAboutProps) {
  const { isDark } = useTheme();

  // Animation states for different card sections
  const mainCard = useIntersectionObserver();
  const distributionCards = useIntersectionObserver();
  const impactCards = useIntersectionObserver();
  const visionCard = useIntersectionObserver();

  // Inject official brand CSS
  React.useEffect(() => {
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
    <div
      id="green-about"
      className="relative w-full flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-16 lg:py-20 min-h-screen"
    >
      {/* Hero Section */}
      <motion.div
        className="max-w-6xl mx-auto text-center mt-4 sm:mt-6 lg:mt-8 mb-12 sm:mb-16 lg:mb-20 relative z-10 px-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.div
          className={`inline-flex items-center rounded-full px-4 py-2 typography-small mb-6 shadow-lg backdrop-blur-sm ${
            isDark
              ? 'bg-[#3dd56d]/20 text-[#3dd56d] border border-[#3dd56d]/30'
              : 'bg-[#2bb757]/20 text-[#2bb757] border border-[#2bb757]/50'
          }`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          About Grean World
        </motion.div>

        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <h1 className={`text-6xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight flex flex-col sm:flex-row items-center justify-center gap-2 text-center ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            <TypingTextAnimation
              text="Empowering Ethiopia's Energy Transition"
              speed="medium"
              className="inline-block"
            />
          </h1>
        </motion.div>

        <motion.p
          className={`text-lg sm:text-xl md:text-2xl typography-body text-center max-w-3xl mx-auto mt-6 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <span className="text-[#2bb757] font-semibold">Clean, accessible, and sustainable energy</span> for all communities.
        </motion.p>
      </motion.div>



      {/* Card-Style-A Design - Following GreenSolutions Mobile Patterns */}
      <div
        ref={mainCard.ref}
        className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12 lg:mb-16 z-10"
      >
        <div
          className={`relative w-full rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900 min-h-[600px] sm:min-h-[650px] lg:min-h-[700px] transition-all duration-300 ${
            mainCard.hasAnimated
              ? (mainCard.isIntersecting ? 'card-slide-in-left' : 'card-slide-out-left')
              : 'card-hidden'
          }`}
          aria-label="Facebook card featuring Grean World Energy's solar home systems for rural Ethiopia"
          role="img"
        >
          {/* Enhanced SVG Pattern Background - Combining Card-Style-B circles with leaf elements */}
          <div className="absolute inset-0 opacity-20" aria-hidden="true">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              {/* Primary circle pattern from Card-Style-B */}
              <pattern id="circle-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="8" fill="#4ade80" fillOpacity="0.15" />
              </pattern>
              {/* Secondary leaf pattern for texture */}
              <pattern id="leaf-accent-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
                <path
                  d="M40,10 C30,10 20,20 20,30 C20,40 30,50 40,50 C50,50 60,40 60,30 C60,20 50,10 40,10 Z M40,45 C32.5,45 25,37.5 25,30 C25,22.5 32.5,15 40,15 C47.5,15 55,22.5 55,30 C55,37.5 47.5,45 40,45 Z"
                  fill="#4ade80"
                  fillOpacity="0.08"
                />
              </pattern>
              {/* Layered background */}
              <rect width="100%" height="100%" fill="url(#circle-pattern)" />
              <rect width="100%" height="100%" fill="url(#leaf-accent-pattern)" />
            </svg>
          </div>

          <div className="flex flex-col lg:flex-row h-full relative">
            {/* Right: Animated Visual - Extended to bottom */}
            <div className="hidden lg:block absolute top-0 right-0 bottom-0 w-[45%] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-l from-green-600/80 to-transparent z-0"></div>

              {/* Subtle green pattern overlay */}
              <div
                className="absolute inset-0 opacity-20 z-5 h-full w-full"
                style={{
                  backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
                    <svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="30" cy="30" r="2" fill="#16a34a" fill-opacity="0.3"/>
                      <circle cx="10" cy="10" r="1" fill="#16a34a" fill-opacity="0.2"/>
                      <circle cx="50" cy="20" r="1.5" fill="#16a34a" fill-opacity="0.25"/>
                      <circle cx="20" cy="50" r="1" fill="#16a34a" fill-opacity="0.2"/>
                      <path d="M0,0 L15,30 L30,0 Z" fill="#16a34a" fill-opacity="0.1"/>
                      <path d="M30,30 L45,60 L60,30 Z" fill="#16a34a" fill-opacity="0.08"/>
                    </svg>
                  `)}")`,
                  backgroundSize: '60px 60px',
                  backgroundRepeat: 'repeat',
                  minHeight: '100%',
                }}
              ></div>

              <div className="absolute inset-0 z-10 flex items-center justify-center h-full">
                <div className="relative w-full h-full max-w-[300px] max-h-[300px] sm:max-w-[350px] sm:max-h-[350px] lg:max-w-[400px] lg:max-h-[400px]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full max-w-[250px] max-h-[250px] sm:max-w-[280px] sm:max-h-[280px] rounded-full bg-green-600/20 animate-pulse"></div>
                    <div
                      className="absolute w-[75%] h-[75%] max-w-[190px] max-h-[190px] sm:max-w-[210px] sm:max-h-[210px] rounded-full bg-green-600/30 animate-pulse"
                      style={{ animationDelay: '0.5s' }}
                    ></div>
                    <div
                      className="absolute w-[50%] h-[50%] max-w-[125px] max-h-[125px] sm:max-w-[140px] sm:max-h-[140px] rounded-full bg-green-600/40 animate-pulse"
                      style={{ animationDelay: '1s' }}
                    ></div>
                    <div className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-600/50 flex items-center justify-center shadow-lg">
                      <Leaf className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                    {/* SVG lines/dots */}
                    <svg
                      className="absolute inset-0 w-full h-full"
                      viewBox="0 0 400 400"
                    >
                      <g
                        stroke="rgba(61, 213, 109, 0.4)"
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
                      <g fill="rgba(61, 213, 109, 0.8)">
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

            {/* Left Content Area - Enhanced z-index for proper layering */}
            <div className="w-full lg:w-[55%] flex flex-col h-full relative z-30">
              {/* Header Row - Following GreenSolutions pattern */}
              <div className="p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4 flex-shrink-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-600 flex items-center justify-center">
                  <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold tracking-wide text-white">
                    <span className="font-bold">GREAN WORLD</span> Energy
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Sustainable Energy Solutions for Ethiopia
                  </p>
                </div>
              </div>
              <div className="rounded-lg px-3 py-1.5 flex items-center space-x-2 self-start sm:self-auto bg-slate-800/80 backdrop-blur-sm border border-slate-700">
                <Leaf className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                <p className="text-xs sm:text-sm font-medium text-white">Green Innovation Hub</p>
              </div>
            </div>

              {/* Content Section - Added right margin to prevent overlay interference */}
              <div className="flex-grow flex flex-col justify-between space-y-3 sm:space-y-4 md:space-y-6 px-4 sm:px-6 lg:px-8 lg:pr-12 pb-4 sm:pb-6 lg:pb-8 min-h-[500px]">

                {/* Brand-Compliant Business Model Card */}
                <GreanCard
                  pattern="dots"
                  gradient={true}
                  className="text-white p-4 sm:p-5 rounded-2xl shadow-lg overflow-hidden relative"
                  style={{
                    background: `linear-gradient(135deg, #2bb757, #23a455)`
                  }}
                >
                  <div className="relative z-10">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 typography-small mb-2 sm:mb-3 bg-white/20 backdrop-blur-sm text-white">
                      Business Innovation
                    </span>
                    <h4 className="typography-h3 mb-2 sm:mb-3 text-white">Circular Economy Business Model</h4>
                    <p className="typography-body text-white/90">
                      Our innovative circular economy framework helps businesses reduce waste by <span className="text-[#3dd56d] font-semibold">85%</span>, cut costs by <span className="text-[#3dd56d] font-semibold">35%</span>, and improve sustainability metrics while maintaining product quality and performance.
                    </p>
                  </div>
                </GreanCard>

                {/* Brand-Compliant Features & Impact Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <GreanCard className="p-3 sm:p-4 rounded-lg bg-slate-800/50 backdrop-blur-sm border border-slate-700">
                    <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                      <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-[#3dd56d]" />
                      <h5 className="typography-h3 text-sm text-white">
                        Eco Features
                      </h5>
                    </div>
                    <ul className="typography-small space-y-1 sm:space-y-2 list-disc list-inside text-slate-300">
                      <li><span className="text-[#2bb757]">10Wp-350Wp</span> solar home systems</li>
                      <li>Lighting, phone charging, TV support</li>
                      <li>Professional installation included</li>
                      <li>Local maintenance & training</li>
                    </ul>
                  </GreanCard>

                  <GreanCard className="p-3 sm:p-4 rounded-lg bg-slate-800/50 backdrop-blur-sm border border-slate-700">
                    <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                      <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-[#3dd56d]" />
                      <h5 className="typography-h3 text-sm text-white">
                        Environmental Impact
                      </h5>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center">
                        <div className="text-lg sm:text-xl font-bold text-[#3dd56d]">
                          270k+
                        </div>
                        <div className="typography-small text-slate-300">
                          Systems deployed
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg sm:text-xl font-bold text-[#3dd56d]">
                          500+
                        </div>
                        <div className="typography-small text-slate-300">
                          Villages reached
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg sm:text-xl font-bold text-[#2bb757]">
                          200+
                        </div>
                        <div className="typography-small text-slate-300">
                          Women entrepreneurs
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg sm:text-xl font-bold text-[#2bb757]">
                          30k tons
                        </div>
                        <div className="typography-small text-slate-300">
                          CO₂ reduction
                        </div>
                      </div>
                    </div>
                  </GreanCard>
                </div>

                {/* Brand-Compliant Tags & CTA */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-auto pt-4 gap-4 flex-shrink-0 relative z-40 bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 typography-small border-[#3dd56d] text-[#3dd56d] bg-transparent">
                      #Sustainable
                    </div>
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 typography-small border-[#2bb757] text-[#2bb757] bg-transparent">
                      #EcoFriendly
                    </div>
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 typography-small border-[#23a455] text-[#23a455] bg-transparent">
                      #ZeroWaste
                    </div>
                  </div>
                  <GreanButton variant="primary" size="default">
                    Learn More
                  </GreanButton>
                </div>
              </div>
            </div>

            {/* Brand-Compliant Mobile Right Overlay - Only visible on mobile */}
            <div className="lg:hidden w-full relative overflow-hidden flex items-center justify-center min-h-[300px] sm:min-h-[350px] p-4">
              <div className="absolute inset-0 bg-gradient-to-l from-[#2bb757]/80 to-transparent z-0"></div>

              {/* Brand-compliant mobile pattern overlay */}
              <div
                className="absolute inset-0 opacity-20 z-5"
                style={{
                  backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
                    <svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="30" cy="30" r="2" fill="#3dd56d" fill-opacity="0.3"/>
                      <circle cx="10" cy="10" r="1" fill="#2bb757" fill-opacity="0.2"/>
                      <circle cx="50" cy="20" r="1.5" fill="#23a455" fill-opacity="0.25"/>
                      <circle cx="20" cy="50" r="1" fill="#3dd56d" fill-opacity="0.2"/>
                      <path d="M0,0 L15,30 L30,0 Z" fill="#2bb757" fill-opacity="0.1"/>
                      <path d="M30,30 L45,60 L60,30 Z" fill="#23a455" fill-opacity="0.08"/>
                    </svg>
                  `)}")`,
                  backgroundSize: '60px 60px',
                  backgroundRepeat: 'repeat',
                }}
              ></div>

              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <div className="relative w-full h-full max-w-[250px] max-h-[250px]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full max-w-[200px] max-h-[200px] rounded-full bg-[#3dd56d]/20 animate-pulse"></div>
                    <div
                      className="absolute w-[75%] h-[75%] max-w-[150px] max-h-[150px] rounded-full bg-[#2bb757]/30 animate-pulse"
                      style={{ animationDelay: '0.5s' }}
                    ></div>
                    <div
                      className="absolute w-[50%] h-[50%] max-w-[100px] max-h-[100px] rounded-full bg-[#23a455]/40 animate-pulse"
                      style={{ animationDelay: '1s' }}
                    ></div>
                    <div className="absolute w-12 h-12 rounded-full bg-[#2bb757]/50 flex items-center justify-center shadow-lg">
                      <Leaf className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>

      {/* Our Distribution Model Section */}
      <div
        ref={distributionCards.ref}
        className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20 lg:mb-24 z-10"
      >
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            className={`inline-flex items-center rounded-full px-4 py-2 typography-small mb-6 shadow-lg backdrop-blur-sm ${
              isDark
                ? 'bg-[#2bb757]/20 text-[#2bb757] border border-[#2bb757]/30'
                : 'bg-[#3dd56d]/20 text-[#3dd56d] border border-[#3dd56d]/50'
            }`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Distribution Excellence
          </motion.div>

          <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl typography-display text-center mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Our <span className="text-[#3dd56d]">Distribution</span> Model
          </h2>

          <p className={`text-lg sm:text-xl typography-body text-center max-w-3xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Innovative <span className="text-[#2bb757] font-semibold">supply chain solutions</span> connecting rural communities with sustainable energy through strategic partnerships and local networks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Distribution Channel 1 */}
          <div
            className={`relative p-6 sm:p-8 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
              distributionCards.hasAnimated
                ? (distributionCards.isIntersecting ? 'card-slide-in-left' : 'card-slide-out-left')
                : 'card-hidden'
            }`}
            style={{
              background: `linear-gradient(135deg, #3dd56d, #2bb757)`,
              animationDelay: distributionCards.hasAnimated ? '0.1s' : '0s'
            }}
          >
            {/* Pattern Background */}
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <pattern id="circles-pattern-1" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="8" fill="white" fillOpacity="0.15" />
                  <circle cx="10" cy="10" r="3" fill="white" fillOpacity="0.1" />
                  <circle cx="30" cy="30" r="3" fill="white" fillOpacity="0.1" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#circles-pattern-1)" />
              </svg>
            </div>

            <div className="relative z-10 text-center text-white">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="typography-h3 mb-3 text-white">Local Partnerships</h3>
              <p className="typography-body text-white/90 mb-4">
                Working with <span className="font-semibold">200+ local agents</span> across rural Ethiopia to ensure reliable distribution and maintenance support.
              </p>
              <div className="text-2xl font-bold text-white">200+</div>
              <div className="typography-small text-white/80">Active Partners</div>
            </div>
          </div>

          {/* Distribution Channel 2 */}
          <div
            className={`relative p-6 sm:p-8 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
              distributionCards.hasAnimated
                ? (distributionCards.isIntersecting ? 'card-slide-in-bottom' : 'card-slide-out-bottom')
                : 'card-hidden'
            }`}
            style={{
              background: `linear-gradient(135deg, #2bb757, #23a455)`,
              animationDelay: distributionCards.hasAnimated ? '0.3s' : '0s'
            }}
          >
            {/* Pattern Background */}
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <pattern id="dots-pattern-1" width="60" height="60" patternUnits="userSpaceOnUse">
                  <circle cx="30" cy="30" r="3" fill="white" fillOpacity="0.3"/>
                  <circle cx="10" cy="10" r="2" fill="white" fillOpacity="0.2"/>
                  <circle cx="50" cy="10" r="2" fill="white" fillOpacity="0.2"/>
                  <circle cx="10" cy="50" r="2" fill="white" fillOpacity="0.2"/>
                  <circle cx="50" cy="50" r="2" fill="white" fillOpacity="0.2"/>
                </pattern>
                <rect width="100%" height="100%" fill="url(#dots-pattern-1)" />
              </svg>
            </div>

            <div className="relative z-10 text-center text-white">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowRight className="w-8 h-8 text-white" />
              </div>
              <h3 className="typography-h3 mb-3 text-white">Direct Sales</h3>
              <p className="typography-body text-white/90 mb-4">
                Direct-to-consumer sales through <span className="font-semibold">mobile units</span> and regional distribution centers.
              </p>
              <div className="text-2xl font-bold text-white">15</div>
              <div className="typography-small text-white/80">Distribution Centers</div>
            </div>
          </div>

          {/* Distribution Channel 3 */}
          <div
            className={`relative p-6 sm:p-8 rounded-2xl shadow-lg overflow-hidden md:col-span-2 lg:col-span-1 transition-all duration-300 ${
              distributionCards.hasAnimated
                ? (distributionCards.isIntersecting ? 'card-slide-in-right' : 'card-slide-out-right')
                : 'card-hidden'
            }`}
            style={{
              background: `linear-gradient(135deg, #23a455, #1e7e34)`,
              animationDelay: distributionCards.hasAnimated ? '0.5s' : '0s'
            }}
          >
            {/* Pattern Background */}
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <pattern id="waves-pattern-1" width="100" height="20" patternUnits="userSpaceOnUse">
                  <path d="M0 10 Q25 0 50 10 T100 10" stroke="white" strokeWidth="2" fill="none" opacity="0.3"/>
                  <path d="M0 15 Q25 5 50 15 T100 15" stroke="white" strokeWidth="1" fill="none" opacity="0.2"/>
                </pattern>
                <rect width="100%" height="100%" fill="url(#waves-pattern-1)" />
              </svg>
            </div>

            <div className="relative z-10 text-center text-white">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="typography-h3 mb-3 text-white">Digital Platform</h3>
              <p className="typography-body text-white/90 mb-4">
                Online ordering and <span className="font-semibold">mobile app</span> for easy access to products and services.
              </p>
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="typography-small text-white/80">Online Access</div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Impact Section */}
      <div
        ref={impactCards.ref}
        className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20 lg:mb-24 z-10"
      >
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            className={`inline-flex items-center rounded-full px-4 py-2 typography-small mb-6 shadow-lg backdrop-blur-sm ${
              isDark
                ? 'bg-[#23a455]/20 text-[#23a455] border border-[#23a455]/30'
                : 'bg-[#2bb757]/20 text-[#2bb757] border border-[#2bb757]/50'
            }`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Leaf className="w-4 h-4 mr-2" />
            Measurable Results
          </motion.div>

          <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl typography-display text-center mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Our <span className="text-[#3dd56d]">Impact</span>
          </h2>

          <p className={`text-lg sm:text-xl typography-body text-center max-w-3xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Transforming lives through <span className="text-[#2bb757] font-semibold">sustainable energy access</span> and creating lasting positive change in Ethiopian communities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12">
          {/* Impact Metric 1 */}
          <GreanCard
            className={`p-6 text-center transition-all duration-300 ${
              impactCards.hasAnimated
                ? (impactCards.isIntersecting ? 'card-slide-in-left' : 'card-slide-out-left')
                : 'card-hidden'
            }`}
            style={{ animationDelay: impactCards.hasAnimated ? '0.1s' : '0s' }}
          >
            <div className="text-4xl sm:text-5xl font-bold text-[#3dd56d] mb-2">270k+</div>
            <div className="typography-h3 mb-2 text-gray-900 dark:text-white">Solar Systems</div>
            <div className="typography-small text-gray-600 dark:text-gray-400">Deployed across Ethiopia</div>
          </GreanCard>

          {/* Impact Metric 2 */}
          <GreanCard
            className={`p-6 text-center transition-all duration-300 ${
              impactCards.hasAnimated
                ? (impactCards.isIntersecting ? 'card-slide-in-bottom' : 'card-slide-out-bottom')
                : 'card-hidden'
            }`}
            style={{ animationDelay: impactCards.hasAnimated ? '0.2s' : '0s' }}
          >
            <div className="text-4xl sm:text-5xl font-bold text-[#2bb757] mb-2">500+</div>
            <div className="typography-h3 mb-2 text-gray-900 dark:text-white">Villages</div>
            <div className="typography-small text-gray-600 dark:text-gray-400">Connected to clean energy</div>
          </GreanCard>

          {/* Impact Metric 3 */}
          <GreanCard
            className={`p-6 text-center transition-all duration-300 ${
              impactCards.hasAnimated
                ? (impactCards.isIntersecting ? 'card-slide-in-bottom' : 'card-slide-out-bottom')
                : 'card-hidden'
            }`}
            style={{ animationDelay: impactCards.hasAnimated ? '0.3s' : '0s' }}
          >
            <div className="text-4xl sm:text-5xl font-bold text-[#23a455] mb-2">1.2M</div>
            <div className="typography-h3 mb-2 text-gray-900 dark:text-white">People</div>
            <div className="typography-small text-gray-600 dark:text-gray-400">Lives improved</div>
          </GreanCard>

          {/* Impact Metric 4 */}
          <GreanCard
            className={`p-6 text-center transition-all duration-300 ${
              impactCards.hasAnimated
                ? (impactCards.isIntersecting ? 'card-slide-in-right' : 'card-slide-out-right')
                : 'card-hidden'
            }`}
            style={{ animationDelay: impactCards.hasAnimated ? '0.4s' : '0s' }}
          >
            <div className="text-4xl sm:text-5xl font-bold text-[#3dd56d] mb-2">30k</div>
            <div className="typography-h3 mb-2 text-gray-900 dark:text-white">Tons CO₂</div>
            <div className="typography-small text-gray-600 dark:text-gray-400">Emissions reduced</div>
          </GreanCard>
        </div>

        {/* Impact Stories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GreanCard
            pattern="circles"
            className={`p-6 sm:p-8 transition-all duration-300 ${
              impactCards.hasAnimated
                ? (impactCards.isIntersecting ? 'card-slide-in-left' : 'card-slide-out-left')
                : 'card-hidden'
            }`}
            style={{ animationDelay: impactCards.hasAnimated ? '0.5s' : '0s' }}
          >
            <h3 className="typography-h3 mb-4 text-[#3dd56d]">Economic Empowerment</h3>
            <p className="typography-body mb-4 text-gray-700 dark:text-gray-300">
              Our solar solutions have enabled <span className="text-[#2bb757] font-semibold">200+ women entrepreneurs</span> to start and grow their businesses, creating sustainable income streams in rural communities.
            </p>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#2bb757]">200+</div>
                <div className="typography-small text-gray-600 dark:text-gray-400">Women Entrepreneurs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#23a455]">$2.5M</div>
                <div className="typography-small text-gray-600 dark:text-gray-400">Income Generated</div>
              </div>
            </div>
          </GreanCard>

          <GreanCard
            pattern="dots"
            className={`p-6 sm:p-8 transition-all duration-300 ${
              impactCards.hasAnimated
                ? (impactCards.isIntersecting ? 'card-slide-in-right' : 'card-slide-out-right')
                : 'card-hidden'
            }`}
            style={{ animationDelay: impactCards.hasAnimated ? '0.6s' : '0s' }}
          >
            <h3 className="typography-h3 mb-4 text-[#2bb757]">Educational Impact</h3>
            <p className="typography-body mb-4 text-gray-700 dark:text-gray-300">
              Solar lighting has extended study hours for <span className="text-[#3dd56d] font-semibold">50,000+ students</span>, improving educational outcomes and creating brighter futures.
            </p>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#3dd56d]">50k+</div>
                <div className="typography-small text-gray-600 dark:text-gray-400">Students Benefited</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#23a455]">85%</div>
                <div className="typography-small text-gray-600 dark:text-gray-400">Grade Improvement</div>
              </div>
            </div>
          </GreanCard>
        </div>
      </div>

      {/* Our Vision Section */}
      <div
        ref={visionCard.ref}
        className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20 lg:mb-24 z-10"
      >
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            className={`inline-flex items-center rounded-full px-4 py-2 typography-small mb-6 shadow-lg backdrop-blur-sm ${
              isDark
                ? 'bg-[#3dd56d]/20 text-[#3dd56d] border border-[#3dd56d]/30'
                : 'bg-[#23a455]/20 text-[#23a455] border border-[#23a455]/50'
            }`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Future Forward
          </motion.div>

          <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl typography-display text-center mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Our <span className="text-[#3dd56d]">Vision</span>
          </h2>

          <p className={`text-lg sm:text-xl typography-body text-center max-w-3xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Building a <span className="text-[#2bb757] font-semibold">sustainable energy future</span> where every Ethiopian community has access to clean, reliable, and affordable power.
          </p>
        </div>

        <div
          className={`relative p-8 sm:p-12 lg:p-16 text-center rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${
            visionCard.hasAnimated
              ? (visionCard.isIntersecting ? 'card-slide-in-bottom' : 'card-slide-out-bottom')
              : 'card-hidden'
          }`}
          style={{
            background: `linear-gradient(135deg, #3dd56d, #2bb757, #23a455)`,
            animationDelay: visionCard.hasAnimated ? '0.2s' : '0s'
          }}
        >
          {/* Pattern Background */}
          <div className="absolute inset-0 opacity-15">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <pattern id="waves-pattern-vision" width="100" height="20" patternUnits="userSpaceOnUse">
                <path d="M0 10 Q25 0 50 10 T100 10" stroke="white" strokeWidth="2" fill="none" opacity="0.4"/>
                <path d="M0 15 Q25 5 50 15 T100 15" stroke="white" strokeWidth="1" fill="none" opacity="0.3"/>
                <path d="M0 5 Q25 -5 50 5 T100 5" stroke="white" strokeWidth="1" fill="none" opacity="0.2"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#waves-pattern-vision)" />
            </svg>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-white">
            <h3 className="text-2xl sm:text-3xl md:text-4xl typography-display mb-6 text-white">
              Transforming <span className="text-yellow-300">20 Villages</span> by 2030
            </h3>

            <p className="text-lg sm:text-xl typography-body mb-8 text-white/90">
              Our ambitious goal is to create 20 fully sustainable green villages, each powered entirely by renewable energy and serving as models for rural development across Africa.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-yellow-300 mb-2">100%</div>
                <div className="typography-small text-white/80">Renewable Energy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-yellow-300 mb-2">20</div>
                <div className="typography-small text-white/80">Green Villages</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-yellow-300 mb-2">2030</div>
                <div className="typography-small text-white/80">Target Year</div>
              </div>
            </div>

            <GreanButton
              variant="outline"
              size="lg"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              Join Our Mission
              <ArrowRight className="ml-2 h-5 w-5" />
            </GreanButton>
          </div>
        </div>
      </div>


    </div>
  );
}
