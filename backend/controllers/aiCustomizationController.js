const aiService = require('../services/aiCustomizationService');
const { InferenceClient } = require('@huggingface/inference');
const fs = require('fs');
const path = require('path');
const { AIGeneratedResult } = require('../models');

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

// Step 8 — generates a single image; frontend calls this again to regenerate
const generateImage = async (req, res) => {
    try {
        const selectionIds = req.body.selectionIds;
        const length = req.body.length;

        if (!selectionIds) {
            return res.status(400).json({ message: "No selectionIds provided" });
        }

        const prompt = await aiService.buildPromptFromSelections(selectionIds, length);
        console.log("Debug - Generated Prompt:", prompt);

        const client = new InferenceClient(process.env.HF_TOKEN.trim());

        const imageBlob = await client.textToImage({
            model: 'black-forest-labs/FLUX.1-schnell',
            inputs: prompt,
            parameters: { num_inference_steps: 4 }
        });

        // Convert Blob -> Buffer -> save to disk
        const arrayBuffer = await imageBlob.arrayBuffer();
        const imageBuffer = Buffer.from(arrayBuffer);

        const filename = `ai_${Date.now()}.png`;
        const uploadDir = path.join(__dirname, '../uploads/ai_generated');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        fs.writeFileSync(path.join(uploadDir, filename), imageBuffer);

        const publicUrl = `/uploads/ai_generated/${filename}`;
        await AIGeneratedResult.create({
            full_prompt: prompt,
            image_url: publicUrl,
            selections: selectionIds,
            total_price: 0.00,
            user_id: req.user?.user_id ?? null
        });

        res.status(200).json({ success: true, imageUrl: publicUrl });
    } catch (error) {
        console.error("AI Generation Error:", error.message);
        res.status(500).json({ message: "Failed to generate image from AI", error: error.message });
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