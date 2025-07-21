import React from "react";
import { cn } from "@/utils/cn";

const FormField = ({ label, error, required, children, className }) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-paper">
          {label}
          {required && <span className="text-accent-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export default FormField;