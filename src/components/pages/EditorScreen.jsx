import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ScreenplayViewer from "@/components/organisms/ScreenplayViewer";
import ScriptEditor from "@/components/organisms/ScriptEditor";
import ExportModal from "@/components/molecules/ExportModal";
import ApperIcon from "@/components/ApperIcon";
import { scriptService } from "@/services/api/scriptService";

const EditorScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [script, setScript] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("preview");
  const [exportModalOpen, setExportModalOpen] = useState(false);

  useEffect(() => {
    loadScript();
  }, [id]);

  const loadScript = async () => {
    if (!id) {
      setError("No script ID provided");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const scriptData = await scriptService.getById(id);
      setScript(scriptData);
    } catch (err) {
      console.error("Error loading script:", err);
      setError("Failed to load script. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedScript) => {
    try {
      const savedScript = await scriptService.update(id, updatedScript);
      setScript(savedScript);
      toast.success("Script saved successfully!");
    } catch (error) {
      console.error("Error saving script:", error);
      toast.error("Failed to save script. Please try again.");
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this script? This action cannot be undone.")) {
      return;
    }

    try {
      await scriptService.delete(id);
      toast.success("Script deleted successfully!");
      navigate("/library");
    } catch (error) {
      console.error("Error deleting script:", error);
      toast.error("Failed to delete script. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Loading message="Loading script..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Error 
          message={error} 
          onRetry={loadScript}
          title="Script Not Found"
        />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-73px)] flex flex-col">
      {/* Header */}
      <div className="bg-surface border-b border-primary-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/library")}
            >
              <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
              Back to Library
            </Button>
            <div>
              <h1 className="text-xl font-display font-bold text-paper">
                {script?.title}
              </h1>
              <p className="text-sm text-primary-400">
                {script?.style} • {script?.runtime}s runtime
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExportModalOpen(true)}
            >
              <ApperIcon name="Download" size={16} className="mr-2" />
              Export
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
            >
              <ApperIcon name="Trash2" size={16} className="mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mt-4">
          {[
            { id: "preview", label: "Preview", icon: "Eye" },
            { id: "edit", label: "Edit", icon: "Edit" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-accent-500 text-white shadow-elevation"
                  : "text-primary-300 hover:text-paper hover:bg-primary-700"
              }`}
            >
              <ApperIcon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="h-full"
        >
          {activeTab === "preview" ? (
            <div className="h-full overflow-auto p-6">
              <ScreenplayViewer script={script} />
            </div>
          ) : (
            <div className="h-full overflow-auto p-6">
              <ScriptEditor 
                script={script} 
                onSave={handleSave}
              />
            </div>
          )}
        </motion.div>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        script={script}
      />
    </div>
  );
};

export default EditorScreen;