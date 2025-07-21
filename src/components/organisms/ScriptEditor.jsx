import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Card from "@/components/atoms/Card";
import Textarea from "@/components/atoms/Textarea";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { calculateScriptRuntime, getRuntimeStatus } from "@/utils/runtimeCalculator";
import { cn } from "@/utils/cn";

const ScriptEditor = ({ script, onSave, className }) => {
  const [editedScript, setEditedScript] = useState(script || {});
  const [editingScene, setEditingScene] = useState(null);
  const [saving, setSaving] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const [sceneValidation, setSceneValidation] = useState({});
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Calculate runtime in real-time with detailed breakdown
  const runtimeData = useMemo(() => {
    return calculateScriptRuntime(editedScript);
  }, [editedScript]);

  const runtimeStatus = useMemo(() => {
    return getRuntimeStatus(runtimeData.total);
  }, [runtimeData.total]);

  // Extract all characters from script for consistency
  const allCharacters = useMemo(() => {
    if (!editedScript.scenes) return [];
    const characters = new Set();
    editedScript.scenes.forEach(scene => {
      scene.dialogue?.forEach(line => {
        if (line.character) characters.add(line.character.toUpperCase());
      });
    });
    return Array.from(characters).sort();
  }, [editedScript]);

  useEffect(() => {
    setEditedScript(script || {});
  }, [script]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const validatedScript = validateScript(editedScript);
      await onSave(validatedScript);
    } finally {
      setSaving(false);
    }
  };

  const validateScript = (script) => {
    const validation = {};
    script.scenes?.forEach(scene => {
      const errors = [];
      if (!scene.heading) errors.push('Missing scene heading');
      if (!scene.action && (!scene.dialogue || scene.dialogue.length === 0)) {
        errors.push('Scene needs action or dialogue');
      }
      validation[scene.id] = errors;
    });
    setSceneValidation(validation);
    return script;
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

  const addNewScene = () => {
    const newScene = {
      id: `scene-${Date.now()}`,
      number: (editedScript.scenes?.length || 0) + 1,
      heading: '',
      action: '',
      dialogue: [],
      cameraNotes: []
    };
    setEditedScript(prev => ({
      ...prev,
      scenes: [...(prev.scenes || []), newScene]
    }));
    setEditingScene(newScene.id);
  };

  const deleteScene = (sceneId) => {
    if (confirm('Are you sure you want to delete this scene?')) {
      setEditedScript(prev => ({
        ...prev,
        scenes: prev.scenes?.filter(scene => scene.id !== sceneId) || []
      }));
      // Renumber remaining scenes
      setTimeout(() => {
        setEditedScript(prev => ({
          ...prev,
          scenes: prev.scenes?.map((scene, index) => ({
            ...scene,
            number: index + 1
          })) || []
        }));
      }, 100);
    }
  };

  const moveScene = (sceneId, direction) => {
    const scenes = [...(editedScript.scenes || [])];
    const currentIndex = scenes.findIndex(scene => scene.id === sceneId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= scenes.length) return;
    
    [scenes[currentIndex], scenes[newIndex]] = [scenes[newIndex], scenes[currentIndex]];
    
    // Renumber scenes
    scenes.forEach((scene, index) => {
      scene.number = index + 1;
    });
    
    setEditedScript(prev => ({
      ...prev,
      scenes
    }));
  };

// Generate smart character suggestions based on topic and style
  const getCharacterSuggestions = useMemo(() => {
    if (!editedScript.topic) return [];
    
    const topic = editedScript.topic.toLowerCase();
    const style = editedScript.style || 'comedy';
    
    const contextualCharacters = {
      detective: ['DETECTIVE', 'SUSPECT', 'WITNESS', 'VICTIM', 'PARTNER', 'INFORMANT'],
      coffee: ['BARISTA', 'CUSTOMER', 'MANAGER', 'SUPPLIER', 'REGULAR', 'CRITIC'],
      cooking: ['CHEF', 'SOUS CHEF', 'CUSTOMER', 'FOOD CRITIC', 'SERVER', 'DISHWASHER'],
      school: ['TEACHER', 'STUDENT', 'PRINCIPAL', 'PARENT', 'JANITOR', 'COUNSELOR'],
      office: ['MANAGER', 'EMPLOYEE', 'INTERN', 'CLIENT', 'RECEPTIONIST', 'CEO'],
      medical: ['DOCTOR', 'NURSE', 'PATIENT', 'SURGEON', 'PARAMEDIC', 'SPECIALIST'],
      space: ['ASTRONAUT', 'MISSION CONTROL', 'ALIEN', 'CAPTAIN', 'ENGINEER', 'PILOT'],
      robot: ['TECHNICIAN', 'ROBOT', 'SCIENTIST', 'CUSTOMER', 'SECURITY', 'AI'],
      phone: ['CALLER', 'OPERATOR', 'TECHNICIAN', 'CUSTOMER', 'BOSS', 'STRANGER'],
      time: ['TIME TRAVELER', 'HISTORIAN', 'SCIENTIST', 'PAST SELF', 'FUTURE SELF', 'GUARDIAN']
    };
    
    // Find matching context
    let suggestions = ['PROTAGONIST', 'FRIEND', 'STRANGER', 'NARRATOR'];
    for (const [key, chars] of Object.entries(contextualCharacters)) {
      if (topic.includes(key) || key.includes(topic.split(' ')[0])) {
        suggestions = chars;
        break;
      }
    }
    
    // Add style-specific characters
    if (style === 'thriller') {
      suggestions = [...suggestions, 'MYSTERIOUS VOICE', 'SHADOW FIGURE', 'WHISTLEBLOWER'];
    } else if (style === 'comedy') {
      suggestions = [...suggestions, 'COMIC RELIEF', 'STRAIGHT MAN', 'BUMBLING FOOL'];
    } else if (style === 'educational') {
      suggestions = [...suggestions, 'EXPERT', 'STUDENT', 'DEMONSTRATOR'];
    }
    
    return [...new Set(suggestions)]; // Remove duplicates
  }, [editedScript.topic, editedScript.style]);

  // Generate contextual dialogue suggestions
  const getDialogueSuggestions = (character, topic, style) => {
    const suggestions = [];
    
    if (!character || !topic) return suggestions;
    
    const char = character.toUpperCase();
    const topicLower = topic.toLowerCase();
    
    // Character-specific dialogue patterns
    if (char.includes('DETECTIVE')) {
      suggestions.push(
        "Something doesn't add up here.",
        "I've seen this pattern before.",
        "The evidence suggests otherwise."
      );
    } else if (char.includes('CHEF') || char.includes('COOK')) {
      suggestions.push(
        "The secret ingredient is timing.",
        "This recipe has been in my family for generations.",
        "Taste is everything in this business."
      );
    } else if (char.includes('SCIENTIST') || char.includes('DOCTOR')) {
      suggestions.push(
        "The data doesn't support that hypothesis.",
        "We need to run more tests.",
        "This could change everything we know."
      );
    } else if (char.includes('TEACHER') || char.includes('PROFESSOR')) {
      suggestions.push(
        "Let me explain this simply.",
        "This is a perfect example of what we discussed.",
        "Does anyone have questions?"
      );
    }
    
    // Style-specific additions
    if (style === 'comedy') {
      suggestions.push(
        "Well, this is awkward.",
        "That's not supposed to happen!",
        "I meant to do that... sort of."
      );
    } else if (style === 'thriller') {
      suggestions.push(
        "We're being watched.",
        "Trust no one.",
        "This goes deeper than we thought."
      );
    }
    
    return suggestions;
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

  const addDialogueLine = (sceneId) => {
    const newLine = {
      character: selectedCharacter || '',
      text: '',
      parenthetical: ''
    };
    setEditedScript(prev => ({
      ...prev,
      scenes: prev.scenes?.map(scene => 
        scene.id === sceneId 
          ? {
              ...scene,
              dialogue: [...(scene.dialogue || []), newLine]
            }
          : scene
      ) || []
    }));
  };

  const deleteDialogueLine = (sceneId, dialogueIndex) => {
    setEditedScript(prev => ({
      ...prev,
      scenes: prev.scenes?.map(scene => 
        scene.id === sceneId 
          ? {
              ...scene,
              dialogue: scene.dialogue?.filter((_, index) => index !== dialogueIndex) || []
            }
          : scene
      ) || []
    }));
  };

  const addCameraNote = (sceneId) => {
    setEditedScript(prev => ({
      ...prev,
      scenes: prev.scenes?.map(scene => 
        scene.id === sceneId 
          ? {
              ...scene,
              cameraNotes: [...(scene.cameraNotes || []), '']
            }
          : scene
      ) || []
    }));
  };

  const updateCameraNote = (sceneId, noteIndex, value) => {
    setEditedScript(prev => ({
      ...prev,
      scenes: prev.scenes?.map(scene => 
        scene.id === sceneId 
          ? {
              ...scene,
              cameraNotes: scene.cameraNotes?.map((note, index) =>
                index === noteIndex ? value : note
              ) || []
            }
          : scene
      ) || []
    }));
  };

  const deleteCameraNote = (sceneId, noteIndex) => {
    setEditedScript(prev => ({
      ...prev,
      scenes: prev.scenes?.map(scene => 
        scene.id === sceneId 
          ? {
              ...scene,
              cameraNotes: scene.cameraNotes?.filter((_, index) => index !== noteIndex) || []
            }
          : scene
      ) || []
    }));
  };

  const formatHeading = (heading) => {
    return heading.toUpperCase().replace(/\s+/g, ' ').trim();
  };

  const formatCharacterName = (name) => {
    return name.toUpperCase().replace(/\s+/g, ' ').trim();
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
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-display font-bold text-paper">Script Editor</h2>
<div className="flex items-center gap-2 px-3 py-1 bg-primary-800 rounded-md">
            <ApperIcon name="Clock" size={14} className="text-primary-300" />
            <span className="text-sm text-primary-300">Runtime:</span>
            <span className={cn("text-sm font-mono font-medium", runtimeStatus.color)}>
              {runtimeStatus.formatted}
            </span>
            <span className="text-xs text-primary-400">({runtimeData.total}s)</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 bg-primary-800/50 rounded text-xs">
            <span className="text-primary-400">D: {runtimeData.dialogue}s</span>
            <span className="text-primary-400">A: {runtimeData.action}s</span>
            <span className="text-primary-400">T: {runtimeData.transitions}s</span>
          </div>
          {runtimeStatus.message !== 'Good length' && (
            <div className="flex items-center gap-1">
              <ApperIcon 
                name={runtimeStatus.status.includes('short') ? "AlertTriangle" : "AlertCircle"} 
                size={14} 
                className={runtimeStatus.color} 
              />
              <span className={cn("text-xs", runtimeStatus.color)}>
                {runtimeStatus.message}
              </span>
            </div>
          )}
</div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
          >
            <ApperIcon name="Settings" size={16} className="mr-2" />
            Advanced
          </Button>
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

        {showAdvancedOptions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-primary-50 border border-primary-200 rounded-lg p-4 space-y-4"
          >
            <h4 className="font-medium text-paper">Advanced Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Writer">
                <Input
                  value={editedScript.writer || ""}
                  onChange={(e) => updateScriptField("writer", e.target.value)}
                  placeholder="Writer name"
                />
              </FormField>
              <FormField label="Draft">
                <Input
                  value={editedScript.draft || ""}
                  onChange={(e) => updateScriptField("draft", e.target.value)}
                  placeholder="Draft version"
                />
              </FormField>
            </div>
            <FormField label="Notes">
              <Textarea
                value={editedScript.notes || ""}
                onChange={(e) => updateScriptField("notes", e.target.value)}
                placeholder="Production notes"
                rows={2}
              />
            </FormField>
            {allCharacters.length > 0 && (
              <FormField label="Characters in Script">
                <div className="flex flex-wrap gap-2">
                  {allCharacters.map(character => (
                    <span
                      key={character}
                      className="px-2 py-1 bg-primary-100 text-primary-800 rounded text-sm cursor-pointer hover:bg-primary-200"
                      onClick={() => setSelectedCharacter(character)}
                    >
                      {character}
                    </span>
                  ))}
                </div>
              </FormField>
            )}
          </motion.div>
        )}

        {/* Scenes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-display font-bold text-paper">Scenes</h3>
            <Button onClick={addNewScene} size="sm">
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Scene
            </Button>
          </div>
          <div className="space-y-4">
            {editedScript.scenes?.map((scene) => (
<Card key={scene.id} className="p-4 relative">
                {sceneValidation[scene.id]?.length > 0 && (
                  <div className="absolute top-2 right-2">
                    <ApperIcon name="AlertTriangle" size={16} className="text-yellow-500" />
                  </div>
                )}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-paper">Scene {scene.number}</h4>
                    {sceneValidation[scene.id]?.length > 0 && (
                      <span className="text-xs text-yellow-600">
                        {sceneValidation[scene.id].join(', ')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveScene(scene.id, 'up')}
                      disabled={scene.number === 1}
                    >
                      <ApperIcon name="ChevronUp" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveScene(scene.id, 'down')}
                      disabled={scene.number === (editedScript.scenes?.length || 0)}
                    >
                      <ApperIcon name="ChevronDown" size={14} />
                    </Button>
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteScene(scene.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <ApperIcon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>

                <FormField label="Scene Heading">
<Input
                    value={scene.heading || ""}
                    onChange={(e) => updateScene(scene.id, { heading: formatHeading(e.target.value) })}
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
                            <div className="relative">
                              <Input
                                value={line.character || ""}
                                onChange={(e) => updateDialogue(scene.id, index, { character: formatCharacterName(e.target.value) })}
                                placeholder="CHARACTER NAME"
                                list={`characters-${scene.id}-${index}`}
                              />
                              <datalist id={`characters-${scene.id}-${index}`}>
                                {getCharacterSuggestions.map(char => (
                                  <option key={char} value={char} />
                                ))}
                                {allCharacters.map(char => (
                                  <option key={char} value={char} />
                                ))}
                              </datalist>
                            </div>
                          </FormField>
                          <FormField label="Parenthetical">
                            <Input
                              value={line.parenthetical || ""}
                              onChange={(e) => updateDialogue(scene.id, index, { parenthetical: e.target.value })}
                              placeholder="(action)"
                            />
                          </FormField>
                        </div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 space-y-2">
                            <FormField label="Dialogue">
                              <Textarea
                                value={line.text || ""}
                                onChange={(e) => updateDialogue(scene.id, index, { text: e.target.value })}
                                placeholder={`What would ${line.character || 'this character'} say in this situation?`}
                                rows={2}
                              />
                            </FormField>
                            {line.character && editedScript.topic && (
                              <div className="text-xs text-primary-600">
                                <span className="font-medium">Suggestions: </span>
                                {getDialogueSuggestions(line.character, editedScript.topic, editedScript.style).slice(0, 2).map((suggestion, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => updateDialogue(scene.id, index, { text: suggestion })}
                                    className="mr-2 underline hover:text-accent-600 cursor-pointer"
                                  >
                                    "{suggestion}"
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteDialogueLine(scene.id, index)}
                            className="mt-6 text-red-600"
                          >
                            <ApperIcon name="Trash2" size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex items-center gap-2 pt-2 border-t border-primary-200">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addDialogueLine(scene.id)}
                      >
                        <ApperIcon name="Plus" size={14} className="mr-1" />
                        Add Dialogue
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addCameraNote(scene.id)}
                      >
                        <ApperIcon name="Camera" size={14} className="mr-1" />
                        Camera Note
                      </Button>
                    </div>

                    {/* Camera Notes */}
                    {scene.cameraNotes?.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-paper">Camera Notes</h5>
                        {scene.cameraNotes.map((note, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={note}
                              onChange={(e) => updateCameraNote(scene.id, index, e.target.value)}
                              placeholder="Camera direction or note"
                              className="text-sm"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteCameraNote(scene.id, index)}
                              className="text-red-600"
                            >
                              <ApperIcon name="X" size={12} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
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