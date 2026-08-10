export const buildDescriptionPrompt = ({
  name,
  category,
  brand,
  ingredients = [],
  skinType = [],
  hairType = [],
  concerns = [],
}) =>
  `
You are an expert skincare and beauty copywriter for an e-commerce store called DermaCare.

Write a detailed, SEO-friendly product description for the following product. The tone should be trustworthy, informative, and appealing to online shoppers researching personal care products — not overly salesy.

Product details:
- Name: ${name}
- Brand: ${brand || "N/A"}
- Category: ${category}
- Key ingredients: ${ingredients.length ? ingredients.join(", ") : "Not specified"}
- Suitable skin types: ${skinType.length ? skinType.join(", ") : "Not specified"}
- Suitable hair types: ${hairType.length ? hairType.join(", ") : "Not specified"}
- Targets concerns: ${concerns.length ? concerns.join(", ") : "Not specified"}

Requirements:
- 120-180 words.
- Mention how the ingredients benefit the skin/hair.
- Naturally include the product name and category as SEO keywords, without keyword-stuffing.
- Do NOT make unverified medical claims (e.g. "cures", "eliminates permanently"). Use phrasing like "helps reduce", "supports", "designed to".
- Return ONLY the description text — no markdown, no headers, no quotation marks.
`.trim();

export const buildRecommendationPrompt = ({
  skinType,
  hairType,
  concerns = [],
  purchaseHistory = [],
  candidateProducts = [],
}) =>
  `
You are a personal care shopping assistant for DermaCare, an e-commerce store selling skin care, hair care, body care, and makeup products.

User profile:
- Skin type: ${skinType || "Not specified"}
- Hair type: ${hairType || "Not specified"}
- Concerns: ${concerns.length ? concerns.join(", ") : "None specified"}
- Past purchases (product names): ${
    purchaseHistory.length ? purchaseHistory.join(", ") : "No prior purchases"
  }

Below is a list of candidate products currently in stock, each with an id. Select the products from THIS list that best match the user's profile — do not invent products that are not listed.

Candidate products (id | name | category | skinType | hairType | concerns):
${candidateProducts
  .map(
    (p) =>
      `${p.id} | ${p.name} | ${p.category} | ${(p.skinType || []).join("/")} | ${(
        p.hairType || []
      ).join("/")} | ${(p.concerns || []).join("/")}`,
  )
  .join("\n")}

Return ONLY valid JSON, no markdown fences, no explanation outside the JSON, in exactly this shape:
{
  "recommendations": [
    { "productId": "string", "reason": "one short sentence explaining why this fits the user" }
  ]
}

Return at most 6 recommendations, ordered by best fit first.
`.trim();
