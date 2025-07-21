import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import FormField from "@/components/molecules/FormField";
import StyleSelector from "@/components/molecules/StyleSelector";
import Loading from "@/components/ui/Loading";
import ApperIcon from "@/components/ApperIcon";
import { scriptService } from "@/services/api/scriptService";

const CreateScreen = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("comedy");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic for your script");
      return;
    }

    setGenerating(true);
    
    try {
      const scriptData = await scriptService.generateScript(topic.trim(), style);
      const savedScript = await scriptService.create(scriptData);
      
      toast.success("Script generated successfully!");
      navigate(`/editor/${savedScript.Id}`);
    } catch (error) {
      console.error("Error generating script:", error);
      toast.error("Failed to generate script. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !generating) {
      handleGenerate();
    }
  };

  if (generating) {
    return (
      <div className="p-6">
        <Loading type="generation" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gradient-to-br from-background via-primary-900 to-background">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full mb-6"
            >
              <ApperIcon name="Clapperboard" size={48} className="text-white" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-display font-bold text-paper mb-4">
              Create Your Story
            </h1>
            <p className="text-lg text-primary-300 max-w-lg mx-auto">
              Transform any topic into a professional 2-minute screenplay with AI-powered story generation
            </p>
          </div>

          {/* Form */}
          <Card className="p-8 bg-surface/50 backdrop-blur-sm border-primary-600">
            <div className="space-y-6">
              <FormField 
                label="What's your story about?" 
                required
              >
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., A detective solving a mystery in a coffee shop"
                  className="text-lg py-3"
                  autoFocus
                />
                <p className="text-sm text-primary-400 mt-2">
                  Be specific for better results. Try "robot barista malfunction" instead of just "robots"
                </p>
              </FormField>

              <StyleSelector 
                value={style} 
                onChange={setStyle} 
              />

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleGenerate}
                  disabled={!topic.trim() || generating}
                  className="w-full py-4 text-lg bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 shadow-lg"
                >
                  <ApperIcon name="Sparkles" size={20} className="mr-3" />
                  Generate Script
                </Button>
              </motion.div>
            </div>
          </Card>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[
              {
                icon: "Target",
                title: "Be Specific",
                description: "Detailed topics create better scripts"
              },
              {
                icon: "Clock",
                title: "Perfect Length",
                description: "Optimized for 2-minute productions"
              },
              {
                icon: "Edit",
                title: "Fully Editable",
                description: "Customize every line after generation"
              }
            ].map((tip, index) => (
              <Card key={index} className="p-4 text-center border-primary-700 hover:border-accent-500/50 transition-colors">
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-2 bg-accent-500/10 rounded-lg">
                    <ApperIcon name={tip.icon} size={20} className="text-accent-500" />
                  </div>
                  <h3 className="font-medium text-paper">{tip.title}</h3>
                  <p className="text-sm text-primary-400">{tip.description}</p>
                </div>
              </Card>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateScreen;