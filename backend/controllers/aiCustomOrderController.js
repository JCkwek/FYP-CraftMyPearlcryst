const AiCustomOrderService = require('../services/AiCustomOrderService');

const submitForQuote = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ 
                error: 'Authentication failed: User ID not found in token.' 
            });
        } 
        const { resultId } = req.body;
        if (!resultId) {
            return res.status(400).json({ error: 'Missing design ID (resultId).' });
        }

        if (!resultId) {
            return res.status(400).json({ error: 'Missing design ID.' });
        }

        const newOrder = await AiCustomOrderService.submitForQuote(userId, resultId);
        
        res.status(201).json({
            message: 'Your design has been submitted to our artisans!',
            order: newOrder
        });
    } catch (error) {
        console.error('Submit Quote Error:', error);
        res.status(500).json({ error: error.message || 'Failed to submit request.' });
    }
};

const getAiCustomOrdersByUserId = async (req, res) => {
    try {
        const userId = req.user?.id;
        const orders = await AiCustomOrderService.getAiCustomOrdersByUserId(userId);
        res.status(200).json(orders);
    } catch (error) {
        console.error('Fetch Custom Orders Error:', error);
        res.status(500).json({ error: 'Could not retrieve your custom designs.' });
    }
};

const removeAiCustomOrder = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { orderId } = req.params;
        await AiCustomOrderService.removeAiCustomOrder(userId, orderId);
        res.status(200).json({ message: "Custom order request removed successfully." });
    } catch (error) {
        console.error("Delete Order Error:", error);
        res.status(500).json({ error: 'Fail to remove ai custom order.' });
    }
};

//admin
const getAllAiCustomOrder = async (req,res) => {
    try{
        const orders = await AiCustomOrderService.getAllAiCustomOrder();
        res.status(200).json(orders);
    }catch(error){
        console.error('Fetch All Ai Custom Orders Error:', error);
        res.status(500).json({ error: 'Could not retrieve All Ai Custom Orders.' });
    }   
}

const updateAiCustomOrder = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Forbidden" });
        }

        const updated = await AiCustomOrderService.updateAiCustomOrder(
            id,
            req.body
        );

        return res.json({
            message: "AI custom order updated successfully",
            data: updated
        });

    } catch (err) {
        return res.status(400).json({
            message: err.message
        });
    }
};

module.exports = {
    submitForQuote,
    getAiCustomOrdersByUserId,
    removeAiCustomOrder,
    getAllAiCustomOrder,
    updateAiCustomOrder
};