'use client';

import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  SunMedium,
  Building2,
  GraduationCap,
  School,
  Target,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { IntegratedSolutionCard } from '../cards/IntegratedSolutionCard';

// Enhanced Four Pillars data with distinctive icons and colors
const fourPillarsData = [
  {
    title: 'Community Solar Projects',
    description: 'Residential and community-scale solar installations that empower neighborhoods with clean, affordable energy. We design, install, and maintain solar systems that bring sustainable power directly to homes and local communities.',
    shortDescription: 'Empowering neighborhoods with premium solar energy solutions and smart grid integration.',
    tags: ['Premium Solar', 'Smart Communities', 'Sustainable Living'],
    gradient: 'from-orange-500/15 to-amber-500/20',
    borderColor: 'border-orange-500/40',
    hoverBorder: 'hover:border-orange-500/70',
    accentColor: 'text-orange-500',
    bgAccent: 'bg-orange-500/15',
    iconColor: 'text-orange-500',
    iconBg: 'bg-orange-500/20',
    hoverIconBg: 'group-hover:bg-orange-500/30',
    features: [
      'Premium residential solar installations',
      'Smart community energy networks',
      'Advanced grid integration systems',
    ],
    stats: { value: '750+', label: 'Homes Powered' },
    icon: SunMedium,
  },
  {
    title: 'Commercial Energy Transition',
    description: 'Business and industrial energy solutions that reduce operational costs while advancing sustainability goals. From energy audits to complete system implementation, we help enterprises transition to renewable energy.',
    shortDescription: 'Helping businesses reduce costs and carbon footprint through smart energy solutions.',
    tags: ['Business Solutions', 'Cost Reduction', 'Sustainability'],
    gradient: 'from-blue-500/15 to-cyan-500/20',
    borderColor: 'border-blue-500/40',
    hoverBorder: 'hover:border-blue-500/70',
    accentColor: 'text-blue-500',
    bgAccent: 'bg-blue-500/15',
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-500/20',
    hoverIconBg: 'group-hover:bg-blue-500/30',
    features: [
      'Commercial energy audits and planning',
      'Industrial solar and storage systems',
      'Energy efficiency optimization',
    ],
    stats: { value: '40%', label: 'Cost Savings' },
    icon: Building2,
  },
  {
    title: 'Workforce Development',
    description: "Training and capacity building programs that create skilled professionals in renewable energy technologies. We develop local expertise to support Ethiopia's growing green energy sector.",
    shortDescription: 'Building local expertise through comprehensive renewable energy training programs.',
    tags: ['Skills Training', 'Capacity Building', 'Career Development'],
    gradient: 'from-emerald-500/15 to-green-500/20',
    borderColor: 'border-emerald-500/40',
    hoverBorder: 'hover:border-emerald-500/70',
    accentColor: 'text-emerald-500',
    bgAccent: 'bg-emerald-500/15',
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-500/20',
    hoverIconBg: 'group-hover:bg-emerald-500/30',
    features: [
      'Technical certification programs',
      'Hands-on installation training',
      'Professional development pathways',
    ],
    stats: { value: '1,200+', label: 'Trained Professionals' },
    icon: GraduationCap,
  },
  {
    title: 'Sustainable Campus Initiative',
    description: 'Educational institution energy programs that transform schools and universities into models of sustainability. We create learning environments that demonstrate clean energy principles while reducing operational costs.',
    shortDescription: 'Transforming educational institutions into sustainable energy showcases.',
    tags: ['Education', 'Campus Solutions', 'Learning Labs'],
    gradient: 'from-purple-500/15 to-violet-500/20',
    borderColor: 'border-purple-500/40',
    hoverBorder: 'hover:border-purple-500/70',
    accentColor: 'text-purple-500',
    bgAccent: 'bg-purple-500/15',
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-500/20',
    hoverIconBg: 'group-hover:bg-purple-500/30',
    features: [
      'Campus-wide energy system design',
      'Educational demonstration projects',
      'Student engagement programs',
    ],
    stats: { value: '25+', label: 'Campuses Transformed' },
    icon: School,
  },
];

interface EnhancedFourPillarsProps {
  className?: string;
}

export const EnhancedFourPillars = memo<EnhancedFourPillarsProps>(({
  className = ''
}) => {
  const { isDark, isLight } = useTheme();
  const { shouldReduceAnimations } = usePerformanceMonitor();

  // Memoized container variants for performance
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceAnimations ? 0.1 : 0.2,
        delayChildren: 0.1,
      }
    }
  }), [shouldReduceAnimations]);

  const handleSolutionSelect = (solution: any) => {
    console.log('Selected solution:', solution.title);
    // Add your navigation or modal logic here
  };

  return (
    <section
      className={`relative py-16 px-4 sm:px-6 lg:px-8 ${
        isDark
          ? 'bg-gradient-to-b from-slate-900/50 to-slate-800/50'
          : 'bg-gradient-to-b from-white to-green-50/50'
      } ${className}`}
      aria-labelledby="four-pillars-title"
    >
      {/* Enhanced Section Header */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          {/* Badge */}
          <motion.div
            className={`inline-flex items-center rounded-full px-8 py-4 text-sm font-bold mb-8 shadow-lg backdrop-blur-sm ${
              isDark
                ? 'bg-gradient-to-r from-[#3DD56D]/20 to-[#23A455]/20 text-[#3DD56D] border border-[#3DD56D]/40'
                : 'bg-small-title/20 text-small-title border border-small-title/20'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            role="banner"
            aria-label="Service approach section"
          >
            <Target className={`mr-3 h-5 w-5 ${isDark ? 'text-[#3DD56D]' : 'text-small-title'}`} />
            <span>Integrated Service Approach</span>
            <div className={`ml-3 w-2 h-2 rounded-full ${
              isDark ? 'bg-[#3DD56D]' : 'bg-small-title'
            }`} />
          </motion.div>

          {/* Main Title */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2
              id="four-pillars-title"
              className={`text-4xl md:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tight text-center ${
                isDark ? 'text-white drop-shadow-2xl' : 'text-hero-title drop-shadow-sm'
              }`}
            >
              Four Pillars of Energy Excellence
            </h2>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className={`text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto font-medium ${
              isDark ? 'text-gray-300' : 'text-description-text'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Our comprehensive services work together seamlessly to provide
            end-to-end energy solutions that transform communities and
            businesses across Ethiopia.
          </motion.p>

          {/* Enhanced Stats Row */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {[
              { value: '500+', label: 'Projects Completed', icon: Award },
              { value: '1,200+', label: 'Professionals Trained', icon: GraduationCap },
              { value: '40%', label: 'Average Cost Savings', icon: TrendingUp },
              { value: '25+', label: 'Institutions Served', icon: Zap },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className={`text-center p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm group cursor-pointer ${
                  isDark
                    ? 'bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/60 hover:border-[#3DD56D]/40'
                    : 'bg-gradient-to-br from-white/95 to-green-50/80 border border-green-300/70 hover:border-green-500/60 shadow-green-100/50'
                }`}
                whileHover={!shouldReduceAnimations ? {
                  scale: 1.05,
                  y: -5
                } : {}}
                whileTap={!shouldReduceAnimations ? { scale: 0.98 } : {}}
              >
                <div className="mb-3">
                  <stat.icon className={`w-6 h-6 mx-auto ${
                    isDark ? 'text-[#3DD56D]' : 'text-small-title'
                  } group-hover:scale-110 transition-transform`} />
                </div>
                <div className={`text-2xl md:text-3xl font-bold mb-1 ${
                  isDark ? 'text-[#3DD56D]' : 'text-small-title'
                }`}>
                  {stat.value}
                </div>
                <div className={`text-xs md:text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-description-text'
                }`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Enhanced Four Pillars Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {fourPillarsData.map((pillar, index) => (
            <IntegratedSolutionCard
              key={pillar.title}
              solution={pillar}
              index={index}
              onLearnMore={handleSolutionSelect}
              priority={index < 2 ? 'high' : 'normal'}
              className="transform-gpu"
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
});

EnhancedFourPillars.displayName = 'EnhancedFourPillars';

export default EnhancedFourPillars;
