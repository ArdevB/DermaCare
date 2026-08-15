import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config/config.js";
import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

/**
 * Generates a product description from structured product facts only.
 * Explicitly instructed not to invent claims/ingredients/benefits that weren't provided,
 * per coding rule #24 ("do not invent unsupported product information").
 */
export const generateProductDescription = async ({
  name,
  brand,
  category,
  ingredients = [],
  features = [],
  benefits = [],
}) => {
  try {
    const model = genAI.getGenerativeModel({ model: config.gemini.model });

    const prompt = `Write a concise, appealing e-commerce product description (2-4 sentences, no headings, no markdown) for a skincare/personal-care product.

Product name: ${name}
${brand ? `Brand: ${brand}` : ""}
${category ? `Category: ${category}` : ""}
${ingredients.length ? `Key ingredients: ${ingredients.join(", ")}` : ""}
${features.length ? `Features: ${features.join(", ")}` : ""}
${benefits.length ? `Benefits: ${benefits.join(", ")}` : ""}

Rules:
- Only use the facts provided above. Do not invent ingredients, certifications, or medical claims.
- Do not make medical or dermatological claims that are not explicitly listed.
- Write naturally, in a warm marketing tone suitable for a skincare storefront.
- Return only the description text, nothing else.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    return text;
  } catch (error) {
    logger.error(`Gemini description generation failed: ${error.message}`);
    // Per requirement: never silently save an empty description on failure — surface a clear error.
    throw ApiError.internal(
      "Failed to auto-generate product description. Please provide one manually or try again."
    );
  }
};
