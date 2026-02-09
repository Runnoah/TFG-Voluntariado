import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Input = React.forwardRef(({ className, label, error, ...props }, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                className={cn(
                    'block w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm px-4 py-3 border transition-all duration-200',
                    error && 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50',
                    className
                )}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
});

Input.displayName = 'Input';

export { Input };
