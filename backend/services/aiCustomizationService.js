const { AiJewelryComponent, AiGeneratedResult } = require('../models');
const { Op } = require('sequelize');
const { InferenceClient } = require('@huggingface/inference');
const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const getComponentsByStep = async (step, requirementName) => {
    const whereClause = { 
        step: parseInt(step) 
    };
    if (requirementName) {
        whereClause[Op.or] = [
            { requirement: requirementName },
            { requirement: null }
        ];
    }else if (parseInt(step) > 1) {
        // If it's step 2+ and no requirement is sent, it might be an error 
        // or we only want universal items.
        whereClause.requirement = null;
    }
    
    return await AiJewelryComponent.findAll({
        where: whereClause,
        order: [['name', 'ASC']]
    });
};

const buildPromptFromSelections = async (selectionIds, length =null) => {
    const components = await AiJewelryComponent.findAll({
        where: { component_id: selectionIds },
        order: [['step', 'ASC']]
    });

    const jewelryType = components.find(c => c.step === 1)?.name || 'jewelry';
    const mainMaterial = components.find(c => c.step === 2)?.name || '';
    const variantComponent = components.find(c => c.step === 3);
    const colorValue = (variantComponent?.prompt_fragment || variantComponent?.name || '').toLowerCase();
    const materialDisplay = colorValue.includes(mainMaterial.toLowerCase()) ? '' : mainMaterial;

    const otherDetails = components
        .filter(c => [4,6,7].includes(c.step))
        .map(c => {
            if (c.name === 'No Pendant') return null;   
            return c.prompt_fragment || c.name;
        })
        .filter(Boolean)
        .join(', ');

    const lengthContext = length ? `${length} inch length` : '';
    const materialMapping = ['Pearl', 'Crystal', 'Stone', 'Beaded'];
    let pieceDescription = "";
    if (materialMapping.includes(mainMaterial)) {
        pieceDescription = `made of matching ${colorValue} ${mainMaterial}s, where every single bead is a consistent ${colorValue} hue`;
    } else {
        pieceDescription = `crafted from high-end ${colorValue} ${mainMaterial}`;
    }
    
    const masterPrompt = `A professional macro gallery photograph of a ${colorValue} ${mainMaterial} ${jewelryType}. 
        The piece is ${pieceDescription}. 
        ${otherDetails}. ${lengthContext}. 
        The ${colorValue} color is vibrant and saturated. 
        Perfectly centered on a clean white marble surface. 
        Soft studio lighting, sharp focus, 8k resolution. 
        Pristine minimalist product photography. 
        Clean background, no text, no watermarks, no logos, no branding, no letters, no signatures.`
        .replace(/\s+/g, ' ')
        .trim();

    return masterPrompt;
};

const getLengthConstraints = (baseType, necklaceStyleName = null) => {
    if (baseType === 'Bracelet') {
        return { default: 6, min: 5, max: 9, unit: 'inch' };
    }

    const necklaceMap = {
        'Choker': { default: 14, min: 13, max: 16 },
        'Princess': { default: 18, min: 17, max: 20 },
        'Matinee': { default: 22, min: 20, max: 24 }
    };

    return necklaceMap[necklaceStyleName] || { default: 18, min: 16, max: 24, unit: 'inch' };
};

const generateJewelryImage = async ({
    selectionIds,
    length,
    userId
}) => {
    const prompt = await buildPromptFromSelections(
        selectionIds,
        length
    );
    console.log("Generated Prompt:", prompt);

    const client = new InferenceClient(
        process.env.HF_TOKEN.trim()
    );

    //hugging face
    const imageBlob = await client.textToImage({
        model: 'black-forest-labs/FLUX.1-schnell',
        // model: 'stabilityai/stable-diffusion-3.5-large-turbo',
        inputs: prompt,
        parameters: {
            num_inference_steps: 4
        }
    });

    const arrayBuffer = await imageBlob.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);
    //end hugging face

    //gemini testing
    // console.log("Using Gemini image generation");
    // const imageBuffer = await generateWithGemini(prompt);
    //end gemini testing

    const filename = `ai_${Date.now()}.png`;
    const uploadDir = path.join(
        __dirname,
        '../uploads/ai_generated'
    );

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, {
            recursive: true
        });
    }

    fs.writeFileSync(
        path.join(uploadDir, filename),
        imageBuffer
    );

    const publicUrl = `/uploads/ai_generated/${filename}`;

    const newResult = await AiGeneratedResult.create({
        full_prompt: prompt,
        image_url: publicUrl,
        selections: selectionIds,
        total_price: 0.00,
        user_id: userId
    });

    return {
        success: true,
        imageUrl: publicUrl,
        resultId: newResult.result_id
    };
};

const generateWithGemini = async (prompt) => {
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: prompt,
        config: {
            responseModalities: ['IMAGE']
        }
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(
        part => part.inlineData
    );

    if (!imagePart) {
        throw new Error('No image returned from Gemini');
    }

    return Buffer.from(imagePart.inlineData.data, 'base64');
};


//admin
const getAllComponents = async () => {
    return await AiJewelryComponent.findAll({
        order: [
            ['step', 'ASC'],
            ['name', 'ASC']
        ]
    });
};
const getAllRequirements = async () => {
    const requirements = await AiJewelryComponent.findAll({
        attributes: ['requirement'],
        where: {
            requirement: {
                [Op.ne]: null
            }
        },
        group: ['requirement'],
        order: [['requirement', 'ASC']]
    });

    return requirements.map(r => r.requirement);
};

const updateComponent = async (componentId, data) => {
    const component = await AiJewelryComponent.findByPk(componentId);

    if (!component) {
        throw new Error('Component not found');
    }

    await component.update({
        name: data.name,
        step: data.step,
        category: data.category,
        requirement: data.requirement || null,
        prompt_fragment: data.prompt_fragment,
        image_preview: data.image_preview || component.image_preview
    });

    return component;
};

const createComponent = async (data) => {
    return await AiJewelryComponent.create({
        name: data.name,
        step: data.step,
        category: data.category,
        requirement: data.requirement || null,
        prompt_fragment: data.prompt_fragment,
        image_preview: data.image_preview || null
    });
};

module.exports = {
    getComponentsByStep,
    buildPromptFromSelections,
    getLengthConstraints,
    generateJewelryImage,
    getAllComponents,
    getAllRequirements,
    updateComponent,
    createComponent
};