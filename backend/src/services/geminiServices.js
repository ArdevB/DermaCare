import { generateText, generateJSON } from "../utils/gemini.js";
import {
  buildDescriptionPrompt,
  buildRecommendationPrompt,
} from "../constants/prompt.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Generates an SEO-friendly product description from product metadata.
 * Called by productService when description is missing on create/update.
 */
export const generateProductDescription = async (productData) => {
  const prompt = buildDescriptionPrompt({
    name: productData.name,
    category: productData.categoryName, // resolved category name, passed in by caller
    brand: productData.brand,
    ingredients: productData.ingredients,
    skinType: productData.skinType,
    hairType: productData.hairType,
    concerns: productData.concerns,
  });

  try {
    const description = await generateText(prompt, { temperature: 0.6 });
    return description;
  } catch (error) {
    // Fail soft: description generation should never block product creation
    console.error("Gemini description generation failed:", error.message);
    return "";
  }
};

/**
 * Generates personalized product recommendations for a user.
 * @param {object} params
 * @param {object} params.userProfile - { skinType, hairType, concerns }
 * @param {string[]} params.purchaseHistory - array of past product names
 * @param {Array<object>} params.candidateProducts - in-stock products to choose from
 * @returns {Promise<Array<{ productId: string, reason: string }>>}
 */
export const generateRecommendations = async ({
  userProfile = {},
  purchaseHistory = [],
  candidateProducts = [],
}) => {
  if (!candidateProducts.length) {
    throw new ApiError(
      400,
      "No candidate products available for recommendation",
    );
  }

  const prompt = buildRecommendationPrompt({
    skinType: userProfile.skinType,
    hairType: userProfile.hairType,
    concerns: userProfile.concerns,
    purchaseHistory,
    candidateProducts,
  });

  const result = await generateJSON(prompt, {
    temperature: 0.5,
    maxOutputTokens: 800,
  });

  if (!Array.isArray(result.recommendations)) {
    throw new ApiError(
      502,
      "Unexpected response format from AI recommendation engine",
    );
  }

  return result.recommendations;
};
