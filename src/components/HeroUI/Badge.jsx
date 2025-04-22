
import React from 'react';
import { cn } from '../../lib/utils';

const Badge = ({ 
  children, 
  variant = "default", 
  size = "default", 
  className, 
  ...props 
}) => {
  const variants = {
    default: "bg-hero-primary/10 text-hero-primary",
    secondary: "bg-hero-secondary/10 text-hero-secondary",
    outline: "border border-hero-primary text-hero-primary",
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-red-100 text-red-800"
  };

  const sizes = {
    default: "px-2.5 py-0.5 text-xs",
    sm: "px-2 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
