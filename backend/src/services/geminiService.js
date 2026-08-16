import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config/config.js";
import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

const cleanList = (arr) =>
  Array.isArray(arr) ? arr.map((s) => String(s).trim()).filter(Boolean) : [];

/**
 * Generates a product description, features, and benefits together in one
 * call (so tone stays consistent) from structured product facts only.
 * Explicitly instructed not to invent claims/ingredients/benefits that
 * weren't provided, per coding rule #24 ("do not invent unsupported product
 * information"). Deliberately does NOT generate an ingredients list -
 * ingredients are a factual/safety claim (allergens, actives), not marketing
 * copy, and should not be fabricated by a model with no real knowledge of
 * what's actually in the product.
 */
export const generateProductCopy = async ({
  name,
  brand,
  category,
  ingredients = [],
}) => {
  try {
    const model = genAI.getGenerativeModel({
      model: config.gemini.model,
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `You are writing e-commerce marketing copy for a skincare/personal-care product.

Product name: ${name}
${brand ? `Brand: ${brand}` : ""}
${category ? `Category: ${category}` : ""}
${ingredients.length ? `Key ingredients: ${ingredients.join(", ")}` : ""}

Return ONLY a JSON object with this exact shape, no markdown fencing, no commentary:
{
  "description": "2-4 sentence product description, warm marketing tone",
  "features": ["short feature phrase", "short feature phrase"],
  "benefits": ["short benefit phrase", "short benefit phrase"]
}

Rules:
- 3 to 5 items each for "features" and "benefits", each under 8 words.
- Only use the facts provided above. Do not invent ingredients, certifications, or medical/dermatological claims.
- "features" and "benefits" describe the product experience - do not just restate the ingredients list.`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error(`Gemini returned non-JSON output: ${raw.slice(0, 200)}`);
    }

    const description = String(parsed.description || "").trim();
    const features = cleanList(parsed.features);
    const benefits = cleanList(parsed.benefits);

    if (!description) {
      throw new Error("Gemini returned an empty description");
    }

    return { description, features, benefits };
  } catch (error) {
    logger.error(`Gemini product copy generation failed: ${error.message}`);
    throw ApiError.internal(
      "Failed to auto-generate product copy. Please provide description/features/benefits manually or try again."
    );
  }
};

