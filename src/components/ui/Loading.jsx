import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const Loading = ({ message = "Loading...", type = "default" }) => {
  if (type === "generation") {
    return (
      <Card className="p-8 text-center bg-gradient-to-br from-surface to-primary-800">
        <div className="flex flex-col items-center space-y-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="p-4 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full"
          >
            <ApperIcon name="Film" size={32} className="text-white" />
          </motion.div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-display font-bold text-paper">
              Crafting Your Script
            </h3>
            <p className="text-primary-300">
              AI is analyzing your topic and generating a professional screenplay...
            </p>
          </div>
          
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-2 h-2 bg-accent-500 rounded-full"
              />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (type === "list") {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-700 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-primary-700 rounded w-3/4"></div>
                  <div className="h-3 bg-primary-800 rounded w-1/2"></div>
                  <div className="h-3 bg-primary-800 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Card className="p-8 text-center">
      <div className="flex flex-col items-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <ApperIcon name="Loader2" size={24} className="text-accent-500" />
        </motion.div>
        <p className="text-primary-300">{message}</p>
      </div>
    </Card>
  );
};

export default Loading;