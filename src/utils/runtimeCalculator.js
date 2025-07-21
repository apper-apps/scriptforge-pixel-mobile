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
      breakdown: {
        wordsPerMinute: 150,
        actionTimePerWord: 0.5,
        sceneTransitionTime: 2
      }
    };
  }

  const WORDS_PER_MINUTE = 150; // Average speaking rate
  const ACTION_TIME_PER_WORD = 0.5; // Seconds per word for action descriptions
  const SCENE_TRANSITION_TIME = 2; // Seconds between scenes

  let totalDialogueTime = 0;
  let totalActionTime = 0;
  
  script.scenes.forEach(scene => {
    // Calculate dialogue time
    if (scene.dialogue && Array.isArray(scene.dialogue)) {
      scene.dialogue.forEach(line => {
        if (line.text) {
          const wordCount = line.text.trim().split(/\s+/).filter(word => word.length > 0).length;
          totalDialogueTime += (wordCount / WORDS_PER_MINUTE) * 60; // Convert to seconds
        }
      });
    }

    // Calculate action/description time
    if (scene.action) {
      const actionWords = scene.action.trim().split(/\s+/).filter(word => word.length > 0).length;
      totalActionTime += actionWords * ACTION_TIME_PER_WORD;
    }
  });

  // Add scene transition time
  const sceneCount = script.scenes.length;
  const transitionTime = Math.max(0, sceneCount - 1) * SCENE_TRANSITION_TIME;

  const total = Math.round(totalDialogueTime + totalActionTime + transitionTime);

  return {
    total,
    dialogue: Math.round(totalDialogueTime),
    action: Math.round(totalActionTime),
    transitions: Math.round(transitionTime),
    breakdown: {
      wordsPerMinute: WORDS_PER_MINUTE,
      actionTimePerWord: ACTION_TIME_PER_WORD,
      sceneTransitionTime: SCENE_TRANSITION_TIME
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

  if (runtime < 30) {
    status = 'too-short';
    color = 'text-yellow-400';
    message = 'Consider adding more content';
  } else if (runtime < 15) {
    status = 'very-short';
    color = 'text-red-400';
    message = 'Script is very short';
  } else if (runtime > 180) {
    status = 'too-long';
    color = 'text-yellow-400';
    message = 'Consider reducing content';
  } else if (runtime > 240) {
    status = 'very-long';
    color = 'text-red-400';
    message = 'Script is very long';
  }

  return {
    status,
    color,
    message,
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