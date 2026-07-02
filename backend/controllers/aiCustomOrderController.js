const AiCustomOrderService = require('../services/AiCustomOrderService');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { AiCustomOrder } = require('../models');

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
        const {
            query,
            status,
        } = req.query;

        const userId = req.user?.id;
        const orders = await AiCustomOrderService.getAiCustomOrdersByUserId(userId, query, status);
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

const updateAiOrderStatus = async (req,res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!id || !status) {
            return res.status(400).json({
                message: "id and status are required"
            });
        }

        await AiCustomOrderService.updateAiOrderStatus(id, status);

        return res.status(200).json({
            message: "Order status updated successfully"
        });

    } catch (error) {
        console.error("Update AiOrder Status Error:", error);
        return res.status(500).json({
            message: "Failed to update Ai order status"
        });
    }
}

// Customer: place order (quoted -> ordered) or cancel (quoted -> cancelled)
const updateMyAiOrderStatus = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const { status } = req.body;

        if (!['ordered', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: "Invalid status. Only 'ordered' or 'cancelled' are allowed." });
        }

        const order = await AiCustomOrder.findOne({ where: { id, user_id: userId } });

        if (!order) {
            return res.status(404).json({ message: "Order not found or unauthorized." });
        }
        if (order.status !== 'quoted') {
            return res.status(400).json({ message: "Only quoted orders can be placed or cancelled." });
        }

        order.status = status;
        await order.save();

        return res.status(200).json({ message: `Order ${status === 'ordered' ? 'placed' : 'cancelled'} successfully.`, order });
    } catch (error) {
        console.error('updateMyAiOrderStatus Error:', error);
        return res.status(500).json({ message: 'Failed to update order status.' });
    }
};

// Customer: create Stripe checkout session for an 'ordered' AI custom order
const createAiCheckoutSession = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        const order = await AiCustomOrder.findOne({ where: { id, user_id: userId } });

        if (!order) {
            return res.status(404).json({ message: "Order not found or unauthorized." });
        }
        if (order.status !== 'ordered') {
            return res.status(400).json({ message: "Only placed (ordered) orders can proceed to payment." });
        }
        if (!order.admin_price || parseFloat(order.admin_price) <= 0) {
            return res.status(400).json({ message: "Order has no valid quoted price." });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}&type=ai&orderId=${id}`,
            cancel_url: `${process.env.CLIENT_URL}/orders`,
            customer_email: req.user.email,
            metadata: {
                userId: userId.toString(),
                aiOrderId: id.toString(),
                type: 'ai_custom_order'
            },
            line_items: [
                {
                    price_data: {
                        currency: 'myr',
                        product_data: {
                            name: `AI Custom Jewellery Order #${id}`,
                            description: order.admin_note
                                ? `Artisan note: ${order.admin_note}`
                                : 'Custom AI-designed jewellery',
                        },
                        unit_amount: Math.round(parseFloat(order.admin_price) * 100),
                    },
                    quantity: 1,
                },
            ],
        });

        return res.status(200).json({ url: session.url });
    } catch (error) {
        console.error('createAiCheckoutSession Error:', error);
        return res.status(500).json({ message: 'Failed to create payment session.' });
    }
};

// Customer: called by /checkout-success page to confirm AI order payment
const confirmAiPayment = async (req, res) => {
    try {
        const { session_id, orderId } = req.query;
        const userId = req.user?.id;

        if (!session_id || !orderId) {
            return res.status(400).json({ message: "session_id and orderId are required." });
        }

        // Check if already marked paid (webhook may have fired first)
        const order = await AiCustomOrder.findOne({ where: { id: orderId, user_id: userId } });
        if (!order) {
            return res.status(404).json({ message: "Order not found or unauthorized." });
        }
        if (order.status === 'paid') {
            return res.status(200).json({ message: "Payment already confirmed." });
        }

        // Verify with Stripe
        const session = await stripe.checkout.sessions.retrieve(session_id);
        if (session.payment_status === 'paid') {
            order.status = 'paid';
            await order.save();
            return res.status(200).json({ message: "AI custom order payment confirmed!" });
        }

        return res.status(400).json({ message: "Payment not yet verified by Stripe." });
    } catch (error) {
        console.error('confirmAiPayment Error:', error);
        return res.status(500).json({ message: 'Failed to confirm payment.' });
    }
};

module.exports = {
    submitForQuote,
    getAiCustomOrdersByUserId,
    removeAiCustomOrder,
    updateMyAiOrderStatus,
    createAiCheckoutSession,
    confirmAiPayment,
    getAllAiCustomOrder,
    updateAiCustomOrder,
    updateAiOrderStatus
};