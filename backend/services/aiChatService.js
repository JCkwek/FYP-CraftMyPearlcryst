const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Product } = require("../models");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateRecommendation = async (userPrompt) => {
    const products = await Product.findAll({
        attributes: ['product_name', 'product_desc', 'product_price', 'product_material']
    });

    // const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview"});
    const models = ["gemini-3.1-flash-lite-preview", "gemini-2.5-flash-lite"];

    const productContext = `
      You are an expert luxury jewelry concierge for CraftMyPearlCryst.
      
      CORE RULES:
      1. CATALOG ONLY: Suggest products strictly from this list: ${JSON.stringify(products)}.
      2. CURRENCY: Always use "RM" (e.g., RM150). Never use "$".
      3. NO HALLUCINATIONS: Do not mention gift-wrapping or custom engraving.
      4. When suggesting a product, you MUST append the numeric ID tag exactly like this: [ID:number].
        DO NOT put the product name inside the ID brackets.
        Example: "I recommend the Pearl Bracelet [ID:12]"
      5. SPACING: Ensure there is a full blank line (double newline) between the last bullet point and your concluding sentence.
      
      6. RELEVANCY & SOFT PIVOT: 
         - If asked for items we don't carry (like watches), politely decline.
         - Do NOT list specific products automatically after a decline. 
         - Instead, offer to show them our jewelry collection generally if they wish to see an alternative.
         - Only list specific products (with IDs) if the user asks for recommendations or shows interest in a specific type of jewelry we actually have.

      TONE & STYLE:
      - Be sophisticated, helpful, and concise.
      - Use bullet points for multiple suggestions.
      - Bold product names only.
      
    If the user asks something completely unrelated to jewelry/fashion, politely inform them you are only trained to assist with CraftMyPearlCryst inquiries.
    `;

    const fullPrompt = `${productContext}\n\nUser Question: ${userPrompt}`;

    // call API
    for(const modelName of models){
      try{
          console.log(`Attempting with model: ${modelName}`);
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(fullPrompt);
          const response = await result.response;
          return response.text();
      }catch(err){
          console.error(`Error with ${modelName}:`, error.message);
          if (modelName === models[models.length - 1]) {
                throw new Error("All AI models are currently unavailable.");
          }
          console.log("Switching to backup model...");
      }
    }
};

module.exports = { generateRecommendation };