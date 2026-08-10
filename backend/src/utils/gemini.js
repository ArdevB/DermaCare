import { GoogleGenAI } from "@google/genai";
import config from "../config/config.js";

const ai = new GoogleGenAI({ apiKey: config.apiKey });

/**
 * Sends a plain-text prompt to Gemini and returns the raw text response.
 * @param {string} prompt
 * @param {object} [options]
 * @param {number} [options.temperature]
 * @returns {Promise<string>}
 */
export const generateText = async (prompt, options = {}) => {
  const response = await ai.models.generateContent({
    model: config.geminiModel,
    contents: prompt,
    config: {
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.maxOutputTokens ?? 500,
    },
  });

  const text = response.text?.trim();
  if (!text) {
    throw new Error("Gemini returned an empty response");
  }
  return text;
};

/**
 * Sends a prompt expecting a JSON response, parses and returns it.
 * Strips markdown code fences if Gemini wraps the JSON despite instructions.
 * @param {string} prompt
 * @returns {Promise<object>}
 */
export const generateJSON = async (prompt, options = {}) => {
  const raw = await generateText(prompt, options);
  const cleaned = raw.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Failed to parse Gemini JSON response: ${err.message}`);
  }
};
