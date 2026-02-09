import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', ...props }, ref) => {
  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-500/30 hover:shadow-brand-500/40 border-transparent',
    secondary: 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm',
    outline: 'bg-transparent border-2 border-brand-600 text-brand-600 hover:bg-brand-50',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30',
    gradient: 'bg-gradient-to-r from-brand-600 to-accent-600 text-white hover:opacity-90 shadow-lg shadow-brand-500/30',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});

Button.displayName = 'Button';

export { Button };
