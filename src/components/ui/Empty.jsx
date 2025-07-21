import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "Nothing here yet", 
  message = "Get started by creating your first item", 
  actionLabel = "Get Started",
  onAction,
  icon = "FileText"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center min-h-[400px]"
    >
<Card className="p-8 text-center max-w-md mx-auto">
        <div className="flex flex-col items-center space-y-6">
          <div className="p-6 bg-gradient-to-br from-accent-500/20 to-accent-600/20 rounded-full border border-accent-500/30">
            <ApperIcon name={icon} size={48} className="text-accent-500" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-display font-bold text-primary-900">{title}</h3>
            <p className="text-primary-600">{message}</p>
          </div>
          
          {onAction && (
            <Button 
              onClick={onAction}
              className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700"
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              {actionLabel}
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default Empty;