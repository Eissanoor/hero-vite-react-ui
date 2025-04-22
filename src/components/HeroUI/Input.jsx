
import React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ 
  className,
  type = "text",
  variant = "default",
  ...props
}, ref) => {
  const variants = {
    default: "hero-input",
    bordered: "block w-full rounded-md border border-gray-300 bg-white py-2.5 px-4 text-gray-900 shadow-sm focus:border-hero-primary focus:outline-none focus:ring-1 focus:ring-hero-primary",
    underlined: "block w-full border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-gray-900 focus:border-hero-primary focus:outline-none focus:ring-0"
  };

  const variantClass = variants[variant] || variants.default;

  return (
    <input
      type={type}
      className={cn(variantClass, className)}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;
