import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ className, ...props }, ref) => {
  return (
<div
      ref={ref}
      className={cn(
        "rounded-lg border border-primary-200 bg-surface shadow-elevation transition-all duration-200 hover:shadow-elevation-hover",
        className
      )}
      {...props}
    />
  );
});

Card.displayName = "Card";

export default Card;