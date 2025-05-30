'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Leaf, Sun, Battery } from 'lucide-react';
import { BrandButton } from '../ui/brand-button';
import { BrandCard } from '../ui/brand-card';
import { useBrandTheme } from '../theme-provider';

/**
 * Brand Component Showcase
 * Demonstrates the new brand-compliant components
 */
export function BrandComponentShowcase() {
  const [activeDemo, setActiveDemo] = useState<string>('buttons');
  const { isDarkMode, theme, setTheme } = useBrandTheme();

  const demoSections = [
    { id: 'buttons', label: 'Brand Buttons', icon: Zap },
    { id: 'cards', label: 'Brand Cards', icon: Leaf },
    { id: 'integration', label: 'Integration Examples', icon: Sun },
  ];

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-grean-primary to-grean-secondary bg-clip-text text-transparent">
          🎨 GREAN WORLD Brand Components
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Phase 2: Core Components Implementation Showcase
        </p>
      </div>

      {/* Demo Navigation */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {demoSections.map((section) => {
          const IconComponent = section.icon;
          return (
            <BrandButton
              key={section.id}
              variant={activeDemo === section.id ? 'primary' : 'outline'}
              size="md"
              onClick={() => setActiveDemo(section.id)}
              className="flex items-center gap-2"
            >
              <IconComponent className="w-4 h-4" />
              {section.label}
            </BrandButton>
          );
        })}
      </div>

      {/* Buttons Demo */}
      {activeDemo === 'buttons' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <BrandCard pattern="dots" gradient className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Brand Button Variants</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Primary Buttons */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Primary Variants</h3>
                <div className="space-y-3">
                  <BrandButton variant="primary" size="sm">Small Primary</BrandButton>
                  <BrandButton variant="primary" size="md">Medium Primary</BrandButton>
                  <BrandButton variant="primary" size="lg">Large Primary</BrandButton>
                </div>
              </div>

              {/* Secondary Buttons */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Secondary Variants</h3>
                <div className="space-y-3">
                  <BrandButton variant="secondary" size="sm">Small Secondary</BrandButton>
                  <BrandButton variant="secondary" size="md">Medium Secondary</BrandButton>
                  <BrandButton variant="secondary" size="lg">Large Secondary</BrandButton>
                </div>
              </div>

              {/* Outline Buttons */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Outline Variants</h3>
                <div className="space-y-3">
                  <BrandButton variant="outline" size="sm">Small Outline</BrandButton>
                  <BrandButton variant="outline" size="md">Medium Outline</BrandButton>
                  <BrandButton variant="outline" size="lg">Large Outline</BrandButton>
                </div>
              </div>
            </div>

            {/* Pure Brand Component Demo */}
            <div className="mt-8 p-6 bg-grean-primary/5 rounded-xl border border-grean-primary/20">
              <h3 className="text-lg font-semibold mb-4">Pure Brand Components</h3>
              <div className="flex flex-wrap gap-4">
                <BrandButton variant="primary" useBrandComponent={true}>
                  Pure GreanButton Primary
                </BrandButton>
                <BrandButton variant="secondary" useBrandComponent={true}>
                  Pure GreanButton Secondary
                </BrandButton>
                <BrandButton variant="outline" useBrandComponent={true}>
                  Pure GreanButton Outline
                </BrandButton>
              </div>
            </div>
          </BrandCard>
        </motion.div>
      )}

      {/* Cards Demo */}
      {activeDemo === 'cards' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Pattern Cards */}
            <BrandCard pattern="dots" gradient size="md" className="p-6">
              <h3 className="text-xl font-bold mb-4">Dots Pattern</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Card with dots pattern and gradient overlay using brand colors.
              </p>
              <BrandButton variant="primary" size="sm">
                Learn More <ArrowRight className="w-4 h-4 ml-2" />
              </BrandButton>
            </BrandCard>

            <BrandCard pattern="waves" gradient size="md" className="p-6">
              <h3 className="text-xl font-bold mb-4">Waves Pattern</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Card with waves pattern showcasing brand visual elements.
              </p>
              <BrandButton variant="secondary" size="sm">
                Explore <ArrowRight className="w-4 h-4 ml-2" />
              </BrandButton>
            </BrandCard>

            <BrandCard pattern="grid" gradient size="md" className="p-6">
              <h3 className="text-xl font-bold mb-4">Grid Pattern</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Card with grid pattern and brand-compliant styling.
              </p>
              <BrandButton variant="outline" size="sm">
                Discover <ArrowRight className="w-4 h-4 ml-2" />
              </BrandButton>
            </BrandCard>
          </div>

          {/* Advanced Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BrandCard 
              pattern="radial" 
              gradient 
              glowEffect 
              animationType="dramatic" 
              size="lg" 
              className="p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-grean-primary to-grean-secondary flex items-center justify-center">
                  <Battery className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Energy Storage</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Advanced Solutions</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Advanced energy storage solutions with dramatic animations and glow effects.
              </p>
              <BrandButton variant="primary" className="w-full">
                Get Started <ArrowRight className="w-4 h-4 ml-2" />
              </BrandButton>
            </BrandCard>

            <BrandCard 
              pattern="none" 
              gradient={false} 
              useBrandComponent={true}
              className="p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-grean-secondary to-grean-accent flex items-center justify-center">
                  <Sun className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Pure Brand Card</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">100% Brand Compliant</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                This card uses the pure GreanCard component for maximum brand compliance.
              </p>
              <BrandButton variant="secondary" useBrandComponent={true} className="w-full">
                Pure Brand Button <ArrowRight className="w-4 h-4 ml-2" />
              </BrandButton>
            </BrandCard>
          </div>
        </motion.div>
      )}

      {/* Integration Demo */}
      {activeDemo === 'integration' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <BrandCard pattern="dots" gradient size="lg" className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Integration Examples</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Theme Integration */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Theme Integration</h3>
                <div className="p-4 bg-grean-primary/5 rounded-lg border border-grean-primary/20">
                  <p className="text-sm mb-4">Current theme: <strong>{theme}</strong></p>
                  <p className="text-sm mb-4">Dark mode: <strong>{isDarkMode ? 'Yes' : 'No'}</strong></p>
                  <div className="flex gap-2">
                    <BrandButton 
                      variant={theme === 'light' ? 'primary' : 'outline'} 
                      size="sm"
                      onClick={() => setTheme('light')}
                    >
                      Light
                    </BrandButton>
                    <BrandButton 
                      variant={theme === 'dark' ? 'primary' : 'outline'} 
                      size="sm"
                      onClick={() => setTheme('dark')}
                    >
                      Dark
                    </BrandButton>
                  </div>
                </div>
              </div>

              {/* Color Showcase */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Brand Colors</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-grean-primary rounded-lg mx-auto mb-2"></div>
                    <p className="text-xs">Primary</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-grean-secondary rounded-lg mx-auto mb-2"></div>
                    <p className="text-xs">Secondary</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-grean-accent rounded-lg mx-auto mb-2"></div>
                    <p className="text-xs">Accent</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <BrandButton variant="primary" size="lg">
                Phase 2 Complete! <ArrowRight className="w-5 h-5 ml-2" />
              </BrandButton>
            </div>
          </BrandCard>
        </motion.div>
      )}
    </div>
  );
}
