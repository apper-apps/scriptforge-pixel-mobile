import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const ScriptEditor = ({ script, onSave, className }) => {
  const [editedScript, setEditedScript] = useState(script || {});
  const [editingScene, setEditingScene] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEditedScript(script || {});
  }, [script]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(editedScript);
    } finally {
      setSaving(false);
    }
  };

  const updateScriptField = (field, value) => {
    setEditedScript(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateScene = (sceneId, updates) => {
    setEditedScript(prev => ({
      ...prev,
      scenes: prev.scenes?.map(scene => 
        scene.id === sceneId ? { ...scene, ...updates } : scene
      ) || []
    }));
  };

  const updateDialogue = (sceneId, dialogueIndex, updates) => {
    setEditedScript(prev => ({
      ...prev,
      scenes: prev.scenes?.map(scene => 
        scene.id === sceneId 
          ? {
              ...scene,
              dialogue: scene.dialogue?.map((line, index) =>
                index === dialogueIndex ? { ...line, ...updates } : line
              ) || []
            }
          : scene
      ) || []
    }));
  };

  if (!script) {
    return (
      <Card className={cn("p-8 text-center", className)}>
        <p className="text-primary-400">No script selected for editing</p>
      </Card>
    );
  }

  return (
    <Card className={cn("", className)}>
      <div className="p-6 border-b border-primary-700 flex items-center justify-between">
        <h2 className="text-lg font-display font-bold text-paper">Script Editor</h2>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                <ApperIcon name="Loader2" size={16} />
              </motion.div>
              Saving...
            </>
          ) : (
            <>
              <ApperIcon name="Save" size={16} className="mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Title">
            <Input
              value={editedScript.title || ""}
              onChange={(e) => updateScriptField("title", e.target.value)}
              placeholder="Script title"
            />
          </FormField>
          <FormField label="Topic">
            <Input
              value={editedScript.topic || ""}
              onChange={(e) => updateScriptField("topic", e.target.value)}
              placeholder="Script topic"
            />
          </FormField>
        </div>

        <FormField label="Story">
          <Textarea
            value={editedScript.story || ""}
            onChange={(e) => updateScriptField("story", e.target.value)}
            placeholder="Story synopsis"
            rows={4}
          />
        </FormField>

        {/* Scenes */}
        <div>
          <h3 className="text-md font-display font-bold text-paper mb-4">Scenes</h3>
          <div className="space-y-4">
            {editedScript.scenes?.map((scene) => (
              <Card key={scene.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-paper">Scene {scene.number}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingScene(editingScene === scene.id ? null : scene.id)}
                  >
                    <ApperIcon 
                      name={editingScene === scene.id ? "ChevronUp" : "ChevronDown"} 
                      size={16} 
                    />
                  </Button>
                </div>

                <FormField label="Scene Heading">
                  <Input
                    value={scene.heading || ""}
                    onChange={(e) => updateScene(scene.id, { heading: e.target.value })}
                    placeholder="INT. LOCATION - TIME"
                  />
                </FormField>

                {editingScene === scene.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-4"
                  >
                    <FormField label="Action">
                      <Textarea
                        value={scene.action || ""}
                        onChange={(e) => updateScene(scene.id, { action: e.target.value })}
                        placeholder="Scene action description"
                        rows={3}
                      />
                    </FormField>

                    {/* Dialogue Lines */}
                    {scene.dialogue?.map((line, index) => (
                      <div key={index} className="border border-primary-600 rounded-lg p-3 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <FormField label="Character">
                            <Input
                              value={line.character || ""}
                              onChange={(e) => updateDialogue(scene.id, index, { character: e.target.value })}
                              placeholder="CHARACTER NAME"
                            />
                          </FormField>
                          <FormField label="Parenthetical">
                            <Input
                              value={line.parenthetical || ""}
                              onChange={(e) => updateDialogue(scene.id, index, { parenthetical: e.target.value })}
                              placeholder="(action)"
                            />
                          </FormField>
                        </div>
                        <FormField label="Dialogue">
                          <Textarea
                            value={line.text || ""}
                            onChange={(e) => updateDialogue(scene.id, index, { text: e.target.value })}
                            placeholder="Character dialogue"
                            rows={2}
                          />
                        </FormField>
                      </div>
                    ))}
                  </motion.div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ScriptEditor;