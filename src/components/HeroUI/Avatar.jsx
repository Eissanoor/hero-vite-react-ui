
import React from 'react';
import { cn } from '../../lib/utils';

const Avatar = ({
  src,
  alt = "",
  fallback,
  size = "md",
  className,
  ...props
}) => {
  const [imageError, setImageError] = React.useState(false);

  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };
  
  const sizeClass = sizes[size] || sizes.md;
  
  const renderFallback = () => {
    if (typeof fallback === 'string') {
      return <span className="flex h-full w-full items-center justify-center bg-hero-muted text-hero-primary font-medium">{fallback}</span>;
    }
    return fallback;
  };
  
  return (
    <div 
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full",
        sizeClass,
        className
      )}
      {...props}
    >
      {!imageError && src ? (
        <img
          className="aspect-square h-full w-full"
          src={src}
          alt={alt}
          onError={() => setImageError(true)}
        />
      ) : renderFallback()}
    </div>
  );
};

export default Avatar;
