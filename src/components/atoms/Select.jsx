import React from "react";
import { cn } from "@/utils/cn";

const Select = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <select
      className={cn(
        "flex w-full rounded-md border border-primary-600 bg-surface px-3 py-2 text-sm text-paper focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;