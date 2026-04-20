const { AIJewelryComponent, AIGeneratedResult } = require('../models');
const { Op } = require('sequelize');
const { InferenceClient } = require('@huggingface/inference');
const fs = require('fs');
const path = require('path');

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
    
    return await AIJewelryComponent.findAll({
        where: whereClause,
        order: [['name', 'ASC']]
    });
};

const buildPromptFromSelections = async (selectionIds, length =null) => {
    const components = await AIJewelryComponent.findAll({
        where: { component_id: selectionIds },
        order: [['step', 'ASC']]
    });

    const jewelryType = components.find(c => c.step === 1)?.name || 'jewelry';
    const mainMaterial = components.find(c => c.step === 2 || c.step === 3)?.name || '';
    const otherDetails = components
        .filter(c => c.step !== 1 && c.step !== 2 && c.step !== 3)
        .map(c => c.prompt_fragment)
        .join(', ');
    const lengthContext = length ? `${length} inch length` : '';
    const materialMapping = ['Pearl', 'Crystal', 'Stone', 'Beaded'];
    let mainSubject = "";
    if (materialMapping.includes(mainMaterial)) {
        mainSubject = `A realistic luxury single-strand ${jewelryType} made entirely of matching ${mainMaterial}s, continuous connected structure, every bead physically linked, pendant securely attached and centered, no floating parts, no broken gaps, natural drape, consistent ${mainMaterial} texture throughout`;
    } else {
        mainSubject = `A high-end ${mainMaterial} ${jewelryType}`;
    }

    
    const masterPrompt = `Professional luxury jewelry photography, ${mainSubject}, ${otherDetails}, ${lengthContext}. 
    Single item, centered composition, macro shot, white marble background, soft studio lighting, 
    8k resolution, photorealistic, no extra layers, simple elegant design.`;

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

    const imageBlob = await client.textToImage({
        model: 'black-forest-labs/FLUX.1-schnell',
        inputs: prompt,
        parameters: {
            num_inference_steps: 4
        }
    });

    const arrayBuffer = await imageBlob.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

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

    await AIGeneratedResult.create({
        full_prompt: prompt,
        image_url: publicUrl,
        selections: selectionIds,
        total_price: 0.00,
        user_id: userId
    });

    return {
        success: true,
        imageUrl: publicUrl
    };
};
module.exports = {
    getComponentsByStep,
    buildPromptFromSelections,
    getLengthConstraints,
    generateJewelryImage
};