const aiService = require('../services/aiCustomizationService');
const axios = require('axios'); 
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

// Step 8
const generateImage = async (req, res) => {
    console.log("Incoming Request Body:", req.body);
    console.log("Token check:", process.env.HF_TOKEN?.substring(0, 5));
    try {
        // const { selectionIds, length } = req.body; 
        const selectionIds = req.body.selectionIds;
        const length = req.body.length;
        if (!selectionIds) {
            return res.status(400).json({ message: "No selectionIds provided" });
        }
        const prompt = await aiService.buildPromptFromSelections(selectionIds, length);
        console.log("Debug - Received IDs:", selectionIds);
        console.log("Debug - Received Length:", length);
        
        //call Hugging Face api
        const response = await axios({
            // url: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large",
            url: "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
            method: 'POST', // Use uppercase POST
            headers: {
                "Authorization": `Bearer ${process.env.HF_TOKEN.trim()}`,
                "Content-Type": "application/json",
                "Accept": "application/json" // Temporarily change this to JSON to see the real error
            },
            data: { 
                inputs: prompt,
                options: { wait_for_model: true }
            },
            // Temporarily COMMENT OUT responseType: 'arraybuffer'
            // responseType: 'arraybuffer', 
            timeout: 90000
        });
        // const response = await axios.post(
        //     "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
        //     { 
        //         inputs: prompt,
        //         options: { wait_for_model: true }
        //     },
        //     {
        //         headers: {
        //             "Authorization": `Bearer ${process.env.HF_TOKEN.trim()}`,
        //             "Content-Type": "application/json",
        //         },
        //         responseType: 'arraybuffer',
        //         timeout: 90000
        //     }
        // );
        const filename = `ai_${Date.now()}.png`;// create unique filename and save path
        const uploadDir = path.join(__dirname, '../uploads/ai_generated');// path goes up one level from 'controllers' then into 'uploads'

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, Buffer.from(response.data)); // save image

        // database Record
        const publicUrl = `/uploads/ai_generated/${filename}`;
        await AIGeneratedResult.create({
            prompt: prompt,
            image_url: publicUrl,
            selections_json: JSON.stringify(selectionIds)
        });
        res.status(200).json({ 
            success: true, 
            imageUrl: publicUrl 
        });
    } catch (error) {
        console.log("Error Status:", error.response?.status);
        console.log("Error Headers:", error.response?.headers);
        // If the error response is a Buffer (HTML), convert it to text
        let detailedError = error.message;
        if (error.response?.data instanceof Buffer) {
            detailedError = Buffer.from(error.response.data).toString();
        } else if (error.response?.data) {
            detailedError = JSON.stringify(error.response.data);
        }

        console.error("AI Generation Error Detail:", detailedError);
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