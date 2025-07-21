import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Navigation = ({ className, mobile = false }) => {
  const navItems = [
    { path: "/create", label: "Create", icon: "Plus" },
    { path: "/library", label: "Library", icon: "Library" },
  ];

  return (
    <nav className={cn("space-y-2", className)}>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-surface hover:scale-105",
              isActive
                ? "bg-accent-500 text-white shadow-elevation"
                : "text-primary-300 hover:text-paper",
              mobile && "w-full"
            )
          }
        >
          <ApperIcon name={item.icon} size={20} />
          <span className="font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;