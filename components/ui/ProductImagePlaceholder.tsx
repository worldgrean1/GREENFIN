'use client';

import React from 'react';
import {
  SunMedium,
  Flame,
  Battery,
  Droplets,
  Lightbulb,
  Settings,
  Users,
  Zap,
} from 'lucide-react';

interface ProductImagePlaceholderProps {
  category: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ProductImagePlaceholder: React.FC<ProductImagePlaceholderProps> = ({
  category,
  className = '',
  size = 'md',
}) => {
  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'cooking-lower': <Flame className="w-full h-full" />,
      'cooking-higher': <Zap className="w-full h-full" />,
      'solar-pv': <SunMedium className="w-full h-full" />,
      pue: <Settings className="w-full h-full" />,
      'water-pumping': <Droplets className="w-full h-full" />,
      'street-lights': <Lightbulb className="w-full h-full" />,
      'power-backup': <Battery className="w-full h-full" />,
      advisory: <Users className="w-full h-full" />,
    };

    return iconMap[category] || <Settings className="w-full h-full" />;
  };

  const getCategoryGradient = (category: string) => {
    const gradientMap: { [key: string]: string } = {
      'cooking-lower': 'from-orange-500 to-red-500',
      'cooking-higher': 'from-purple-500 to-pink-500',
      'solar-pv': 'from-blue-500 to-cyan-500',
      pue: 'from-emerald-500 to-green-500',
      'water-pumping': 'from-cyan-500 to-teal-500',
      'street-lights': 'from-yellow-500 to-amber-500',
      'power-backup': 'from-indigo-500 to-purple-500',
      advisory: 'from-slate-500 to-gray-500',
    };

    return gradientMap[category] || 'from-slate-500 to-gray-500';
  };

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div
      className={`
      ${sizeClasses[size]} 
      rounded-2xl 
      bg-gradient-to-br ${getCategoryGradient(category)} 
      flex items-center justify-center 
      text-white 
      shadow-lg 
      backdrop-blur-sm 
      border border-white/20
      ${className}
    `}
    >
      <div className={iconSizes[size]}>{getCategoryIcon(category)}</div>
    </div>
  );
};

export default ProductImagePlaceholder;
