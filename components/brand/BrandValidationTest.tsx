'use client';

import React from 'react';
import Image from 'next/image';
import { useBrandTheme } from '../theme-provider';

/**
 * Brand Validation Test Component
 * Tests the integration of GREAN WORLD brand guidelines
 */
export function BrandValidationTest() {
  const { isDarkMode, theme, setTheme } = useBrandTheme();

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">
        🎨 GREAN WORLD Brand Integration Test
      </h1>

      {/* Theme Status */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Theme Status</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Current Theme:</strong> {theme}</p>
            <p><strong>Dark Mode:</strong> {isDarkMode ? 'Yes' : 'No'}</p>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => setTheme('light')}
              className="px-4 py-2 bg-grean-primary text-white rounded hover:bg-grean-secondary transition-colors"
            >
              Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className="px-4 py-2 bg-grean-secondary text-white rounded hover:bg-grean-accent transition-colors"
            >
              Dark
            </button>
          </div>
        </div>
      </div>

      {/* Logo Test */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Official Logo Test</h2>
        <div className="flex items-center gap-8">
          <div className="text-center">
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">Small (24px)</p>
            <Image
              src="/logos/grean-world-logo.png"
              alt="GREAN WORLD Logo Small"
              width={24}
              height={24}
              className="object-contain mx-auto"
            />
          </div>
          <div className="text-center">
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">Medium (48px)</p>
            <Image
              src="/logos/grean-world-logo.png"
              alt="GREAN WORLD Logo Medium"
              width={48}
              height={48}
              className="object-contain mx-auto"
            />
          </div>
          <div className="text-center">
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">Large (64px)</p>
            <Image
              src="/logos/grean-world-logo.png"
              alt="GREAN WORLD Logo Large"
              width={64}
              height={64}
              className="object-contain mx-auto"
            />
          </div>
        </div>
      </div>

      {/* Color Test */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Brand Colors Test</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-grean-primary rounded-lg mx-auto mb-2"></div>
            <p className="text-sm">Primary</p>
            <p className="text-xs text-gray-500">#3DD56D</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-grean-secondary rounded-lg mx-auto mb-2"></div>
            <p className="text-sm">Secondary</p>
            <p className="text-xs text-gray-500">#2bb757</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-grean-accent rounded-lg mx-auto mb-2"></div>
            <p className="text-sm">Accent</p>
            <p className="text-xs text-gray-500">#23A455</p>
          </div>
        </div>
      </div>

      {/* CSS Variables Test */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">CSS Variables Test</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div 
              className="w-full h-16 rounded-lg mb-2"
              style={{ background: 'var(--grean-primary)' }}
            ></div>
            <p className="text-sm">var(--grean-primary)</p>
          </div>
          <div>
            <div 
              className="w-full h-16 rounded-lg mb-2"
              style={{ background: 'var(--grean-secondary)' }}
            ></div>
            <p className="text-sm">var(--grean-secondary)</p>
          </div>
        </div>
      </div>

      {/* Gradient Test */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Brand Gradients Test</h2>
        <div className="space-y-4">
          <div className="h-16 bg-gradient-grean rounded-lg flex items-center justify-center text-white font-semibold">
            Primary Gradient
          </div>
          <div className="h-16 bg-gradient-grean-light rounded-lg flex items-center justify-center text-white font-semibold">
            Light Gradient
          </div>
          <div className="h-16 bg-gradient-grean-secondary rounded-lg flex items-center justify-center text-white font-semibold">
            Secondary Gradient
          </div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
        <h2 className="text-xl font-semibold mb-4 text-green-800 dark:text-green-200">
          ✅ Phase 1 Implementation Status
        </h2>
        <div className="space-y-2 text-green-700 dark:text-green-300">
          <p>✅ Brand CSS variables imported</p>
          <p>✅ Official logos integrated</p>
          <p>✅ Tailwind brand colors configured</p>
          <p>✅ Brand gradients available</p>
          <p>✅ Theme provider compatibility layer created</p>
        </div>
      </div>
    </div>
  );
}
