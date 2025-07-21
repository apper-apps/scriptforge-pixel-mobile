import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const StyleSelector = ({ value, onChange, className }) => {
  const styles = [
    {
      id: "comedy",
      name: "Comedy",
      icon: "Laugh",
      color: "bg-yellow-500",
      description: "Light-hearted and humorous"
    },
    {
      id: "thriller",
      name: "Thriller",
      icon: "Zap",
      color: "bg-red-500",
      description: "Suspenseful and intense"
    },
    {
      id: "educational",
      name: "Educational",
      icon: "BookOpen",
      color: "bg-blue-500",
      description: "Informative and clear"
    }
  ];

  return (
    <div className={cn("space-y-3", className)}>
      <label className="text-sm font-medium text-paper">Style Preset</label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {styles.map((style) => (
          <button
            key={style.id}
            type="button"
            onClick={() => onChange(style.id)}
            className={cn(
              "p-4 rounded-lg border-2 transition-all duration-200 text-left hover:scale-105",
              value === style.id
                ? "border-accent-500 bg-accent-500/10 shadow-elevation"
                : "border-primary-600 bg-surface hover:border-accent-400"
            )}
          >
            <div className="flex items-center space-x-3">
              <div className={cn("p-2 rounded-full", style.color)}>
                <ApperIcon name={style.icon} size={16} className="text-white" />
              </div>
              <div>
                <h3 className="font-medium text-paper">{style.name}</h3>
                <p className="text-xs text-primary-400">{style.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;