const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Product } = require("../models");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateRecommendation = async (userPrompt) => {
    // fetch data
    const products = await Product.findAll({
        attributes: ['product_name', 'product_desc', 'product_price', 'product_material']
    });

    // setup AI model
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview"});

const productContext = `
  You are an expert luxury jewelry concierge for CraftMyPearlCryst.
  
  CORE RULES:
  1. CATALOG ONLY: Suggest products strictly from this list: ${JSON.stringify(products)}.
  2. CURRENCY: Always use "RM" (e.g., RM150). Never use "$".
  3. NO HALLUCINATIONS: Do not mention gift-wrapping or custom engraving.
  4. When suggesting a product, you MUST append the numeric ID tag exactly like this: [ID:number].
    DO NOT put the product name inside the ID brackets.
    Example: "I recommend the Pearl Bracelet [ID:12]"
  5. 9. SPACING: Ensure there is a full blank line (double newline) between the last bullet point and your concluding sentence.
  
  TONE & STYLE:
  - Be sophisticated, helpful, and concise.
  - Use bullet points for multiple suggestions.
  - Bold product names only.
  
  If asked for services we don't provide, stay in character but politely decline and suggest a beautiful jewelry piece instead.
`;

    const fullPrompt = `${productContext}\n\nUser Question: ${userPrompt}`;

    // call API
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
};

module.exports = { generateRecommendation };