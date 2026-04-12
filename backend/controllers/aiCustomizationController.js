const aiService = require('../services/aiCustomizationService');

const getStepOptions = async (req, res) => {
    try {
        const { step } = req.params;
        const { req: requirementName } = req.query;

        const options = await aiService.getComponentsByStep(step, requirementName);
        
        res.status(200).json(options);
    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ message: "Error fetching customization options" });
    }
};

// Step 8
const generateImage = async (req, res) => {
    try {
        const { selectionIds } = req.body; 
        const prompt = await aiService.buildPromptFromSelections(selectionIds);
        
        // Later,  add the Hugging Face API call here
        res.status(200).json({ generatedPrompt: prompt });
    } catch (error) {
        res.status(500).json({ message: "Failed to build prompt" });
    }
};

const getLengths = async (req, res) => {
    try {
        const { baseType, styleName } = req.query; // e.g., ?baseType=Necklace&styleName=Choker
        const constraints = aiService.getLengthConstraints(baseType, styleName);
        res.status(200).json(constraints);
    } catch (error) {
        console.error("Error in getLengths:", error);
        res.status(500).json({ message: "Error calculating lengths" });
    }
};

module.exports = {
    getStepOptions,
    generateImage,
    getLengths
};