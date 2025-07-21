import React from 'react';
import { cn } from '../../utils/cn';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  children,
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-secondary-500 hover:bg-secondary-400 text-primary-800',
    secondary: 'bg-primary-500 hover:bg-primary-400 text-secondary-100',
    outline: 'border border-secondary-500 text-secondary-500 hover:bg-secondary-500/10',
    ghost: 'text-secondary-500 hover:bg-primary-500/40',
    danger: 'bg-danger-500 hover:bg-danger-400 text-white',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={cn(
        'rounded-md font-medium transition-all duration-200 ease-in-out',
        'focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:ring-opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        isLoading ? 'opacity-80 cursor-not-allowed' : '',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        {isLoading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <>
            {leftIcon && <span>{leftIcon}</span>}
            {children}
            {rightIcon && <span>{rightIcon}</span>}
          </>
        )}
      </div>
    </button>
  );
};