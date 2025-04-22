
import React from 'react';
import { cn } from '../../lib/utils';

const Button = ({ 
  children, 
  variant = "default", 
  size = "default", 
  className, 
  icon: Icon,
  iconPosition = "left",
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-hero-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    default: "bg-hero-primary text-white hover:bg-hero-secondary",
    outline: "border border-hero-primary text-hero-primary hover:bg-hero-primary/5",
    secondary: "bg-hero-accent text-white hover:bg-hero-accent/80",
    ghost: "hover:bg-hero-muted hover:text-hero-primary",
    link: "text-hero-primary underline-offset-4 hover:underline p-0 h-auto"
  };
  
  const sizes = {
    default: "px-6 py-2.5 text-sm",
    sm: "px-3 py-1.5 text-xs",
    lg: "px-8 py-3 text-base",
    icon: "p-2"
  };
  
  const variantStyle = variants[variant] || variants.default;
  const sizeStyle = sizes[size] || sizes.default;
  
  return (
    <button 
      className={cn(baseStyles, variantStyle, sizeStyle, className)}
      {...props}
    >
      {Icon && iconPosition === "left" && <Icon className={cn("h-5 w-5", children && "mr-2")} />}
      {children}
      {Icon && iconPosition === "right" && <Icon className={cn("h-5 w-5", children && "ml-2")} />}
    </button>
  );
};

export default Button;
