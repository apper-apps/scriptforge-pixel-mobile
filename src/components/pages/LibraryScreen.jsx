import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { scriptService } from "@/services/api/scriptService";

const LibraryScreen = () => {
  const navigate = useNavigate();
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStyle, setFilterStyle] = useState("all");

  useEffect(() => {
    loadScripts();
  }, []);

  const loadScripts = async () => {
    try {
      setLoading(true);
      setError("");
      const scriptsData = await scriptService.getAll();
      setScripts(scriptsData);
    } catch (err) {
      console.error("Error loading scripts:", err);
      setError("Failed to load scripts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (scriptId, scriptTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${scriptTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await scriptService.delete(scriptId);
      setScripts(prev => prev.filter(s => s.Id !== scriptId));
      toast.success("Script deleted successfully!");
    } catch (error) {
      console.error("Error deleting script:", error);
      toast.error("Failed to delete script. Please try again.");
    }
  };

  const filteredScripts = scripts.filter(script => {
    const matchesSearch = script.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         script.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStyle === "all" || script.style === filterStyle;
    return matchesSearch && matchesFilter;
  });

  const getStyleColor = (style) => {
    switch (style) {
      case "comedy": return "bg-yellow-500";
      case "thriller": return "bg-red-500";
      case "educational": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getStyleIcon = (style) => {
    switch (style) {
      case "comedy": return "Laugh";
      case "thriller": return "Zap";
      case "educational": return "BookOpen";
      default: return "FileText";
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Loading type="list" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Error 
          message={error} 
          onRetry={loadScripts}
          title="Failed to Load Scripts"
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-paper mb-2">
            Script Library
          </h1>
          <p className="text-primary-300">
            Manage and organize your AI-generated scripts
          </p>
        </div>
        
        <Button
          onClick={() => navigate("/create")}
          className="mt-4 lg:mt-0 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          New Script
        </Button>
      </div>

      {scripts.length === 0 ? (
        <Empty
          title="No Scripts Yet"
          message="Start creating amazing scripts with AI-powered story generation"
          actionLabel="Create Your First Script"
          onAction={() => navigate("/create")}
          icon="Clapperboard"
        />
      ) : (
        <>
          {/* Filters */}
          <Card className="p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <ApperIcon 
                    name="Search" 
                    size={16} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400" 
                  />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search scripts..."
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex space-x-2">
                {["all", "comedy", "thriller", "educational"].map((style) => (
                  <button
                    key={style}
                    onClick={() => setFilterStyle(style)}
                    className={`px-4 py-2 rounded-lg capitalize transition-all duration-200 ${
                      filterStyle === style
                        ? "bg-accent-500 text-white shadow-elevation"
                        : "bg-surface text-primary-300 hover:text-paper hover:bg-primary-700"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Scripts Grid */}
          {filteredScripts.length === 0 ? (
            <Empty
              title="No Scripts Found"
              message="Try adjusting your search or filter criteria"
              actionLabel="Clear Filters"
              onAction={() => {
                setSearchTerm("");
                setFilterStyle("all");
              }}
              icon="Search"
            />
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {filteredScripts.map((script, index) => (
                <motion.div
                  key={script.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="p-6 hover:shadow-elevation-hover transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-2 rounded-lg ${getStyleColor(script.style)}`}>
                        <ApperIcon 
                          name={getStyleIcon(script.style)} 
                          size={20} 
                          className="text-white" 
                        />
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => navigate(`/editor/${script.Id}`)}
                          className="text-primary-400 hover:text-accent-500 transition-colors"
                        >
                          <ApperIcon name="Edit" size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(script.Id, script.title)}
                          className="text-primary-400 hover:text-red-400 transition-colors"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-display font-bold text-paper mb-2 line-clamp-2">
                      {script.title}
                    </h3>
                    
                    <p className="text-primary-300 text-sm mb-4 line-clamp-3">
                      {script.topic}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-primary-400">
                      <span className="capitalize">{script.style}</span>
                      <span>{script.runtime}s</span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-primary-700">
                      <span className="text-xs text-primary-400">
                        {format(new Date(script.createdAt), "MMM d, yyyy")}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/editor/${script.Id}`)}
                      >
                        <ApperIcon name="Eye" size={14} className="mr-1" />
                        View
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default LibraryScreen;