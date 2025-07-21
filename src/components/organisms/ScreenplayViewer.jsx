import React from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import { calculateScriptRuntime } from "@/utils/runtimeCalculator";

const ScreenplayViewer = ({ script, className }) => {
  if (!script) {
    return (
      <Card className={cn("p-8 text-center", className)}>
        <p className="text-primary-400">No script to display</p>
      </Card>
    );
  }

  // Calculate real-time runtime
  const runtimeData = calculateScriptRuntime(script);

return (
    <Card className={cn("bg-white text-primary-900 border border-primary-200", className)}>
      <div className="p-8 screenplay-format">
        {/* Title Page */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold mb-4 uppercase">{script.title}</h1>
          <p className="text-sm">Written by ScriptForge AI</p>
          <p className="text-sm">Based on: {script.topic}</p>
          <p className="text-sm">Style: {script.style}</p>
          <p className="text-sm">Runtime: ~{runtimeData.total} seconds ({Math.floor(runtimeData.total / 60)}:{(runtimeData.total % 60).toString().padStart(2, '0')})</p>
          <p className="text-xs text-primary-600">Dialogue: {runtimeData.dialogue}s | Action: {runtimeData.action}s | Transitions: {runtimeData.transitions}s</p>
        </div>

        {/* Story Synopsis */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 uppercase">Synopsis</h2>
          <p className="action">{script.story}</p>
        </div>

        {/* Screenplay */}
        <div>
          <h2 className="text-lg font-bold mb-6 uppercase">Screenplay</h2>
          
          {script.scenes?.map((scene) => (
            <div key={scene.id} className="mb-8">
              {/* Scene Heading */}
              <div className="scene-heading">
                {scene.heading}
              </div>

              {/* Action */}
              {scene.action && (
                <div className="action">
                  {scene.action}
                </div>
              )}

              {/* Dialogue */}
              {scene.dialogue?.map((line, index) => (
                <div key={index} className="mb-4">
                  <div className="character-name">
                    {line.character}
                    {line.parenthetical && (
                      <div className="parenthetical">
                        ({line.parenthetical})
                      </div>
                    )}
                  </div>
                  <div className="dialogue">
                    {line.text}
                  </div>
                </div>
              ))}

              {/* Camera Notes */}
              {scene.cameraNotes?.map((note, index) => (
                <div key={index} className="camera-note">
                  CAMERA: {note}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ScreenplayViewer;