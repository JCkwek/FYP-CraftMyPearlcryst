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

    const jewelryType = components.find(c => c.step === 1)?.name || 'jewelry';
    const mainMaterial = components.find(c => c.step === 2 || c.step === 3)?.name || '';
    const otherDetails = components
        .filter(c => c.step !== 1 && c.step !== 2)
        .map(c => c.prompt_fragment)
        .join(', ');
    const lengthContext = length ? `${length} inch length` : '';
    const materialMapping = ['Pearl', 'Crystal', 'Stone', 'Beaded'];
    let mainSubject = "";
    if (materialMapping.includes(mainMaterial)) {
        // This forces the "Single Strand" look and avoids chains
        mainSubject = `A single-strand ${jewelryType} made entirely of matching ${mainMaterial}s, no metal chain, consistent ${mainMaterial} texture throughout`;
    } else {
        // Standard metal-based jewelry
        mainSubject = `A high-end ${mainMaterial} ${jewelryType}`;
    }


    // Get the base descriptions from your DB
    // const fragments = components.map(c => c.prompt_fragment).join(', ');
    // Add the length context if it exists

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

module.exports = {
    getComponentsByStep,
    buildPromptFromSelections,
    getLengthConstraints
};