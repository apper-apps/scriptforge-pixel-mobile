import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const ExportModal = ({ isOpen, onClose, script }) => {
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format) => {
    setExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (format === "pdf") {
        // In a real app, you would generate and download a PDF
        toast.success("PDF exported successfully!");
      } else if (format === "markdown") {
        // In a real app, you would generate and download a Markdown file
        const markdown = generateMarkdown(script);
        downloadFile(markdown, `${script.title}.md`, "text/markdown");
        toast.success("Markdown file downloaded!");
      }
      
      onClose();
    } catch (error) {
      toast.error("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const generateMarkdown = (script) => {
    let markdown = `# ${script.title}\n\n`;
    markdown += `**Topic:** ${script.topic}\n`;
    markdown += `**Style:** ${script.style}\n`;
    markdown += `**Runtime:** ${script.runtime} seconds\n\n`;
    markdown += `## Story\n\n${script.story}\n\n`;
    markdown += `## Screenplay\n\n`;
    
    script.scenes?.forEach((scene) => {
      markdown += `### ${scene.heading}\n\n`;
      markdown += `${scene.action}\n\n`;
      
      scene.dialogue?.forEach((line) => {
        markdown += `**${line.character}**`;
        if (line.parenthetical) {
          markdown += ` *(${line.parenthetical})*`;
        }
        markdown += `\n${line.text}\n\n`;
      });
      
      if (scene.cameraNotes?.length > 0) {
        markdown += `*Camera Notes: ${scene.cameraNotes.join(", ")}*\n\n`;
      }
    });
    
    return markdown;
  };

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-surface border border-primary-600 rounded-lg p-6 w-full max-w-md mx-4 shadow-elevation"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-display text-paper">Export Script</h3>
              <button
                onClick={onClose}
                className="text-primary-400 hover:text-paper transition-colors"
                disabled={exporting}
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
            
            <p className="text-primary-300 mb-6">
              Choose your preferred export format for "{script?.title}"
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={() => handleExport("pdf")}
                disabled={exporting}
                className="w-full justify-start"
                variant="outline"
              >
                <ApperIcon name="FileText" size={20} className="mr-3" />
                Export as PDF
                <span className="ml-auto text-sm text-primary-400">
                  Production ready
                </span>
              </Button>
              
              <Button
                onClick={() => handleExport("markdown")}
                disabled={exporting}
                className="w-full justify-start"
                variant="outline"
              >
                <ApperIcon name="Download" size={20} className="mr-3" />
                Export as Markdown
                <span className="ml-auto text-sm text-primary-400">
                  Text format
                </span>
              </Button>
            </div>
            
            {exporting && (
              <div className="mt-4 flex items-center justify-center space-x-2 text-accent-500">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <ApperIcon name="Film" size={20} />
                </motion.div>
                <span>Exporting...</span>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ExportModal;