import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  title = "Oops!" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-[400px]"
    >
      <Card className="p-8 text-center max-w-md mx-auto">
        <div className="flex flex-col items-center space-y-6">
          <div className="p-4 bg-red-500/10 rounded-full border border-red-500/20">
            <ApperIcon name="AlertTriangle" size={32} className="text-red-400" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-display font-bold text-paper">{title}</h3>
            <p className="text-primary-300">{message}</p>
          </div>
          
          {onRetry && (
            <Button 
              onClick={onRetry}
              variant="outline"
              className="border-accent-500 text-accent-500 hover:bg-accent-500 hover:text-white"
            >
              <ApperIcon name="RefreshCw" size={16} className="mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default Error;