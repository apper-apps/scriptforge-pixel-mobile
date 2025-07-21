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
    
    // Generate topic-specific characters and setting
    const generateCharacters = (topic, style) => {
      const topicWords = topic.toLowerCase().split(' ');
      const contexts = {
        cooking: ['CHEF', 'SOUS CHEF', 'CUSTOMER', 'FOOD CRITIC', 'SERVER'],
        detective: ['DETECTIVE', 'SUSPECT', 'WITNESS', 'VICTIM', 'PARTNER'],
        school: ['TEACHER', 'STUDENT', 'PRINCIPAL', 'PARENT', 'JANITOR'],
        office: ['MANAGER', 'EMPLOYEE', 'INTERN', 'CLIENT', 'RECEPTIONIST'],
        medical: ['DOCTOR', 'NURSE', 'PATIENT', 'SURGEON', 'PARAMEDIC'],
        space: ['ASTRONAUT', 'MISSION CONTROL', 'ALIEN', 'CAPTAIN', 'ENGINEER'],
        robot: ['TECHNICIAN', 'ROBOT', 'SCIENTIST', 'CUSTOMER', 'SECURITY'],
        coffee: ['BARISTA', 'CUSTOMER', 'MANAGER', 'SUPPLIER', 'CRITIC'],
        phone: ['CALLER', 'OPERATOR', 'TECHNICIAN', 'CUSTOMER', 'BOSS']
      };
      
      // Find matching context
      let characters = ['PROTAGONIST', 'FRIEND', 'STRANGER'];
      for (const [key, chars] of Object.entries(contexts)) {
        if (topicWords.some(word => word.includes(key) || key.includes(word))) {
          characters = chars;
          break;
        }
      }
      
      return characters.slice(0, 3); // Return top 3 relevant characters
    };

    const generateLocation = (topic) => {
      const topicWords = topic.toLowerCase().split(' ');
      const locationMap = {
        coffee: 'COFFEE SHOP',
        restaurant: 'RESTAURANT',
        school: 'CLASSROOM',
        office: 'OFFICE BUILDING',
        hospital: 'HOSPITAL',
        space: 'SPACECRAFT',
        phone: 'PHONE BOOTH',
        cooking: 'KITCHEN',
        detective: 'CRIME SCENE',
        robot: 'TECH LAB',
        time: 'MYSTERIOUS LOCATION'
      };
      
      for (const [key, location] of Object.entries(locationMap)) {
        if (topicWords.some(word => word.includes(key) || key.includes(word))) {
          return location;
        }
      }
      return 'MAIN LOCATION';
    };

    const generateStoryByStyle = (topic, style, characters, location) => {
      const mainChar = characters[0];
      const supportChar = characters[1] || 'FRIEND';
      const thirdChar = characters[2] || 'STRANGER';
      
      switch (style) {
        case 'comedy':
          return {
            story: `What begins as a routine encounter with ${topic} quickly spirals into a comedy of errors that would make Charlie Chaplin proud. Our ${mainChar.toLowerCase()}, ${mainChar === 'PROTAGONIST' ? 'the well-intentioned hero' : 'with the best of intentions'}, finds themselves in increasingly ridiculous situations as simple misunderstandings compound into elaborate mishaps. When ${supportChar.toLowerCase()} ${supportChar === 'FRIEND' ? 'tries to help' : 'gets involved'}, things go from bad to hilariously worse. Through slapstick moments, witty wordplay, and perfectly timed catastrophes, everyone learns that sometimes the most memorable experiences come from the most unexpected disasters. The humor escalates through visual gags, character-driven comedy, and situational irony that keeps audiences laughing while rooting for our hapless heroes.`,
            scenes: [
              {
                id: "scene-1",
                number: 1,
                heading: `INT. ${location} - DAY`,
                action: `A perfectly normal day at the ${location.toLowerCase()} where everything is running smoothly. ${mainChar} approaches ${topic} with confidence, completely unaware that this simple interaction will soon become the catalyst for comedic chaos. The environment is pristine and organized - the calm before the storm.`,
                dialogue: [
                  {
                    character: mainChar,
                    text: `Alright, dealing with ${topic} - how complicated can this be?`,
                    parenthetical: "with misplaced confidence"
                  },
                  {
                    character: supportChar,
                    text: "Maybe we should read the instructions first?",
                    parenthetical: "hesitant but ignored"
                  }
                ],
                cameraNotes: ["Establish pristine environment", "Close-up on confident expression", "Foreshadowing shots of potential chaos"]
              },
              {
                id: "scene-2",
                number: 2,
                heading: `INT. ${location} - CONTINUOUS`,
                action: `The first domino falls as ${mainChar}'s interaction with ${topic} goes slightly awry. What should have been straightforward becomes unexpectedly complicated as Murphy's Law takes effect. ${supportChar} rushes to help, but their assistance only adds fuel to the fire.`,
                dialogue: [
                  {
                    character: mainChar,
                    text: "Wait... that's definitely not supposed to happen.",
                    parenthetical: "watching in growing alarm"
                  },
                  {
                    character: supportChar,
                    text: "Don't panic! I've got this!",
                    parenthetical: "making things dramatically worse"
                  },
                  {
                    character: thirdChar,
                    text: "Should I call someone, or just start recording?",
                    parenthetical: "pulling out phone"
                  }
                ],
                cameraNotes: ["Medium shot showing escalating problem", "Quick cuts between characters' reactions", "Wide shot revealing full scope of disaster"]
              },
              {
                id: "scene-3",
                number: 3,
                heading: `INT. ${location} - CHAOS MODE`,
                action: `Full comedic pandemonium has erupted. The ${location.toLowerCase()} looks like a tornado hit it, and ${topic} has somehow become the epicenter of an elaborate chain reaction of mishaps. Despite the chaos, or perhaps because of it, everyone finds themselves laughing at the absurdity of the situation.`,
                dialogue: [
                  {
                    character: mainChar,
                    text: "You know what? This is actually kind of fun!",
                    parenthetical: "covered in debris but grinning"
                  },
                  {
                    character: thirdChar,
                    text: "Well, this is definitely going viral.",
                    parenthetical: "still filming"
                  },
                  {
                    character: supportChar,
                    text: "Next time, we're definitely reading the manual first.",
                    parenthetical: "laughing despite the mess"
                  }
                ],
                cameraNotes: ["Wide establishing shot of complete chaos", "Close-ups of characters laughing", "Montage of the aftermath with upbeat music"]
              }
            ]
          };

        case 'thriller':
          return {
            story: `What appears to be an ordinary situation involving ${topic} masks a web of deception and danger that runs deeper than anyone could imagine. ${mainChar} stumbles upon inconsistencies that suggest something sinister lurking beneath the surface. As they dig deeper, they realize they've uncovered a conspiracy that threatens not just themselves, but everyone around them. Each revelation leads to darker truths, and every ally could be an enemy in disguise. Trust becomes a luxury they can't afford as the stakes escalate to life-and-death proportions. The tension builds through psychological manipulation, unexpected betrayals, and a race against time where one wrong move could be fatal.`,
            scenes: [
              {
                id: "scene-1",
                number: 1,
                heading: `INT. ${location} - NIGHT`,
                action: `The ${location.toLowerCase()} feels different tonight - shadows seem longer, sounds are muffled, and an unsettling quiet permeates the space. ${mainChar} approaches ${topic} cautiously, their instincts warning them that something isn't right. The normal bustle has been replaced by an eerie calm.`,
                dialogue: [
                  {
                    character: mainChar,
                    text: "The atmosphere here feels... off. Like everyone's watching.",
                    parenthetical: "scanning surroundings nervously"
                  },
                  {
                    character: supportChar,
                    text: "You're being paranoid. Everything's fine.",
                    parenthetical: "but avoiding eye contact"
                  }
                ],
                cameraNotes: ["Low-key lighting with deep shadows", "Handheld camera for unease", "Close-ups on suspicious details"]
              },
              {
                id: "scene-2",
                number: 2,
                heading: `INT. ${location} - CONTINUOUS`,
                action: `${mainChar}'s suspicions prove justified as they discover evidence that ${topic} is not what it seems. Hidden compartments, suspicious documents, or unusual behavior patterns reveal the first layer of a much deeper conspiracy. ${supportChar}'s reaction seems too calm, too prepared.`,
                dialogue: [
                  {
                    character: mainChar,
                    text: "This changes everything. How long have you known?",
                    parenthetical: "confronting with evidence"
                  },
                  {
                    character: supportChar,
                    text: "Known what? You're seeing things that aren't there.",
                    parenthetical: "but their hand moves to their pocket"
                  },
                  {
                    character: thirdChar,
                    text: "I wouldn't go any further if I were you.",
                    parenthetical: "emerging from the shadows"
                  }
                ],
                cameraNotes: ["Over-shoulder revealing evidence", "Extreme close-up on supportChar's deception", "Low-angle shot of thirdChar's threat"]
              },
              {
                id: "scene-3",
                number: 3,
                heading: `INT. ${location} - THE REVELATION`,
                action: `The full scope of the conspiracy becomes clear as ${mainChar} realizes they've been manipulated from the beginning. ${topic} was bait, and they've walked into a carefully orchestrated trap. But their discovery of the truth becomes their only weapon as they face the real masterminds behind the deception.`,
                dialogue: [
                  {
                    character: thirdChar,
                    text: "You were never supposed to figure it out. But now that you have...",
                    parenthetical: "menacingly calm"
                  },
                  {
                    character: mainChar,
                    text: "Others know. If anything happens to me, the truth comes out.",
                    parenthetical: "bluffing with conviction"
                  },
                  {
                    character: supportChar,
                    text: "I'm sorry. I never wanted it to come to this.",
                    parenthetical: "genuinely conflicted"
                  }
                ],
                cameraNotes: ["Dutch angles for psychological tension", "Tight close-ups during confrontation", "Wide shot showing isolation and danger"]
              }
            ]
          };

        case 'educational':
          return {
            story: `Join us for an enlightening exploration of ${topic} that transforms complex concepts into accessible, engaging content. Through real-world examples, expert insights, and interactive demonstrations, we'll uncover the fascinating science, history, and practical applications that make this subject relevant to our daily lives. Our journey takes us from basic principles to advanced concepts, building understanding step by step while maintaining engagement through storytelling and visual demonstrations. By the end, viewers will not only understand ${topic} but appreciate its broader significance and practical applications in the modern world.`,
            scenes: [
              {
                id: "scene-1",
                number: 1,
                heading: `INT. ${location} - DAY`,
                action: `A bright, inviting ${location.toLowerCase()} designed for learning and discovery. Visual aids, demonstrations, and interactive elements are carefully arranged to support the educational journey. Our expert ${mainChar.toLowerCase()} prepares to guide viewers through the fascinating world of ${topic}.`,
                dialogue: [
                  {
                    character: mainChar,
                    text: `Welcome! Today we're diving deep into ${topic} - a subject that's more fascinating and relevant than you might think.`,
                    parenthetical: "warm, engaging tone"
                  },
                  {
                    character: supportChar,
                    text: "I have to admit, I never realized how complex this really is.",
                    parenthetical: "representing the learner's perspective"
                  }
                ],
                cameraNotes: ["Clean, well-lit establishing shot", "Medium shots for personal connection", "Insert shots of visual aids"]
              },
              {
                id: "scene-2",
                number: 2,
                heading: `INT. ${location} - CONTINUOUS`,
                action: `Through hands-on demonstrations and clear explanations, the fundamental principles of ${topic} come to life. Visual aids and real-world examples help bridge the gap between theory and practical application, making abstract concepts tangible and understandable.`,
                dialogue: [
                  {
                    character: mainChar,
                    text: "Let's break this down into simple, digestible components that anyone can understand.",
                    parenthetical: "pointing to demonstration"
                  },
                  {
                    character: thirdChar,
                    text: "So this is how it works in the real world?",
                    parenthetical: "curious and engaged"
                  },
                  {
                    character: supportChar,
                    text: "The applications are incredible once you see the connections.",
                    parenthetical: "having an 'aha' moment"
                  }
                ],
                cameraNotes: ["Close-ups on demonstrations", "Reaction shots showing understanding", "Smooth camera movements following explanations"]
              },
              {
                id: "scene-3",
                number: 3,
                heading: `INT. ${location} - CONCLUSION`,
                action: `The session concludes with a comprehensive review that ties all concepts together, showing how individual elements combine to create the bigger picture. Practical applications and future implications are explored, leaving viewers with both knowledge and inspiration to learn more.`,
                dialogue: [
                  {
                    character: mainChar,
                    text: `Now that we understand the fundamentals, you can see how ${topic} impacts virtually every aspect of our lives.`,
                    parenthetical: "summarizing with enthusiasm"
                  },
                  {
                    character: supportChar,
                    text: "I can't wait to explore this further on my own.",
                    parenthetical: "inspired"
                  },
                  {
                    character: thirdChar,
                    text: "This completely changed how I think about the subject.",
                    parenthetical: "reflective"
                  }
                ],
                cameraNotes: ["Wide shot showing complete setup", "Close-ups capturing emotional responses", "Final shot emphasizing key takeaways"]
              }
            ]
          };

        case 'sci-fi':
          return {
            story: `In a world where ${topic} has evolved beyond current understanding, ${mainChar} discovers that reality isn't what it seems. Advanced technology, parallel dimensions, or futuristic societies create a backdrop where ${topic} becomes the key to understanding larger cosmic truths. As they navigate through scientific impossibilities and technological marvels, they uncover connections between ${topic} and the fundamental nature of existence itself. The journey challenges perceptions of time, space, and reality while exploring how humanity adapts to extraordinary circumstances. Through speculative scenarios and imaginative possibilities, we explore both the promise and peril of an advanced future.`,
            scenes: [
              {
                id: "scene-1",
                number: 1,
                heading: `INT. FUTURISTIC ${location.toUpperCase()} - DAY`,
                action: `A technologically advanced version of ${location.toLowerCase()} where ${topic} has been revolutionized by scientific progress. Holographic displays, automated systems, and impossible architectures create an environment that's both familiar and alien. ${mainChar} interacts with ${topic} in ways that would be impossible in our current world.`,
                dialogue: [
                  {
                    character: mainChar,
                    text: `The quantum readings are unlike anything in the historical databases.`,
                    parenthetical: "analyzing advanced displays"
                  },
                  {
                    character: 'SYSTEM AI',
                    text: "WARNING: Temporal anomaly detected in relation to specified parameters.",
                    parenthetical: "synthesized voice"
                  }
                ],
                cameraNotes: ["Sweeping shots of futuristic environment", "Close-ups on advanced technology", "CGI integration for impossible elements"]
              }
            ]
          };

        default:
          return generateStoryByStyle(topic, 'comedy', characters, location);
      }
    };

    const characters = generateCharacters(topic, style);
    const location = generateLocation(topic);
    const storyData = generateStoryByStyle(topic, style, characters, location);
    
    return {
      title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} - ${style.charAt(0).toUpperCase() + style.slice(1)}`,
      topic,
      style,
      story: storyData.story,
      scenes: storyData.scenes,
      runtime: Math.floor(Math.random() * 30) + 90, // 90-120 seconds
    };
  }
};