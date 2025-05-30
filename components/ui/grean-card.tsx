import * as React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

// Theme-specific SVG Pattern definitions for optimal visibility
const createDotPattern = (isDark: boolean) => `data:image/svg+xml,${encodeURIComponent(`
<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="10" cy="10" r="2" fill="#3DD56D" opacity="${isDark ? '0.4' : '0.8'}"/>
      <circle cx="5" cy="5" r="1" fill="#2bb757" opacity="${isDark ? '0.3' : '0.6'}"/>
      <circle cx="15" cy="15" r="1" fill="#2bb757" opacity="${isDark ? '0.3' : '0.6'}"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#dots)"/>
</svg>
`)}`;

const createWavePattern = (isDark: boolean) => `data:image/svg+xml,${encodeURIComponent(`
<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="waves" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
      <path d="M0,25 Q12.5,10 25,25 T50,25" stroke="#3DD56D" strokeWidth="${isDark ? '2' : '3'}" fill="none" opacity="${isDark ? '0.3' : '0.7'}"/>
      <path d="M0,35 Q12.5,20 25,35 T50,35" stroke="#2bb757" strokeWidth="${isDark ? '1' : '2'}" fill="none" opacity="${isDark ? '0.2' : '0.5'}"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#waves)"/>
</svg>
`)}`;

const createGridPattern = (isDark: boolean) => `data:image/svg+xml,${encodeURIComponent(`
<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#3DD56D" strokeWidth="${isDark ? '1' : '2'}" opacity="${isDark ? '0.3' : '0.6'}"/>
      <path d="M 10 0 L 10 20 M 0 10 L 20 10" fill="none" stroke="#2bb757" strokeWidth="${isDark ? '0.5' : '1'}" opacity="${isDark ? '0.2' : '0.4'}"/>
      <circle cx="0" cy="0" r="1" fill="#3DD56D" opacity="${isDark ? '0.4' : '0.7'}"/>
      <circle cx="20" cy="0" r="1" fill="#3DD56D" opacity="${isDark ? '0.4' : '0.7'}"/>
      <circle cx="0" cy="20" r="1" fill="#3DD56D" opacity="${isDark ? '0.4' : '0.7'}"/>
      <circle cx="20" cy="20" r="1" fill="#3DD56D" opacity="${isDark ? '0.4' : '0.7'}"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grid)"/>
</svg>
`)}`;

const createRadialPattern = (isDark: boolean) => `data:image/svg+xml,${encodeURIComponent(`
<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="radial" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="20" cy="20" r="15" fill="none" stroke="#3DD56D" strokeWidth="${isDark ? '1' : '2'}" opacity="${isDark ? '0.2' : '0.5'}"/>
      <circle cx="20" cy="20" r="8" fill="none" stroke="#3DD56D" strokeWidth="${isDark ? '1' : '2'}" opacity="${isDark ? '0.4' : '0.7'}"/>
      <circle cx="20" cy="20" r="3" fill="#2bb757" opacity="${isDark ? '0.3' : '0.6'}"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#radial)"/>
</svg>
`)}`;

// Official GreanCard Component
interface GreanCardProps {
  children: React.ReactNode
  className?: string
  pattern?: 'dots' | 'waves' | 'grid' | 'radial' | 'none' | 'circles' // Add circles pattern
  gradient?: boolean
  style?: React.CSSProperties // Add style prop
  onClick?: () => void // Add onClick prop
}

export const GreanCard: React.FC<GreanCardProps> = ({
  children,
  className,
  pattern = 'none',
  gradient = false,
  style,
  onClick
}) => {
  const { theme, effectiveTheme } = useTheme()
  const isDarkMode = effectiveTheme === 'dark'

  const baseClasses = 'rounded-xl border transition-all duration-300 relative overflow-hidden'
  const themeClasses = isDarkMode
    ? 'bg-slate-900/80 border-slate-700 hover:bg-slate-800/80'
    : 'bg-white border-gray-200 hover:bg-gray-50'

  // Theme-aware patterns for optimal visibility
  const getPattern = (patternType: string) => {
    switch (patternType) {
      case 'dots': return createDotPattern(isDarkMode);
      case 'waves': return createWavePattern(isDarkMode);
      case 'grid': return createGridPattern(isDarkMode);
      case 'radial': return createRadialPattern(isDarkMode);
      case 'circles': return createRadialPattern(isDarkMode); // Use radial pattern for circles
      default: return '';
    }
  }

  return (
    <div
      className={cn(baseClasses, themeClasses, className, onClick && 'cursor-pointer')}
      style={style}
      onClick={onClick}
    >
      {pattern !== 'none' && (
        <div
          className={`absolute inset-0 ${isDarkMode ? 'opacity-30' : 'opacity-20'}`}
          style={{
            backgroundImage: `url("${getPattern(pattern)}")`,
            backgroundRepeat: 'repeat',
            backgroundSize: pattern === 'radial' || pattern === 'circles' ? '80px 80px' : pattern === 'waves' ? '60px 60px' : '60px 60px'
          }}
        />
      )}
      {gradient && (
        <div className={`absolute inset-0 bg-gradient-to-br ${isDarkMode ? 'from-[#3DD56D]/5 to-[#2bb757]/5' : 'from-[#3DD56D]/8 to-[#2bb757]/8'}`} />
      )}
      <div className="relative z-10 p-6">
        {children}
      </div>
    </div>
  )
}

export { createDotPattern, createWavePattern, createGridPattern, createRadialPattern };
