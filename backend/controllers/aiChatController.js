const aiChatService = require("../services/aiChatService");

const getJewelryRecommendation = async (req, res) => {
    try {
        const { userPrompt } = req.body;

        if (!userPrompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        // Call the service
        const reply = await aiChatService.generateRecommendation(userPrompt);

        res.json({ reply });
    } catch (error) {
        console.error("Chatbot Error:", error);
        res.status(503).json({ 
            success: false, 
            message: "AI service is currently unavailable",
            errorType: error.message.includes("429") ? "RATE_LIMIT" : "GENERAL_ERROR"
        });
    }
};

module.exports = {
    getJewelryRecommendation
};