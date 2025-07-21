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
    <Card className={cn("bg-white text-primary-900 border border-primary-200 shadow-elevation", className)}>
      <div className="p-8 screenplay-format">
        {/* Title Page */}
        <div className="text-center mb-16 border-b border-primary-200 pb-12">
          <h1 className="text-3xl font-bold mb-6 uppercase tracking-wide">{script.title}</h1>
          <div className="space-y-2 mb-6">
            <p className="text-base font-medium">Written by ScriptForge AI</p>
            <p className="text-sm text-primary-700">Based on: {script.topic}</p>
            <p className="text-sm text-primary-700">Style: {script.style.toUpperCase()}</p>
          </div>
          <div className="bg-primary-50 p-4 rounded-lg mb-6">
            <p className="text-sm font-semibold text-primary-800">Runtime: ~{runtimeData.total} seconds ({Math.floor(runtimeData.total / 60)}:{(runtimeData.total % 60).toString().padStart(2, '0')})</p>
            <p className="text-xs text-primary-600 mt-1">Dialogue: {runtimeData.dialogue}s | Action: {runtimeData.action}s | Transitions: {runtimeData.transitions}s</p>
          </div>
          <div className="space-y-1">
            {script.writer && <p className="text-sm text-primary-700">Writer: {script.writer}</p>}
            {script.draft && <p className="text-sm text-primary-700">Draft: {script.draft}</p>}
          </div>
          {script.notes && (
            <div className="mt-6 p-4 bg-accent-50 border-l-4 border-accent-400 rounded-r-lg">
              <p className="text-sm text-accent-800 italic font-medium">Production Notes:</p>
              <p className="text-xs text-accent-700 mt-1">{script.notes}</p>
            </div>
          )}
        </div>

        {/* Story Synopsis */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6 uppercase tracking-wide border-b border-primary-300 pb-2">Synopsis</h2>
          <div className="bg-secondary-50 p-6 rounded-lg border-l-4 border-secondary-400">
            <p className="action text-base leading-relaxed">{script.story}</p>
          </div>
        </div>

        {/* Screenplay */}
        <div>
          <h2 className="text-xl font-bold mb-8 uppercase tracking-wide border-b border-primary-300 pb-2">Screenplay</h2>
          
          {script.scenes?.map((scene, sceneIndex) => (
            <div key={scene.id} className="mb-12 bg-gray-50 p-6 rounded-lg border border-primary-200">
              {/* Scene Number & Heading */}
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-bold mr-4">
                    SCENE {scene.number}
                  </span>
                </div>
                <div className="scene-heading text-lg font-bold bg-white p-3 rounded border-l-4 border-primary-500">
                  {scene.heading}
                </div>
              </div>

              {/* Action Description */}
              {scene.action && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-primary-700 mb-3 uppercase tracking-wide">Scene Description</h3>
                  <div className="action bg-white p-4 rounded border-l-4 border-secondary-400 text-base leading-relaxed">
                    {scene.action}
                  </div>
                </div>
              )}

              {/* Dialogue Section */}
              {scene.dialogue?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-primary-700 mb-4 uppercase tracking-wide">Dialogue</h3>
                  <div className="space-y-6">
                    {scene.dialogue.map((line, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg border border-primary-100 shadow-sm">
                        <div className="character-name text-center font-bold text-lg mb-2 text-primary-800 uppercase">
                          {line.character}
                        </div>
                        {line.parenthetical && (
                          <div className="parenthetical text-center text-sm italic text-primary-600 mb-2">
                            ({line.parenthetical})
                          </div>
                        )}
                        <div className="dialogue text-center max-w-md mx-auto text-base leading-relaxed bg-primary-50 p-3 rounded">
                          "{line.text}"
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Camera Notes */}
              {scene.cameraNotes?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-accent-700 mb-3 uppercase tracking-wide">Camera Direction</h3>
                  <div className="space-y-2">
                    {scene.cameraNotes.map((note, index) => (
                      <div key={index} className="camera-note bg-accent-50 p-3 rounded border-l-4 border-accent-400">
                        <span className="font-semibold text-accent-800">CAMERA:</span> <span className="text-accent-700">{note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scene Separator */}
              {sceneIndex < script.scenes.length - 1 && (
                <div className="scene-break mt-8 mb-4">
                  <div className="border-b-2 border-primary-400 relative">
                    <div className="absolute inset-x-0 top-0 flex justify-center">
                      <span className="bg-white px-4 text-sm font-semibold text-primary-600 uppercase tracking-wide">
                        Scene Break
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* End of Screenplay */}
          <div className="text-center mt-12 pt-8 border-t-2 border-primary-400">
            <p className="text-lg font-bold text-primary-800 uppercase tracking-wide">End of Screenplay</p>
            <p className="text-sm text-primary-600 mt-2">Total Runtime: ~{Math.floor(runtimeData.total / 60)} minutes {runtimeData.total % 60} seconds</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ScreenplayViewer;