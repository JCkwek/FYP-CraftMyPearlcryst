const { AIJewelryComponent, AIGeneratedResult } = require('../models');
const { Op } = require('sequelize');

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

    // Get the base descriptions from your DB
    const fragments = components.map(c => c.prompt_fragment).join(', ');
    // Add the length context if it exists
    const lengthContext = length ? `${length} inch length` : '';
    const masterPrompt = `Professional jewelry photography, a high-quality ${fragments}, ${lengthContext}, 
    macro shot, white marble background, soft studio lighting, elegant 8k resolution, highly detailed, 
    photorealistic, luxury aesthetic.`;

    return masterPrompt;
    
    // Join all the prompt fragments into a single string for Hugging Face
    // return components.map(c => c.prompt_fragment).join(', ');
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

module.exports = {
    getComponentsByStep,
    buildPromptFromSelections,
    getLengthConstraints
};