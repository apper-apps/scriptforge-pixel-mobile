import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Navigation from "@/components/molecules/Navigation";

const Sidebar = ({ className }) => {
  return (
    <div className={cn("w-64 bg-surface border-r border-primary-700 flex flex-col", className)}>
      {/* Logo */}
      <div className="p-6 border-b border-primary-700">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="p-2 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg group-hover:scale-110 transition-transform duration-200">
            <ApperIcon name="Film" size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-paper">ScriptForge</h1>
            <p className="text-xs text-primary-400">AI Story Builder</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-6">
        <Navigation />
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-primary-700">
        <div className="bg-gradient-to-r from-accent-500/10 to-accent-600/10 border border-accent-500/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ApperIcon name="Lightbulb" size={16} className="text-accent-500" />
            <span className="text-sm font-medium text-paper">Pro Tip</span>
          </div>
          <p className="text-xs text-primary-300">
            Use specific topics for better AI-generated scripts. Try "robot barista malfunction" instead of just "robots".
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;