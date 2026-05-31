const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const orderService = require('../services/orderService');
const cartService = require ('../services/cartService');
const { OrderItem } = require('../models/orderItemModel');

const checkout = async (req, res) => {
    try{
        const userId = req.user.id;
        const userEmail = req.user.email;
        const cartItems = await cartService.getAllCartItem(userId);
        if(!cartItems || cartItems.length === 0 ){
            return res.status(400).json({ message: "Cart is empty"});
        }

        console.log("CLIENT_URL:", process.env.CLIENT_URL);

        const totalAmount = cartItems.reduce((acc, item) => {
            // return acc + (item.Product.product_price*item.quantity);
            const price = parseFloat(item.price_at_addition) || 0;
            return acc + (price * item.quantity);
        }, 0);

        //create stripe session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cart`,
            customer_email: req.user.email,
            line_items: cartItems.map(item => {
                const customDetails = typeof item.customization === 'string' 
                    ? JSON.parse(item.customization) 
                    : item.customization;

                return{
                    price_data: {
                    currency: 'myr',
                    product_data: {
                        name: item.Product.product_name,
                        // name: `${item.Product.product_name} (size: ${item.size || 'Standard'})`,
                        description: `Size: ${customDetails?.size || 'Standard'}, Color: ${customDetails?.color || 'N/A'}`,
                        images: [ `${process.env.CLIENT_URL}/${item.Product.product_image}`],
                    },
                    // unit_amount: Math.round(item.Product.product_price*100),
                    unit_amount: Math.round(parseFloat(item.price_at_addition)*100),
                },
                quantity: item.quantity,
            }
            }),
        });
        await orderService.createOrder(userId, cartItems, totalAmount, session.id);
        res.status(200).json({ url: session.url });
    }catch(err){
        console.error(err);
        res.status(500).json({error: "Checkout failed"});
    }
};

const confirmPayment = async (req, res) => {
    try{
        const {session_id} = req.query;
        const userId = req.user.id;
        if(!session_id){
            return res.status(400).json({message: "Session ID is required"});
        }

        const session = await stripe.checkout.sessions.retrieve(session_id);

        if(session.payment_status === 'paid'){
            await orderService.stripeUpdateOrderStatus(session_id, 'paid');
            await cartService.clearCart(userId);
            return res.status(200).json({message: "Order placed successfully!"});
        }
        res.status(400).json({message: "Payment not verified"});
    }catch(err){
        res.status(500).json({error: err.message});
    }
};

const getOrdersByUserId = async (req,res) => {
    try{
        const userId = req.user.id;
        const orders = await orderService.getOrdersByUserId(userId);
        res.json(orders);
    }catch(err){
        console.error("Order service error:", err);
        res.status(500).json({error: "Failed to fetch orders"});
    }
};

//admin
const getMonthlySalesData = async (req, res) => {
    try {
        const salesData = await orderService.getMonthlySalesData();
        const formattedData = salesData.map(item => ({
            month: item.dataValues.month,
            Sales: parseFloat(item.dataValues.Sales || 0) // Convert "4500.00" -> 4500
        }));
        return res.status(200).json(formattedData);

    } catch (error) {
        console.error("Error running sales dashboard metrics:", error);
        return res.status(500).json({ error: "Internal server error calculating sales data." });
    }
};

const getOrders = async (req, res) => {
    try {
        const {
            query,
            status,
            fromDate,
            toDate
        } = req.query;

        const orders = await orderService.getOrders({
            query,
            status,
            fromDate,
            toDate
        });
        res.json(orders);

    } catch (error) {
        console.error("Get Orders Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders"
        });
    }
};

const updateOrderStatus = async (req,res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!orderId || !status) {
            return res.status(400).json({
                message: "orderId and status are required"
            });
        }

        await orderService.updateOrderStatus(orderId, status);

        return res.status(200).json({
            message: "Order status updated successfully"
        });

    } catch (error) {
        console.error("Update Order Status Error:", error);
        return res.status(500).json({
            message: "Failed to update order status"
        });
    }
}
module.exports = {checkout, confirmPayment, getOrdersByUserId, getMonthlySalesData, getOrders, updateOrderStatus };
