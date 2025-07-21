import scriptsData from "@/services/mockData/scripts.json";

// Simulate realistic API delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let scripts = [...scriptsData];

export const scriptService = {
  async getAll() {
    await delay(300);
    return [...scripts];
  },

  async getById(id) {
    await delay(200);
    const script = scripts.find(s => s.Id === parseInt(id));
    if (!script) {
      throw new Error("Script not found");
    }
    return { ...script };
  },

  async create(scriptData) {
    await delay(400);
    const newScript = {
      ...scriptData,
      Id: Math.max(...scripts.map(s => s.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    scripts.push(newScript);
    return { ...newScript };
  },

  async update(id, updates) {
    await delay(300);
    const index = scripts.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Script not found");
    }
    
    const updatedScript = {
      ...scripts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    scripts[index] = updatedScript;
    return { ...updatedScript };
  },

  async delete(id) {
    await delay(250);
    const index = scripts.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Script not found");
    }
    
    scripts.splice(index, 1);
    return true;
  },

  async generateScript(topic, style) {
    await delay(2000); // Simulate AI processing time
    
    // Mock AI generation based on style
    const storyTemplates = {
      comedy: {
        story: `A hilarious misunderstanding unfolds when ${topic} leads to increasingly absurd situations. Characters find themselves in compromising positions as simple mistakes snowball into major comedic disasters. Despite the chaos, everyone learns to laugh at themselves and discovers that sometimes the best moments come from the most unexpected circumstances. The humor builds through physical comedy, witty dialogue, and perfectly timed misunderstandings that keep the audience guessing what ridiculous thing will happen next.`,
        scenes: [
          {
            id: "scene-1",
            number: 1,
            heading: "INT. MAIN LOCATION - DAY",
            action: `The scene is set for comedy as our protagonist encounters ${topic} in the most ordinary way possible.`,
            dialogue: [
              {
                character: "PROTAGONIST",
                text: "Well, this should be simple enough.",
                parenthetical: "famous last words"
              }
            ],
            cameraNotes: ["Establish normal setting", "Foreshadow upcoming chaos"]
          },
          {
            id: "scene-2",
            number: 2,
            heading: "INT. MAIN LOCATION - CONTINUOUS",
            action: "Things immediately start going wrong in the most unexpected ways.",
            dialogue: [
              {
                character: "PROTAGONIST",
                text: "That's... not supposed to happen.",
                parenthetical: "watching chaos unfold"
              }
            ],
            cameraNotes: ["Medium shot of confusion", "Quick cuts showing mistakes"]
          }
        ]
      },
      thriller: {
        story: `A seemingly innocent situation involving ${topic} quickly turns sinister when hidden dangers emerge from the shadows. As tension builds, our protagonist realizes they've stumbled into something far more dangerous than expected. Every choice becomes a matter of life and death as they navigate through deception, betrayal, and mounting suspense. The stakes rise continuously as dark secrets are revealed and the true scope of the threat becomes clear, leading to a heart-pounding climax.`,
        scenes: [
          {
            id: "scene-1",
            number: 1,
            heading: "INT. LOCATION - NIGHT",
            action: `The atmosphere is tense as our protagonist cautiously approaches ${topic}, unaware of the danger lurking nearby.`,
            dialogue: [
              {
                character: "PROTAGONIST",
                text: "Something doesn't feel right about this.",
                parenthetical: "whispering"
              }
            ],
            cameraNotes: ["Low-key lighting", "Handheld camera for tension"]
          },
          {
            id: "scene-2",
            number: 2,
            heading: "INT. LOCATION - CONTINUOUS",
            action: "Shadows move in the background. The protagonist's instincts prove correct as danger reveals itself.",
            dialogue: [
              {
                character: "MYSTERIOUS VOICE",
                text: "You shouldn't have come here.",
                parenthetical: "from the darkness"
              }
            ],
            cameraNotes: ["Over-shoulder shot", "Quick zoom on protagonist's fear"]
          }
        ]
      },
      educational: {
        story: `An engaging exploration of ${topic} that breaks down complex concepts into easily digestible segments. Through clear explanations, practical examples, and relatable scenarios, viewers gain a comprehensive understanding of the subject matter. The narrative structure guides the audience through a logical progression of learning, building upon each concept to create a complete picture. Real-world applications demonstrate the practical value and relevance of the information being presented.`,
        scenes: [
          {
            id: "scene-1",
            number: 1,
            heading: "INT. LEARNING ENVIRONMENT - DAY",
            action: `A welcoming educational setting where ${topic} is introduced in an accessible and engaging manner.`,
            dialogue: [
              {
                character: "NARRATOR",
                text: "Today we're going to explore an fascinating topic that affects us all.",
                parenthetical: "warm, engaging tone"
              }
            ],
            cameraNotes: ["Clean, well-lit setup", "Direct address to camera"]
          },
          {
            id: "scene-2",
            number: 2,
            heading: "INT. LEARNING ENVIRONMENT - CONTINUOUS",
            action: "Visual aids and examples help illustrate key concepts clearly and memorably.",
            dialogue: [
              {
                character: "NARRATOR",
                text: "Let's break this down into simple, understandable parts.",
                parenthetical: "pointing to visual aids"
              }
            ],
            cameraNotes: ["Close-up on visual materials", "Smooth camera movements"]
          }
        ]
      }
    };

    const template = storyTemplates[style] || storyTemplates.comedy;
    
    return {
      title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Script`,
      topic,
      style,
      story: template.story,
      scenes: template.scenes,
      runtime: Math.floor(Math.random() * 30) + 90, // 90-120 seconds
    };
  }
};