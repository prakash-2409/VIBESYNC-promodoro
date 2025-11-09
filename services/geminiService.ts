import { GoogleGenAI, Type } from "@google/genai";
import type { Theme, Mood } from '../types';

// Assume API_KEY is set in the environment
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this example, we will proceed but API calls will fail.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

/**
 * Generates a mood suggestion based on user activity and time of day.
 * @param completedTasks - Number of tasks completed.
 * @param totalTasks - Total number of tasks.
 * @param hourOfDay - The current hour (0-23).
 * @param mood - The user's self-reported mood.
 * @returns An object with a suggested music type and theme.
 */
export const getMoodSuggestion = async (
  completedTasks: number,
  totalTasks: number,
  hourOfDay: number,
  mood: Mood
): Promise<{ music: string; theme: Theme }> => {
  const model = "gemini-2.5-flash";
  const timeOfDay = hourOfDay < 12 ? 'morning' : hourOfDay < 18 ? 'afternoon' : 'night';
  const productivity = totalTasks > 0 ? completedTasks / totalTasks : 0;
  
  let productivityDesc = 'just starting';
  if (productivity > 0.7) productivityDesc = 'very productive';
  else if (productivity > 0.4) productivityDesc = 'making good progress';

  const prompt = `
    Analyze the user's focus session context and suggest an appropriate ambiance.
    Context:
    - User's current mood: ${mood}
    - Time of day: ${timeOfDay}
    - Productivity level: ${productivityDesc} (${completedTasks}/${totalTasks} tasks done)
    
    Choose one music style from: 'Lofi Beats', 'Calm River', 'Rain Room', 'Coffee Shop'.
    Choose one UI theme from: 'light', 'dark', 'calm'.

    - If it's morning and productivity is low, suggest something to help start, like 'Coffee Shop' and 'light' theme.
    - If it's night or the user is tired, suggest something relaxing like 'Lofi Beats' or 'Rain Room' and a 'dark' or 'calm' theme.
    - If productivity is high, suggest something to maintain flow, like 'Lofi Beats' or 'Calm River'.
    - If the user is happy, suggest something uplifting but not distracting.
  `;
  
  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              music: { type: Type.STRING, description: "Suggested music style." },
              theme: { type: Type.STRING, description: "Suggested UI theme." }
            }
          }
        }
    });

    const text = response.text.trim();
    const result = JSON.parse(text);

    return {
        music: result.music || 'Lofi Beats',
        theme: ['light', 'dark', 'calm'].includes(result.theme) ? result.theme : 'calm',
    };
  } catch(error) {
    console.error("Error calling Gemini API for mood suggestion:", error);
    // Return a safe default if API fails
    return { music: 'Lofi Beats', theme: 'calm' };
  }
};

/**
 * Generates a daily reflection summary and mantra.
 * @param userInput - A string containing the user's reflection on their day.
 * @returns An object with a gentle summary and an encouraging mantra.
 */
export const getDailyReflection = async (
  userInput: string
): Promise<{ summary: string; mantra: string }> => {
  const model = "gemini-2.5-flash";
  const prompt = `
    Based on the user's daily reflection, generate a gentle, non-judgmental, one-sentence summary and a short, encouraging mantra for tomorrow.
    The tone should be personal, gentle, and emotional. Avoid harsh productivity language.
    User's reflection: "${userInput}"
  `;
  
  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    summary: { type: Type.STRING, description: "A gentle one-sentence summary of the user's day." },
                    mantra: { type: Type.STRING, description: "A short, encouraging mantra for tomorrow." }
                }
            }
        }
    });

    const text = response.text.trim();
    const result = JSON.parse(text);

    return {
        summary: result.summary || "You showed up for yourself today.",
        mantra: result.mantra || "Tomorrow is a new opportunity for gentle focus."
    };
  } catch(error) {
    console.error("Error calling Gemini API for reflection:", error);
    // Return a safe default if API fails
    return { summary: "You made it through the day, and that's enough.", mantra: "Rest is also a part of progress." };
  }
};