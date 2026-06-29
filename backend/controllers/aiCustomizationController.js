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

// Step 8 — generates a single image/ regenerate
const generateImage = async (req, res) => {
    try {
        const { selectionIds, length } = req.body;

        if (!selectionIds || selectionIds.length === 0) {
            return res.status(400).json({
                message: "No selectionIds provided"
            });
        }

        const result = await aiService.generateJewelryImage({
            selectionIds,
            length,
            userId: req.user?.user_id ?? null
        });

        res.status(200).json(result);
    } catch (error) {
        console.error("AI Generation Error:", error);
        res.status(500).json({
            message: "Failed to generate image",
            error: error.message
        });
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

//admin
const getAllComponents = async (req, res) => {
    try {
        const components = await aiService.getAllComponents();
        res.json(components);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Failed to fetch components'
        });
    }
};

const getAllRequirements = async (req, res) => {
    try {
        const requirements = await aiService.getAllRequirements();
        res.status(200).json(requirements);
    } catch (error) {
        console.error("Error fetching requirements:", error);
        res.status(500).json({
            message: "Failed to fetch requirements"
        });
    }
};

const updateComponent = async (req, res) => {
    try {
        // const { id } = req.params;
        // const updated = await aiService.updateComponent(id, req.body);
        // res.json({
        //     message: 'Component updated successfully',
        //     data: updated
        // });
        const data = {
            ...req.body,

            ...(req.file && {
                image_preview: `/uploads/${req.file.filename}`
            })
        };

        const result = await aiService.updateComponent(
            req.params.id,
            data
        );

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to update component'
        });
    }
};

const createComponent = async (req, res) => {
    try {
        // const created = await aiService.createComponent(req.body);
        // res.json({
        //     message: 'Component created successfully',
        //     data: created
        // });
        const data = {
            ...req.body,
            image_preview: req.file
                ? `/uploads/${req.file.filename}`
                : null
        };

        const result = await aiService.createComponent(data);

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create component' });
    }
};

const deleteComponent = async (req, res) => {
    try {
        const { id } = req.params;
        await aiService.deleteComponent(id);
        res.json({ message: 'Component deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete component' });
    }
};

module.exports = {
    getStepOptions,
    generateImage,
    getLengths,
    getAllComponents,
    getAllRequirements,
    updateComponent,
    createComponent,
    deleteComponent
};