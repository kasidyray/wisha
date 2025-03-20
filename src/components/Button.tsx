
import React from 'react';
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    className, 
    variant = 'primary', 
    size = 'md', 
    icon, 
    iconPosition = 'left',
    fullWidth = false,
    loading = false,
    disabled,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;

    const variants = {
      primary: 'bg-indigo-500 text-white hover:bg-indigo-600 transition-all duration-300 shadow-sm hover:shadow',
      secondary: 'bg-emerald-500 text-white hover:bg-emerald-600 transition-all duration-300 shadow-sm hover:shadow',
      outline: 'bg-transparent border border-indigo-400 text-indigo-600 hover:bg-indigo-50 transition-all duration-300',
      ghost: 'bg-transparent hover:bg-indigo-50 text-indigo-600 transition-all duration-300',
      link: 'bg-transparent underline-offset-4 hover:underline text-indigo-600 p-0 h-auto transition-all duration-300'
    };

    const sizes = {
      sm: 'text-sm px-3 py-1.5 rounded-md',
      md: 'text-base px-4 py-2 rounded-md',
      lg: 'text-lg px-6 py-3 rounded-lg'
    };

    return (
      <button
        ref={ref}
        className={cn(
          'font-medium inline-flex items-center justify-center relative',
          variant !== 'link' && 'focus:ring-2 focus:ring-indigo-200 focus:outline-none',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          isDisabled && 'opacity-60 cursor-not-allowed',
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
                fill="none"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        )}
        <span className={loading ? 'invisible' : 'flex items-center gap-2'}>
          {icon && iconPosition === 'left' && <span>{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span>{icon}</span>}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
