import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Card = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300', className)}
        {...props}
    />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('px-6 py-4 border-b border-gray-100', className)}
        {...props}
    />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn('text-lg font-semibold text-gray-900', className)}
        {...props}
    />
));
CardTitle.displayName = 'CardTitle';

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('px-6 py-4 bg-gray-50 border-t border-gray-100', className)}
        {...props}
    />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardContent, CardFooter };
