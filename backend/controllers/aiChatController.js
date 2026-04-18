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
        console.error("Chatbot Controller Error:", error);
        res.status(500).json({ error: "Failed to get recommendation" });
    }
};

module.exports = {
    getJewelryRecommendation
};