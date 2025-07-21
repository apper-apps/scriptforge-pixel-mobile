import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-accent-500 hover:bg-accent-600 text-white border-accent-500",
    secondary: "bg-surface hover:bg-primary-700 text-paper border-primary-600",
    outline: "border-2 border-accent-500 text-accent-500 hover:bg-accent-500 hover:text-white bg-transparent",
    ghost: "hover:bg-surface text-paper border-transparent",
    danger: "bg-red-500 hover:bg-red-600 text-white border-red-500"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md border font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none hover:scale-105 shadow-elevation hover:shadow-elevation-hover",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;