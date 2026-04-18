const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Product } = require("../models");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateRecommendation = async (userPrompt) => {
    // 1. Logic: Fetch data
    const products = await Product.findAll({
        attributes: ['product_name', 'product_desc', 'product_price', 'product_material']
    });

    // 2. Logic: Setup AI
    const model = genAI.getGenerativeModel({ 
        model: "gemini-3.1-flash-lite-preview",
        // systemInstruction: "You are a luxury jewelry assistant for CraftMyPearlCryst. Use the provided catalog to suggest specific items. Be elegant."
    });

    const productContext = `You are a luxury jewelry assistant for CraftMyPearlCryst. 
    Our current catalog: ${JSON.stringify(products)}. 
    Use this catalog to suggest items elegantly.`;
    const fullPrompt = `${productContext}\n\nUser Question: ${userPrompt}`;

    // 3. Logic: Call API
    try {
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini API Error:", error.message);
        return "I'm having a moment to polish our pearls. Please try asking about our collection again in a second!";
    }
};

module.exports = { generateRecommendation };