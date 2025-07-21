import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Navigation from "@/components/molecules/Navigation";

const MobileSidebar = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-64 bg-surface border-r border-primary-200 z-50 lg:hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-primary-200 flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-3" onClick={onClose}>
                <div className="p-2 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg">
                  <ApperIcon name="Film" size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-display font-bold text-primary-900">ScriptForge</h1>
                  <p className="text-xs text-primary-600">AI Story Builder</p>
                </div>
              </Link>
              <button
                onClick={onClose}
                className="text-primary-400 hover:text-paper transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 p-6">
              <div onClick={onClose}>
                <Navigation mobile />
              </div>
            </div>

{/* Footer */}
            <div className="p-6 border-t border-primary-200">
              <div className="bg-gradient-to-r from-accent-500/10 to-accent-600/10 border border-accent-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <ApperIcon name="Lightbulb" size={16} className="text-accent-500" />
                  <span className="text-sm font-medium text-primary-900">Pro Tip</span>
                </div>
                <p className="text-xs text-primary-600">
                  Use specific topics for better AI-generated scripts.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;