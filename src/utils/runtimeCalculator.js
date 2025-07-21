// Runtime calculation utility for screenplay scripts
// Based on industry standards for speaking rates and action timing

/**
 * Calculate estimated runtime for a script in seconds
 * @param {Object} script - Script object with scenes, dialogue, and action
 * @returns {Object} Runtime breakdown and total
 */
export const calculateScriptRuntime = (script) => {
  if (!script || !script.scenes) {
    return {
      total: 0,
      dialogue: 0,
      action: 0,
      transitions: 0,
      cameraNotes: 0,
      sceneBreakdown: [],
      characterStats: {},
      breakdown: {
        wordsPerMinute: 150,
        actionTimePerWord: 0.5,
        sceneTransitionTime: 2,
        cameraSetupTime: 1
      }
    };
  }

  const WORDS_PER_MINUTE = 150; // Average speaking rate
  const ACTION_TIME_PER_WORD = 0.5; // Seconds per word for action descriptions
  const SCENE_TRANSITION_TIME = 2; // Seconds between scenes
  const CAMERA_SETUP_TIME = 1; // Seconds per camera note/setup

  let totalDialogueTime = 0;
  let totalActionTime = 0;
  let totalCameraTime = 0;
  let sceneBreakdown = [];
  let characterStats = {};
  
  script.scenes.forEach(scene => {
    let sceneDialogueTime = 0;
    let sceneActionTime = 0;
    let sceneCameraTime = 0;

    // Calculate dialogue time and track characters
    if (scene.dialogue && Array.isArray(scene.dialogue)) {
      scene.dialogue.forEach(line => {
        if (line.text) {
          const wordCount = line.text.trim().split(/\s+/).filter(word => word.length > 0).length;
          const lineTime = (wordCount / WORDS_PER_MINUTE) * 60;
          sceneDialogueTime += lineTime;
          
          // Track character statistics
          const character = line.character?.toUpperCase() || 'UNKNOWN';
          if (!characterStats[character]) {
            characterStats[character] = { lines: 0, words: 0, screenTime: 0 };
          }
          characterStats[character].lines++;
          characterStats[character].words += wordCount;
          characterStats[character].screenTime += lineTime;
        }
      });
    }

    // Calculate action/description time
    if (scene.action) {
      const actionWords = scene.action.trim().split(/\s+/).filter(word => word.length > 0).length;
      sceneActionTime = actionWords * ACTION_TIME_PER_WORD;
    }

    // Calculate camera setup time
    if (scene.cameraNotes && Array.isArray(scene.cameraNotes)) {
      sceneCameraTime = scene.cameraNotes.length * CAMERA_SETUP_TIME;
    }

    const sceneTotal = sceneDialogueTime + sceneActionTime + sceneCameraTime;
    
    sceneBreakdown.push({
      sceneId: scene.id,
      number: scene.number,
      dialogue: Math.round(sceneDialogueTime),
      action: Math.round(sceneActionTime),
      camera: Math.round(sceneCameraTime),
      total: Math.round(sceneTotal)
    });

    totalDialogueTime += sceneDialogueTime;
    totalActionTime += sceneActionTime;
    totalCameraTime += sceneCameraTime;
  });

  // Add scene transition time
  const sceneCount = script.scenes.length;
  const transitionTime = Math.max(0, sceneCount - 1) * SCENE_TRANSITION_TIME;

  const total = Math.round(totalDialogueTime + totalActionTime + totalCameraTime + transitionTime);

  return {
    total,
    dialogue: Math.round(totalDialogueTime),
    action: Math.round(totalActionTime),
    transitions: Math.round(transitionTime),
    cameraNotes: Math.round(totalCameraTime),
    sceneBreakdown,
    characterStats,
    breakdown: {
      wordsPerMinute: WORDS_PER_MINUTE,
      actionTimePerWord: ACTION_TIME_PER_WORD,
      sceneTransitionTime: SCENE_TRANSITION_TIME,
      cameraSetupTime: CAMERA_SETUP_TIME
    }
  };
};

/**
 * Get runtime status and color coding
 * @param {number} runtime - Runtime in seconds
 * @returns {Object} Status information
 */
export const getRuntimeStatus = (runtime) => {
  const minutes = Math.floor(runtime / 60);
  const seconds = runtime % 60;
  
  let status = 'optimal';
  let color = 'text-green-400';
  let message = 'Good length';
  let recommendation = '';

  if (runtime < 15) {
    status = 'very-short';
    color = 'text-red-400';
    message = 'Script is very short';
    recommendation = 'Add more scenes, dialogue, or action descriptions to reach minimum length.';
  } else if (runtime < 30) {
    status = 'too-short';
    color = 'text-yellow-400';
    message = 'Consider adding more content';
    recommendation = 'Try expanding existing scenes or adding character development moments.';
  } else if (runtime >= 30 && runtime <= 180) {
    status = 'optimal';
    color = 'text-green-400';
    message = 'Good length';
    recommendation = 'Runtime is in the optimal range for most short-form content.';
  } else if (runtime > 180 && runtime <= 240) {
    status = 'too-long';
    color = 'text-yellow-400';
    message = 'Consider reducing content';
    recommendation = 'Look for opportunities to tighten dialogue or combine similar scenes.';
  } else if (runtime > 240) {
    status = 'very-long';
    color = 'text-red-400';
    message = 'Script is very long';
    recommendation = 'Significant editing needed. Consider breaking into multiple episodes or cutting non-essential content.';
  }

  return {
    status,
    color,
    message,
    recommendation,
    formatted: `${minutes}:${seconds.toString().padStart(2, '0')}`,
    seconds: runtime
  };
};

/**
 * Format runtime for display
 * @param {number} seconds - Runtime in seconds
 * @returns {string} Formatted time string
 */
export const formatRuntime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};