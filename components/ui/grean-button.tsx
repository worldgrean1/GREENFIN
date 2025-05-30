import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

// Official GreanButton Component - Extracted from brand guidelines
const greanButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-r from-[#3DD56D] to-[#2bb757] text-white hover:shadow-lg hover:shadow-[#3DD56D]/20 hover:translate-y-[-1px] rounded-full font-bold',
        secondary: 'bg-gradient-to-r from-[#2bb757] to-[#23A455] text-white hover:shadow-lg hover:shadow-[#2bb757]/20 hover:translate-y-[-1px] rounded-full font-bold',
        outline: 'border-2 border-[#3DD56D] text-[#3DD56D] bg-transparent hover:bg-[#3DD56D]/10 hover:shadow-md hover:shadow-[#3DD56D]/10 rounded-full font-bold',
        ghost: 'text-[#3DD56D] hover:bg-[#3DD56D]/10 hover:text-[#3DD56D] rounded-full',
      },
      size: {
        sm: 'h-9 px-4 py-2 text-sm',
        md: 'h-10 px-6 py-3 text-base',
        lg: 'h-12 px-8 py-4 text-lg',
        default: 'h-10 px-6 py-3 text-base', // Add default size to match md
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface GreanButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof greanButtonVariants> {
  asChild?: boolean;
}

const GreanButton = React.forwardRef<HTMLButtonElement, GreanButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(greanButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
GreanButton.displayName = 'GreanButton';

export { GreanButton, greanButtonVariants };
