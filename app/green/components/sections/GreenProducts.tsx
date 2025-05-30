'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  SunMedium,
  Flame,
  Battery,
  Star,
  Zap,
  Calculator,
  BarChart2,
  ArrowRight,
  Shield,
  Leaf,
  Award,
  TrendingUp,
  Users,
  Droplets,
  Lightbulb,
  Settings,
  CheckCircle,
  Clock,
  Gauge,
  Search,
  Filter,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';

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

  /* GreenProducts Animation Keyframes */
  @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: scale(0.3) translateY(50px);
    }
    50% {
      opacity: 1;
      transform: scale(1.05) translateY(-10px);
    }
    70% {
      transform: scale(0.95) translateY(5px);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes slideUpElastic {
    0% {
      opacity: 0;
      transform: translateY(100px) scale(0.9);
    }
    60% {
      opacity: 1;
      transform: translateY(-10px) scale(1.02);
    }
    80% {
      transform: translateY(5px) scale(0.98);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes waveSequential {
    0% {
      opacity: 0;
      transform: translateY(60px) rotateX(90deg);
    }
    50% {
      opacity: 0.8;
      transform: translateY(-5px) rotateX(0deg);
    }
    100% {
      opacity: 1;
      transform: translateY(0) rotateX(0deg);
    }
  }

  @keyframes slideDown {
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(100px);
    }
  }

  @keyframes fadeInScale {
    0% {
      opacity: 0;
      transform: scale(0.8);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }

  /* Animation Classes */
  .card-bounce-in {
    animation: bounceIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }

  .card-slide-up-elastic {
    animation: slideUpElastic 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }

  .card-wave-sequential {
    animation: waveSequential 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }

  .card-slide-down {
    animation: slideDown 0.6s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
  }

  .card-fade-in-scale {
    animation: fadeInScale 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }

  .card-pulse {
    animation: pulse 2s infinite;
  }

  /* Initial hidden state */
  .card-hidden {
    opacity: 0;
    transform: translateY(80px) scale(0.95);
  }
`;

import { essentialProducts, getProducts, Product } from '../../data/products';
import Image from 'next/image';
import ProductImagePlaceholder from '@/components/ui/ProductImagePlaceholder';
import { useTheme } from '@/hooks/useTheme';
import { EnhancedProductCard } from '../cards/EnhancedProductCard';
import { MirtStoveCard } from '@/components/mirt-stove-card';
import { AdvancedProductComparison } from '../comparison/AdvancedProductComparison';
import { TypingTextAnimation } from '@/components/animations/text/TypingTextAnimation';



/**
 * Helper function to get product image path
 */
const getProductImage = (category: string, subcategory?: string): string => {
  const imageMap: { [key: string]: string } = {
    'cooking-lower': '/images/products/improved-stove.jpg',
    'cooking-higher': '/images/products/electric-cooktop.jpg',
    'solar-pv': '/images/products/solar-panel-system.jpg',
    pue: '/images/products/solar-grain-mill.jpg',
    'water-pumping': '/images/products/solar-water-pump.jpg',
    'street-lights': '/images/products/solar-street-light.jpg',
    'power-backup': '/images/products/backup-system.jpg',
    advisory: '/images/products/consultation-service.jpg',
  };

  return imageMap[category] || '/images/products/default-product.jpg';
};

/**
 * Enhanced helper function to get category styling with distinctive colors
 */
const getCategoryStyle = (category: string, isDark: boolean = false) => {
  const styleMap: {
    [key: string]: {
      bg: string;
      bgSolid: string;
      text: string;
      textLight: string;
      border: string;
      icon: React.ReactNode;
      gradient: string;
      hoverGradient: string;
      shadowColor: string;
    };
  } = {
    'cooking-higher': {
      bg: 'bg-gradient-to-br from-purple-500/20 to-violet-600/20',
      bgSolid: isDark ? 'bg-purple-600' : 'bg-purple-500',
      text: isDark ? 'text-purple-400' : 'text-purple-600',
      textLight: 'text-purple-300',
      border: 'border-purple-400/40',
      icon: <Zap className="w-4 h-4" />,
      gradient: 'from-purple-500 to-violet-600',
      hoverGradient: 'from-purple-600 to-violet-700',
      shadowColor: 'shadow-purple-500/30',
    },
    'solar-pv': {
      bg: 'bg-gradient-to-br from-amber-400/20 to-orange-500/20',
      bgSolid: isDark ? 'bg-amber-500' : 'bg-amber-400',
      text: isDark ? 'text-amber-400' : 'text-amber-600',
      textLight: 'text-amber-300',
      border: 'border-amber-400/40',
      icon: <SunMedium className="w-4 h-4" />,
      gradient: 'from-amber-400 to-orange-500',
      hoverGradient: 'from-amber-500 to-orange-600',
      shadowColor: 'shadow-amber-500/30',
    },
    pue: {
      bg: 'bg-gradient-to-br from-emerald-500/20 to-teal-600/20',
      bgSolid: isDark ? 'bg-emerald-500' : 'bg-emerald-600',
      text: isDark ? 'text-emerald-400' : 'text-emerald-600',
      textLight: 'text-emerald-300',
      border: 'border-emerald-400/40',
      icon: <Settings className="w-4 h-4" />,
      gradient: 'from-emerald-500 to-teal-600',
      hoverGradient: 'from-emerald-600 to-teal-700',
      shadowColor: 'shadow-emerald-500/30',
    },
    'street-lights': {
      bg: 'bg-gradient-to-br from-yellow-400/20 to-amber-500/20',
      bgSolid: isDark ? 'bg-yellow-500' : 'bg-yellow-400',
      text: isDark ? 'text-yellow-400' : 'text-yellow-600',
      textLight: 'text-yellow-300',
      border: 'border-yellow-400/40',
      icon: <Lightbulb className="w-4 h-4" />,
      gradient: 'from-yellow-400 to-amber-500',
      hoverGradient: 'from-yellow-500 to-amber-600',
      shadowColor: 'shadow-yellow-500/30',
    },
    'power-backup': {
      bg: 'bg-gradient-to-br from-blue-500/20 to-indigo-600/20',
      bgSolid: isDark ? 'bg-blue-500' : 'bg-blue-600',
      text: isDark ? 'text-blue-400' : 'text-blue-600',
      textLight: 'text-blue-300',
      border: 'border-blue-400/40',
      icon: <Battery className="w-4 h-4" />,
      gradient: 'from-blue-500 to-indigo-600',
      hoverGradient: 'from-blue-600 to-indigo-700',
      shadowColor: 'shadow-blue-500/30',
    },
    advisory: {
      bg: 'bg-gradient-to-br from-slate-500/20 to-gray-600/20',
      bgSolid: isDark ? 'bg-slate-500' : 'bg-slate-600',
      text: isDark ? 'text-slate-400' : 'text-slate-600',
      textLight: 'text-slate-300',
      border: 'border-slate-400/40',
      icon: <Users className="w-4 h-4" />,
      gradient: 'from-slate-500 to-gray-600',
      hoverGradient: 'from-slate-600 to-gray-700',
      shadowColor: 'shadow-slate-500/30',
    },
  };

  return styleMap[category] || styleMap['advisory'];
};

/**
 * Enhanced Badge Component
 */
const ProductBadge = ({
  badge,
  sale,
}: {
  badge: string | null;
  sale: boolean;
}) => {
  if (!badge && !sale) return null;

  const badgeText = sale ? 'SALE' : badge;
  const badgeStyle = sale
    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse'
    : badge === 'POPULAR'
      ? 'bg-gradient-to-r from-[#3DD56D] to-emerald-500 text-white'
      : badge === 'PREMIUM'
        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
        : 'bg-gradient-to-r from-[#3DD56D] to-[#2bb757] text-white';

  return (
    <div
      className={`absolute top-4 right-4 z-20 px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${badgeStyle}`}
    >
      {badgeText}
    </div>
  );
};

/**
 * Efficiency Progress Bar Component
 */
const EfficiencyBar = ({
  efficiency,
  isDark,
}: {
  efficiency?: string;
  isDark: boolean;
}) => {
  if (!efficiency) return null;

  const percentage = parseInt(efficiency.match(/\d+/)?.[0] || '0');

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1">
        <span className={isDark ? 'text-gray-400' : 'text-slate-400'}>
          Efficiency
        </span>
        <span
          className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}
        >
          {efficiency}
        </span>
      </div>
      <div
        className={`w-full rounded-full h-2 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}
      >
        <div
          className="bg-gradient-to-r from-[#3DD56D] to-emerald-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

// Solar Home System Card Component - Original from Backup
function SolarHomeSystemCard() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [animatedCells, setAnimatedCells] = useState<number[]>([])

  useEffect(() => {
    if (inView) {
      const interval = setInterval(() => {
        setAnimatedCells((prev) => {
          if (prev.length >= 16) {
            clearInterval(interval)
            return prev
          }
          return [...prev, prev.length]
        })
      }, 50)

      return () => clearInterval(interval)
    }
  }, [inView])

  return (
    <section ref={ref} className="w-full max-w-7xl mx-auto mb-6 sm:mb-8 lg:mb-10 px-4 sm:px-6 lg:px-8 z-10 relative">
      <div
        className={cn(
          "w-full rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden relative bg-gradient-to-b from-slate-950 to-slate-900",
          "transform transition-all duration-1000",
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
        )}
        aria-label="Premium card featuring Solar Home System 200W"
        role="img"
      >
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="solar-home-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="8" fill="#4ade80" fillOpacity="0.3"></circle>
            </pattern>
            <rect width="100%" height="100%" fill="url(#solar-home-pattern)"></rect>
          </svg>
        </div>

        <div className="flex flex-col relative z-10">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-[45%] relative overflow-hidden flex items-center justify-center min-h-[200px] sm:min-h-[250px] lg:min-h-0 p-4">
              <div className="absolute inset-0 bg-gradient-to-r from-[#2bb757]/80 to-transparent z-0"></div>

              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <div className="relative w-full h-full max-w-[350px] max-h-[300px] sm:max-w-[400px] sm:max-h-[350px]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full h-full max-w-[280px] max-h-[200px] sm:max-w-[350px] sm:max-h-[250px] md:max-w-[400px] md:max-h-[300px] rounded-xl overflow-hidden shadow-2xl z-0">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3DD56D]/30 to-[#2bb757]/30 opacity-30 blur-sm rounded-xl"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-[#0c253a] to-[#071221] border border-slate-700/50"></div>

                      <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-1 p-2 sm:p-3">
                        {[...Array(16)].map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              "rounded-sm relative overflow-hidden transition-all duration-500",
                              animatedCells.includes(i) ? "bg-[#2bb757]/70" : "bg-slate-800/50",
                            )}
                            style={{
                              transitionDelay: `${i * 50}ms`,
                            }}
                          />
                        ))}
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-b from-[#3DD56D]/10 to-transparent opacity-20"></div>
                    </div>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-full h-full max-w-[250px] max-h-[250px] sm:max-w-[280px] sm:max-h-[280px] rounded-full bg-[#3DD56D]/20 animate-pulse"></div>
                    <div
                      className="absolute w-[80%] h-[80%] max-w-[200px] max-h-[200px] sm:max-w-[220px] sm:max-h-[220px] rounded-full bg-[#3DD56D]/30 animate-pulse"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                    <div
                      className="absolute w-[60%] h-[60%] max-w-[150px] max-h-[150px] sm:max-w-[160px] sm:max-h-[160px] rounded-full bg-[#3DD56D]/40 animate-pulse"
                      style={{ animationDelay: "1s" }}
                    ></div>

                    <div className="absolute w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-[#2bb757]/60 flex items-center justify-center shadow-lg">
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
                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white"
                      >
                        <line x1="18" x2="18" y1="20" y2="10"></line>
                        <line x1="12" x2="12" y1="20" y2="4"></line>
                        <line x1="6" x2="6" y1="20" y2="14"></line>
                      </svg>
                    </div>

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
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[55%] p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 mb-3 bg-green-600 text-white border-green-600/30">Solar Energy</span>
                  <h3 className="text-2xl sm:text-3xl font-black leading-tight mb-4 text-white">
                    Solar Home System 200W
                  </h3>
                  <p className="text-base sm:text-lg font-medium text-slate-300">
                    Our flagship solar home system with everything needed to power a small household, including
                    lighting, phone charging, and TV capability.
                  </p>
                </div>

                <div className="p-4 rounded-lg py-4 shadow-lg bg-slate-800/50 backdrop-blur-sm border border-slate-700">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-2">
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-green-400">200W</div>
                      <div className="text-xs text-slate-300">Panel Power</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-green-400">2 yrs</div>
                      <div className="text-xs text-slate-300">Warranty</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-green-400">ETB 16,499</div>
                      <div className="text-xs text-slate-300">Price</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-4 sm:p-5 rounded-lg shadow-lg overflow-hidden relative">
                  <div className="relative z-10">
                    <h4 className="text-lg sm:text-xl font-semibold text-white mb-3">Key Features:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-white/20 p-2 rounded-full">
                          <SunMedium className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <span className="text-sm sm:text-base text-white font-medium">200W solar panel</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="bg-white/20 p-2 rounded-full">
                          <Battery className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <span className="text-sm sm:text-base text-white font-medium">Battery backup</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="bg-white/20 p-2 rounded-full">
                          <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <span className="text-sm sm:text-base text-white font-medium">LED lights &amp; charging</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="bg-white/20 p-2 rounded-full">
                          <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <span className="text-sm sm:text-base text-white font-medium">2-year local support</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 gap-4 flex-shrink-0">
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-green-500 text-green-400 bg-transparent">
                      #SolarHome
                    </span>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-green-500 text-green-400 bg-transparent">
                      #CleanEnergy
                    </span>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-green-500 text-green-400 bg-transparent">
                      #OffGrid
                    </span>
                  </div>

                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-green-600 hover:bg-green-700 text-white">
                    See Details <ArrowRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
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

// Component props type
interface GreenProductsProps {
  noSeam?: boolean;
}

export default function GreenProducts({ noSeam = false }: GreenProductsProps) {
  const { effectiveTheme, isDark, isLight } = useTheme();

  // Animation states for different sections
  const filtersSection = useIntersectionObserver();
  const productGrid = useIntersectionObserver();
  const mirtStoveSection = useIntersectionObserver();
  const comparisonSection = useIntersectionObserver();

  // Inject brand CSS
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = brandCSS;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // State for products and loading
  const [products, setProducts] = useState<Product[]>(essentialProducts);
  const [isLoadingFullData, setIsLoadingFullData] = useState(false);
  const [hasLoadedFullData, setHasLoadedFullData] = useState(false);

  // Centralized State for Search, Filter, Sort
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState<'popularity' | 'price' | 'newest'>(
    'popularity'
  );
  const collectionRef = useRef<HTMLDivElement>(null);

  // Load full product data when user interacts with filters or search
  const loadFullProductData = async () => {
    if (hasLoadedFullData || isLoadingFullData) return;

    setIsLoadingFullData(true);
    try {
      const fullProducts = await getProducts();
      setProducts(fullProducts);
      setHasLoadedFullData(true);
    } catch (error) {
      console.error('Failed to load full product data:', error);
    } finally {
      setIsLoadingFullData(false);
    }
  };

  // Load full data when user starts searching or filtering
  useEffect(() => {
    if (search.length > 0 || category !== 'All') {
      loadFullProductData();
    }
  }, [search, category]);

  // Category mapping for filtering
  const categoryMapping: { [key: string]: string[] } = {
    All: [],
    Cooking: ['cooking-lower', 'cooking-higher'],
    'Solar PV': ['solar-pv'],
    PUE: ['pue'],
    'Water Pumping': ['water-pumping'],
    'Street Lights': ['street-lights'],
    'Power Backup': ['power-backup'],
    Advisory: ['advisory'],
  };

  const filteredProducts = products
    .filter(p => {
      if (category === 'All') return true;
      const allowedCategories = categoryMapping[category] || [];
      return allowedCategories.includes(p.category);
    })
    .filter(
      p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        (p.tags &&
          p.tags.some(tag =>
            tag.toLowerCase().includes(search.toLowerCase())
          )) ||
        (p.subcategory &&
          p.subcategory.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sort === 'price') return a.price - b.price;
      if (sort === 'newest') return 0; // Placeholder, add date if available
      return b.rating - a.rating;
    });

  // --- Smooth Scroll to Collection ---
  const handleSearchOrFilter = () => {
    setTimeout(() => {
      if (collectionRef.current) {
        collectionRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 100);
  };

  return (
    <div
      id="green-products"
      className="relative w-full flex flex-col items-center justify-center px-4 sm:px-6 py-6 sm:py-8 lg:py-12"
    >
      <div className="w-full flex flex-col items-center max-w-7xl mx-auto">
      {/* Hero Section with Loop Text Animation */}
      <div className="max-w-4xl mx-auto text-center mt-2 sm:mt-4 lg:mt-6 mb-6 sm:mb-8 lg:mb-10 relative z-10">
        <div className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium mb-4 shadow-lg typography-small ${
          isDark
            ? 'bg-[#3DD56D]/20 text-[#3DD56D] border border-[#3DD56D]/20'
            : 'bg-[#2bb757]/20 text-[#2bb757] border border-[#2bb757]/20'
        }`}>
          Grean World Products
        </div>
        <div className="mb-3">
          <h1 className={`text-6xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight flex flex-col sm:flex-row items-center justify-center gap-2 text-center ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            <TypingTextAnimation
              text="Find Your Perfect Energy Solution"
              speed="medium"
              className="inline-block"
            />
          </h1>
        </div>
        <div className="flex flex-col items-center gap-2 mb-4">
          <p
            className={`typography-h2 text-xl md:text-2xl ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Browse Our Collection
          </p>
          <span
            className={`typography-body text-base ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Explore Our Products
          </span>
        </div>
        <button
          onClick={() => {
            if (collectionRef.current) {
              collectionRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            }
          }}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-white font-bold shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 mt-2 bg-gradient-to-r from-[#3DD56D] to-[#2bb757] hover:shadow-[#3DD56D]/30 focus:ring-[#3DD56D]"
        >
          <ArrowRight className="h-5 w-5" /> Browse Collection
        </button>
      </div>

      {/* Premium Solar Home System 200W Card - Original from Backup */}
      <SolarHomeSystemCard />

      {/* Premium Mirt Stove Deluxe Card - Original from Backup */}
      <div
        ref={mirtStoveSection.ref}
        className={`transition-all duration-300 ${
          mirtStoveSection.hasAnimated
            ? (mirtStoveSection.isIntersecting ? 'card-slide-up-elastic' : 'card-slide-down')
            : 'card-hidden'
        }`}
        style={{ animationDelay: mirtStoveSection.hasAnimated ? '0.2s' : '0s' }}
      >
        <MirtStoveCard />
      </div>

      {/* Enhanced All Products Section */}
      <section ref={collectionRef} className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 opacity-5" aria-hidden="true">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="collection-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="2" fill="#3DD56D" fillOpacity="0.4"/>
              <circle cx="10" cy="10" r="1" fill="#3DD56D" fillOpacity="0.3"/>
              <circle cx="50" cy="20" r="1.5" fill="#3DD56D" fillOpacity="0.35"/>
              <circle cx="20" cy="50" r="1" fill="#3DD56D" fillOpacity="0.3"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#collection-pattern)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Enhanced Header Section */}
          <div className="text-center mb-12 sm:mb-16">
            {/* Premium Badge */}
            <motion.div
              className={`inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-bold mb-6 shadow-2xl backdrop-blur-sm border ${
                isDark
                  ? 'bg-gradient-to-r from-[#3DD56D]/20 to-[#2bb757]/20 text-[#3DD56D] border-[#3DD56D]/40'
                  : 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200/60'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isDark ? 'bg-[#3DD56D]/20' : 'bg-green-100'
              }`}>
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
                  className="text-current"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <span>Premium Product Collection</span>
              <div className="w-2 h-2 bg-[#3DD56D] rounded-full animate-pulse" />
            </motion.div>

            {/* Enhanced Title */}
            <motion.h2
              className={`typography-display text-4xl sm:text-5xl lg:text-6xl mb-6 leading-tight ${
                isDark
                  ? 'text-white drop-shadow-2xl'
                  : 'text-gray-900'
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Browse Our{' '}
              <span className="text-[#3DD56D]">Collection</span>
            </motion.h2>

            {/* Enhanced Description */}
            <motion.div
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p
                className={`typography-body text-lg sm:text-xl mb-4 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Discover sustainable energy solutions that power communities and protect our planet
              </p>
              <div className={`flex flex-wrap justify-center gap-4 text-sm ${
                isDark ? 'text-gray-400' : 'text-slate-500'
              }`}>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Premium Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span>2+ Year Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-500" />
                  <span>Local Support</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Enhanced Search & Filter Section */}
          <div
            ref={filtersSection.ref}
            className={`mb-12 transition-all duration-300 ${
              filtersSection.hasAnimated
                ? (filtersSection.isIntersecting ? 'card-bounce-in' : 'card-slide-down')
                : 'card-hidden'
            }`}
          >
            {/* Enhanced Search & Discover */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
                {/* Enhanced Search Input */}
                <div className="relative w-full max-w-lg">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search
                      className={`h-5 w-5 ${
                        isDark ? 'text-gray-400' : 'text-green-600'
                      }`}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Search products, features, or tags..."
                    value={search}
                    onChange={e => {
                      setSearch(e.target.value);
                      handleSearchOrFilter();
                    }}
                    className={`w-full pl-12 pr-12 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#3DD56D]/20 focus:border-[#3DD56D] shadow-lg backdrop-blur-sm ${
                      isDark
                        ? 'bg-slate-800/90 border-slate-700/60 text-white placeholder-gray-400'
                        : 'bg-white/90 border-green-200/60 text-green-900 placeholder-green-600'
                    }`}
                  />
                  {search && (
                    <button
                      onClick={() => {
                        setSearch('');
                        handleSearchOrFilter();
                      }}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      <div className={`p-1 rounded-full transition-colors ${
                        isDark
                          ? 'hover:bg-slate-700 text-gray-400 hover:text-white'
                          : 'hover:bg-green-100 text-green-600 hover:text-green-800'
                      }`}>
                        <X className="h-4 w-4" />
                      </div>
                    </button>
                  )}
                </div>

                {/* Enhanced Sort Options */}
                <div className="relative">
                  <select
                    value={sort}
                    onChange={e => {
                      setSort(
                        e.target.value as 'popularity' | 'price' | 'newest'
                      );
                      handleSearchOrFilter();
                    }}
                    className={`appearance-none pl-4 pr-12 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#3DD56D]/20 focus:border-[#3DD56D] shadow-lg backdrop-blur-sm min-w-[200px] ${
                      isDark
                        ? 'bg-slate-800/90 border-slate-700/60 text-white'
                        : 'bg-white/90 border-green-200/60 text-green-900'
                    }`}
                  >
                    <option value="popularity">🔥 Most Popular</option>
                    <option value="price">💰 Price: Low to High</option>
                    <option value="newest">✨ Latest Products</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <SlidersHorizontal
                      className={`h-4 w-4 ${
                        isDark ? 'text-gray-400' : 'text-green-600'
                      }`}
                    />
                  </div>
                </div>

                {/* Quick Stats */}
                <div className={`flex items-center gap-4 px-4 py-2 rounded-xl ${
                  isDark ? 'bg-slate-800/50' : 'bg-green-50/80'
                }`}>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${isDark ? 'text-[#3DD56D]' : 'text-green-700'}`}>
                      {filteredProducts.length}
                    </div>
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-green-600'}`}>
                      Products
                    </div>
                  </div>
                  <div className={`w-px h-8 ${isDark ? 'bg-slate-700' : 'bg-green-200'}`} />
                  <div className="text-center">
                    <div className={`text-lg font-bold ${isDark ? 'text-[#3DD56D]' : 'text-green-700'}`}>
                      7+
                    </div>
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-green-600'}`}>
                      Categories
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Filter by Category */}
            <div className="text-center">
              <div className="inline-flex items-center gap-3 mb-8">
                <div className={`p-2 rounded-xl ${isDark ? 'bg-[#3DD56D]/20' : 'bg-green-100'}`}>
                  <Filter
                    className={`h-5 w-5 ${
                      isDark ? 'text-[#3DD56D]' : 'text-green-700'
                    }`}
                  />
                </div>
                <h3
                  className={`typography-h3 text-xl ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Filter by Category
                </h3>
              </div>

              <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                {Object.keys(categoryMapping).map(cat => {
                  const isActive = category === cat;
                  const categoryStyle =
                    cat !== 'All'
                      ? getCategoryStyle(categoryMapping[cat][0] || 'advisory', isDark)
                      : null;

                  return (
                    <motion.button
                      key={cat}
                      onClick={() => {
                        setCategory(cat);
                        handleSearchOrFilter();
                      }}
                      className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all duration-300 border-2 shadow-lg backdrop-blur-sm ${
                        isActive
                          ? categoryStyle
                            ? `bg-gradient-to-r ${categoryStyle.gradient} text-white border-transparent ${categoryStyle.shadowColor} scale-105`
                            : 'bg-gradient-to-r from-[#3DD56D] to-[#2bb757] text-white border-[#3DD56D] shadow-[#3DD56D]/30 scale-105'
                          : isDark
                            ? `bg-slate-800/90 border-slate-700/60 hover:bg-slate-700/90 ${categoryStyle ? `hover:border-${categoryStyle.text.split('-')[1]}-400/50` : 'hover:border-[#3DD56D]/50'} hover:text-white ${categoryStyle?.text || 'text-gray-300'}`
                            : `bg-white/90 border-green-200/60 hover:bg-green-50/90 ${categoryStyle ? `hover:border-${categoryStyle.text.split('-')[1]}-400/50` : 'hover:border-[#3DD56D]/50'} hover:text-green-900 ${categoryStyle?.text || 'text-green-700'}`
                      }`}
                      whileHover={{ scale: isActive ? 1.05 : 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {categoryStyle?.icon && (
                        <span className={isActive ? 'text-white' : categoryStyle.text}>
                          {categoryStyle.icon}
                        </span>
                      )}
                      {isActive && <CheckCircle className="h-4 w-4" />}
                      <span>{cat}</span>
                      {isActive && (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Enhanced Active Filters Display */}
              {(search || category !== 'All') && (
                <motion.div
                  className="mt-8 flex flex-wrap justify-center gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span
                    className={`text-sm font-semibold flex items-center gap-2 ${
                      isDark ? 'text-gray-300' : 'text-green-700'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    Active filters:
                  </span>
                  {search && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-[#3DD56D]/20 to-[#2bb757]/20 text-[#3DD56D] border border-[#3DD56D]/30 backdrop-blur-sm">
                      <Search className="w-3 h-3" />
                      "{search}"
                      <button
                        onClick={() => {
                          setSearch('');
                          handleSearchOrFilter();
                        }}
                        className="ml-1 hover:bg-[#3DD56D]/30 rounded-full p-1 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {category !== 'All' && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-[#3DD56D]/20 to-[#2bb757]/20 text-[#3DD56D] border border-[#3DD56D]/30 backdrop-blur-sm">
                      <CheckCircle className="w-3 h-3" />
                      {category}
                      <button
                        onClick={() => {
                          setCategory('All');
                          handleSearchOrFilter();
                        }}
                        className="ml-1 hover:bg-[#3DD56D]/30 rounded-full p-1 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </motion.div>
              )}

              {/* Enhanced Results Count */}
              <div className="mt-6">
                <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl backdrop-blur-sm ${
                  isDark ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-green-50/80 border border-green-200/50'
                }`}>
                  <div className={`text-lg font-bold ${isDark ? 'text-[#3DD56D]' : 'text-green-700'}`}>
                    {filteredProducts.length}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isDark ? 'text-gray-300' : 'text-green-600'
                    }`}
                  >
                    product{filteredProducts.length !== 1 ? 's' : ''} found
                  </span>
                  {isLoadingFullData && (
                    <div className="inline-flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#3DD56D] border-t-transparent"></div>
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-green-600'}`}>
                        Loading...
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Product Grid Design - Browse Our Collection */}
          <div
            ref={productGrid.ref}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {filteredProducts.length === 0 ? (
              <div
                className={`col-span-full text-center py-12 text-lg font-medium ${
                  isDark ? 'text-gray-300' : 'text-green-700'
                }`}
              >
                No products found. Try adjusting your search or filters.
              </div>
            ) : (
              filteredProducts.map((product, idx) => {
                const categoryStyle = getCategoryStyle(product.category, isDark);

                return (
                  <div
                    key={product.name}
                    className={`relative overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-2 group h-[580px] sm:h-[620px] lg:h-[650px] w-full flex flex-col ${
                      isDark
                        ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/50 hover:border-slate-600/70'
                        : 'bg-gradient-to-br from-white to-gray-50/50 border border-gray-200/60 hover:border-gray-300/70'
                    } ${
                      productGrid.hasAnimated
                        ? (productGrid.isIntersecting ? 'card-wave-sequential' : 'card-slide-down')
                        : 'card-hidden'
                    }`}
                    style={{
                      boxShadow: `0 10px 40px -10px ${categoryStyle.shadowColor.replace('shadow-', 'rgba(').replace('/30', ', 0.15)')}`,
                      animationDelay: productGrid.hasAnimated ? `${idx * 0.1}s` : '0s'
                    }}
                  >
                    {/* Enhanced Product Header */}
                    <div className="p-4 pb-2 relative flex-shrink-0">
                      {/* Category Badge */}
                      <div className="flex justify-between items-start mb-4">
                        <motion.div
                          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider backdrop-blur-sm ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border} border`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {product.category.replace('-', ' ')}
                        </motion.div>

                        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-sm ${
                          isDark
                            ? 'bg-slate-700/50 border border-slate-600/50'
                            : 'bg-white/80 border border-gray-200/50'
                        }`}>
                          <Star className="w-4 h-4 text-amber-400 fill-current" />
                          <span className={`text-sm font-bold ${
                            isDark ? 'text-white' : 'text-slate-800'
                          }`}>{product.rating}</span>
                        </div>
                      </div>

                      {/* Enhanced Icon Container */}
                      <motion.div
                        className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 relative overflow-hidden bg-gradient-to-br ${categoryStyle.gradient} shadow-lg`}
                        whileHover={{
                          scale: 1.1,
                          rotate: 5,
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        {/* Animated Background */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
                          animate={{
                            rotate: [0, 360],
                          }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />

                        {categoryStyle.icon && React.isValidElement(categoryStyle.icon) && React.cloneElement(categoryStyle.icon as React.ReactElement<any>, {
                          className: "w-10 h-10 text-white relative z-10 drop-shadow-lg"
                        })}

                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </motion.div>

                      {/* Product Badge */}
                      {(product.badge || product.sale) && (
                        <motion.div
                          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${
                            product.sale
                              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse'
                              : product.badge === 'POPULAR'
                                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                                : product.badge === 'PREMIUM'
                                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                                  : `bg-gradient-to-r ${categoryStyle.gradient} text-white`
                          }`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {product.sale ? 'SALE' : product.badge}
                        </motion.div>
                      )}
                    </div>

                    {/* Enhanced Product Info */}
                    <div className="p-4 pt-1 flex-grow flex flex-col">
                      <h3 className={`typography-h3 text-lg sm:text-xl mb-2 text-center leading-tight line-clamp-2 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>{product.name}</h3>
                      <p className={`typography-body text-sm text-center mb-3 leading-relaxed line-clamp-2 ${
                        isDark ? 'text-slate-300' : 'text-gray-700'
                      }`}>{product.description}</p>

                      {/* Enhanced Specifications */}
                      <div className="mb-4">
                        <div className={`flex items-center gap-2 mb-2 font-bold text-sm ${categoryStyle.text}`}>
                          <Settings className="w-4 h-4" />
                          <span>Key Specifications</span>
                        </div>
                        <div className="space-y-2">
                          {product.specifications?.efficiency && (
                            <motion.div
                              className={`flex justify-between items-center p-2 rounded-lg border-l-4 backdrop-blur-sm ${categoryStyle.bg} border-l-${categoryStyle.text.split('-')[1]}-400`}
                              whileHover={{ scale: 1.02 }}
                            >
                              <span className={`text-sm font-medium ${
                                isDark ? 'text-slate-300' : 'text-slate-700'
                              }`}>Efficiency</span>
                              <span className={`text-sm font-bold ${categoryStyle.text}`}>
                                {product.specifications.efficiency}
                              </span>
                            </motion.div>
                          )}
                          {product.specifications?.warranty && (
                            <motion.div
                              className={`flex justify-between items-center p-2 rounded-lg border-l-4 backdrop-blur-sm ${categoryStyle.bg} border-l-${categoryStyle.text.split('-')[1]}-400`}
                              whileHover={{ scale: 1.02 }}
                            >
                              <span className={`text-sm font-medium ${
                                isDark ? 'text-slate-300' : 'text-slate-700'
                              }`}>Warranty</span>
                              <span className={`text-sm font-bold ${categoryStyle.text}`}>
                                {product.specifications.warranty}
                              </span>
                            </motion.div>
                          )}
                        </div>
                      </div>

                      {/* Enhanced Features */}
                      {product.tags && product.tags.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {product.tags.slice(0, 3).map((tag, tagIdx) => (
                              <motion.span
                                key={tagIdx}
                                className={`px-3 py-2 rounded-full text-xs font-bold border backdrop-blur-sm ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}
                                whileHover={{ scale: 1.05 }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: tagIdx * 0.1 }}
                              >
                                {tag}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Enhanced Price Section */}
                      <div className="mb-4">
                        <div className={`text-2xl font-black mb-1 text-center ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}>ETB {product.price.toLocaleString()}</div>
                        {product.oldPrice && product.oldPrice > product.price && (
                          <div className="flex items-center justify-center gap-3 flex-wrap">
                            <span className={`line-through text-lg ${
                              isDark ? 'text-slate-400' : 'text-slate-500'
                            }`}>ETB {product.oldPrice.toLocaleString()}</span>
                            <motion.span
                              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold"
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              Save ETB {(product.oldPrice - product.price).toLocaleString()} • {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                            </motion.span>
                          </div>
                        )}
                      </div>

                      {/* Spacer to push buttons to bottom */}
                      <div className="flex-grow"></div>

                      {/* Enhanced Action Buttons */}
                      <div className="flex gap-2 mb-3 mt-auto">
                        <motion.button
                          onClick={() => {
                            console.log('Add to cart:', product.name);
                          }}
                          className={`flex-1 text-white px-3 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r ${categoryStyle.gradient} hover:${categoryStyle.hoverGradient} ${categoryStyle.shadowColor} shadow-lg`}
                          whileHover={{
                            scale: 1.02,
                            y: -2,
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0L4 5M7 13h10m0 0l1.5 6M17 13l1.5 6" />
                          </svg>
                          Add to Cart
                        </motion.button>
                        <motion.button
                          onClick={() => {
                            console.log('View details:', product.name);
                          }}
                          className={`px-3 py-3 rounded-xl font-bold text-sm border-2 transition-all duration-300 ${categoryStyle.text} border-${categoryStyle.text.split('-')[1]}-400 hover:bg-gradient-to-r hover:${categoryStyle.gradient} hover:text-white hover:border-transparent ${
                            isDark ? 'bg-slate-800/50' : 'bg-white/80'
                          }`}
                          whileHover={{
                            scale: 1.02,
                            y: -2,
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Details
                        </motion.button>
                      </div>
                    </div>

                    {/* Enhanced Category Footer */}
                    <div className={`px-4 pb-4 border-t backdrop-blur-sm flex-shrink-0 ${
                      isDark
                        ? `bg-gradient-to-r ${categoryStyle.bg} border-slate-600/50`
                        : `bg-gradient-to-r ${categoryStyle.bg} border-gray-200/50`
                    }`}>
                      <div className="flex flex-wrap gap-2 pt-3 items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          <motion.span
                            className={`bg-gradient-to-r ${categoryStyle.gradient} text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg`}
                            whileHover={{ scale: 1.05 }}
                          >
                            {product.category.charAt(0).toUpperCase() + product.category.slice(1).replace('-', ' ')}
                          </motion.span>
                          {product.subcategory && (
                            <motion.span
                              className={`${categoryStyle.bg} ${categoryStyle.text} border ${categoryStyle.border} px-2 py-1 rounded-lg text-xs font-bold backdrop-blur-sm`}
                              whileHover={{ scale: 1.05 }}
                            >
                              {product.subcategory.charAt(0).toUpperCase() + product.subcategory.slice(1).replace('-', ' ')}
                            </motion.span>
                          )}
                        </div>

                        {/* Category Icon */}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${categoryStyle.gradient} shadow-lg`}>
                          {categoryStyle.icon && React.isValidElement(categoryStyle.icon) && React.cloneElement(categoryStyle.icon as React.ReactElement<any>, {
                            className: "w-4 h-4 text-white"
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {/* Enhanced Load More Section */}
          <motion.div
            className="mt-20 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.button
              className={`group inline-flex items-center justify-center gap-4 px-12 py-5 rounded-3xl font-bold text-lg transition-all duration-500 shadow-2xl hover:shadow-3xl backdrop-blur-sm transform hover:scale-105 ${
                isDark
                  ? 'bg-gradient-to-r from-slate-800/90 to-slate-700/90 border-2 border-slate-600/50 text-white hover:from-[#3DD56D]/30 hover:to-emerald-500/30 hover:border-[#3DD56D]/70 hover:text-white'
                  : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 border-2 border-green-500/50 text-white hover:border-green-400'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Discover More Products</span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:rotate-45 ${
                isDark ? 'bg-[#3DD56D]/30 group-hover:bg-[#3DD56D]/50' : 'bg-white/20 group-hover:bg-white/30'
              }`}>
                <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${
                  isDark ? 'text-[#3DD56D]' : 'text-white'
                }`} />
              </div>
            </motion.button>

            {/* Enhanced Stats */}
            <motion.div
              className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className={`flex flex-col items-center gap-3 p-6 rounded-2xl backdrop-blur-sm ${
                isDark ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-green-50/80 border border-green-200/50'
              }`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isDark ? 'bg-[#3DD56D]/20' : 'bg-green-100'
                }`}>
                  <CheckCircle className="w-6 h-6 text-[#3DD56D]" />
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-green-900'}`}>
                    {filteredProducts.length}+
                  </div>
                  <div className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-green-600'}`}>
                    Products Available
                  </div>
                </div>
              </div>

              <div className={`flex flex-col items-center gap-3 p-6 rounded-2xl backdrop-blur-sm ${
                isDark ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-green-50/80 border border-green-200/50'
              }`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isDark ? 'bg-[#3DD56D]/20' : 'bg-green-100'
                }`}>
                  <Shield className="w-6 h-6 text-[#3DD56D]" />
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-green-900'}`}>
                    2-5 Years
                  </div>
                  <div className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-green-600'}`}>
                    Quality Warranty
                  </div>
                </div>
              </div>

              <div className={`flex flex-col items-center gap-3 p-6 rounded-2xl backdrop-blur-sm ${
                isDark ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-green-50/80 border border-green-200/50'
              }`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isDark ? 'bg-[#3DD56D]/20' : 'bg-green-100'
                }`}>
                  <Clock className="w-6 h-6 text-[#3DD56D]" />
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-green-900'}`}>
                    24/7
                  </div>
                  <div className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-green-600'}`}>
                    Local Support
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Advanced Product Comparison Section */}
      <div
        ref={comparisonSection.ref}
        className={`transition-all duration-300 ${
          comparisonSection.hasAnimated
            ? (comparisonSection.isIntersecting ? 'card-fade-in-scale' : 'card-slide-down')
            : 'card-hidden'
        }`}
        style={{ animationDelay: comparisonSection.hasAnimated ? '0.4s' : '0s' }}
      >
        <AdvancedProductComparison
          products={products}
          className=""
        />
      </div>
      </div>
    </div>
  );
}
