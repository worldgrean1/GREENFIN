import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { GreanButton } from './grean-button';

// Enhanced brand button variants that extend the original button functionality
const brandButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        // Brand-compliant variants using official brand colors
        primary: 'bg-gradient-to-r from-grean-primary to-grean-secondary text-white hover:shadow-lg hover:shadow-grean-primary/20 hover:translate-y-[-1px] rounded-full font-bold',
        secondary: 'bg-gradient-to-r from-grean-secondary to-grean-accent text-white hover:shadow-lg hover:shadow-grean-secondary/20 hover:translate-y-[-1px] rounded-full font-bold',
        outline: 'border-2 border-grean-primary text-grean-primary bg-transparent hover:bg-grean-primary/10 hover:shadow-md hover:shadow-grean-primary/10 rounded-full font-bold',
        ghost: 'text-grean-primary hover:bg-grean-primary/10 hover:text-grean-primary rounded-full',
        // Preserve existing variants for compatibility
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm rounded-md',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm rounded-md',
        link: 'text-primary underline-offset-4 hover:underline',
        // Enhanced premium variants with brand colors
        premium: 'bg-gradient-to-r from-grean-primary to-grean-secondary text-white hover:shadow-md hover:shadow-grean-primary/20 hover:translate-y-[-2px] rounded-full font-bold',
        'premium-outline': 'border-2 border-grean-primary text-grean-primary bg-transparent hover:bg-grean-primary/10 hover:shadow-md hover:shadow-grean-primary/10 rounded-full',
        'premium-ghost': 'text-grean-primary hover:bg-grean-primary/10 hover:text-grean-primary rounded-md',
        'premium-secondary': 'bg-slate-800/70 backdrop-blur-sm text-white hover:bg-slate-700/70 border border-slate-700/50 hover:border-grean-primary/30 rounded-md',
      },
      size: {
        sm: 'h-9 px-4 py-2 text-sm',
        md: 'h-10 px-6 py-3 text-base',
        lg: 'h-12 px-8 py-4 text-lg',
        xl: 'h-14 px-10 py-4 text-lg font-semibold',
        default: 'h-10 px-4 py-2',
        icon: 'h-10 w-10',
      },
      rounded: {
        default: 'rounded-md',
        full: 'rounded-full',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      rounded: 'full',
    },
  }
);

export interface BrandButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof brandButtonVariants> {
  asChild?: boolean;
  useBrandComponent?: boolean; // Flag to use the pure GreanButton component
}

const BrandButton = React.forwardRef<HTMLButtonElement, BrandButtonProps>(
  ({ className, variant, size, rounded, asChild = false, useBrandComponent = false, ...props }, ref) => {

    // If useBrandComponent is true, use the pure GreanButton for maximum brand compliance
    if (useBrandComponent && (variant === 'primary' || variant === 'secondary' || variant === 'outline')) {
      const greanVariant = variant as 'primary' | 'secondary' | 'outline';
      const greanSize = size === 'default' ? 'md' : (size as 'sm' | 'md' | 'lg') || 'md';

      return (
        <GreanButton
          ref={ref}
          variant={greanVariant}
          size={greanSize}
          className={className}
          {...props}
        />
      );
    }

    // Otherwise use the enhanced brand-compatible button
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(brandButtonVariants({ variant, size, rounded, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
BrandButton.displayName = 'BrandButton';

// Variant mapping helper for migrating existing buttons
export const mapVariantToBrand = (originalVariant?: string) => {
  const variantMap: Record<string, string> = {
    'default': 'primary',
    'premium': 'primary',
    'premium-outline': 'outline',
    'premium-ghost': 'ghost',
    'premium-secondary': 'secondary',
  };

  return variantMap[originalVariant || 'default'] || originalVariant || 'primary';
};

// Size mapping helper
export const mapSizeToBrand = (originalSize?: string) => {
  const sizeMap: Record<string, string> = {
    'default': 'md',
    'sm': 'sm',
    'lg': 'lg',
    'xl': 'xl',
    'icon': 'sm',
  };

  return sizeMap[originalSize || 'default'] || originalSize || 'md';
};

export { BrandButton, brandButtonVariants };
