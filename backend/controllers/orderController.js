const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const orderService = require('../services/orderService');
const cartService = require ('../services/cartService');
const { OrderItem } = require('../models/orderItemModel');


const getOrdersByUserId = async (req,res) => {
    try{
        const {
            query,
            status,
        } = req.query;

        const userId = req.user.id;
        const orders = await orderService.getOrdersByUserId(userId, query, status);
        res.json(orders);
    }catch(err){
        console.error("Order service error:", err);
        res.status(500).json({error: "Failed to fetch orders"});
    }
};

//payment
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
            cancel_url: `${process.env.CLIENT_URL}/checkout-unsuccess`,
            customer_email: req.user.email,
            metadata: {
                userId: userId.toString() 
            },
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
        // await orderService.createOrder(userId, cartItems, totalAmount, session.id);
        // await cartService.clearCart(userId);
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

        // const session = await stripe.checkout.sessions.retrieve(session_id);
        const existingOrder = await orderService.getOrderDetailsBySessionId(session_id);
        if (existingOrder) {
            console.log(`[Success Page] Order already created by webhook for session: ${session_id}`);
            return res.status(200).json({ message: "Order placed successfully!" });
        }

        console.log(`[Success Page] Webhook not detected. Running fallback verification...`);
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if(session.payment_status === 'paid'){
            const cartItems = await cartService.getAllCartItem(userId);
            if (!cartItems || cartItems.length === 0) {
                // If the cart is already empty and no order exists, the user might have refreshed. 
                const doubleCheckOrder = await orderService.getOrderDetailsBySessionId(session_id);
                if (doubleCheckOrder) {
                    return res.status(200).json({ message: "Order placed successfully!" });
                }
                return res.status(400).json({ message: "Cart is empty or order already processed." });
            }
            // await orderService.stripeUpdateOrderStatus(session_id, 'paid');
            // await cartService.clearCart(userId);

            // Recalculate total amount
            const totalAmount = cartItems.reduce((acc, item) => {
                const price = parseFloat(item.price_at_addition) || 0;
                return acc + (price * item.quantity);
            }, 0);

            // Create the order manually inside the database as 'paid'
            await orderService.createOrder(userId, cartItems, totalAmount, session.id);
            await orderService.stripeUpdateOrderStatus(session.id, 'paid');

            // Wipe out the user's shopping cart
            await cartService.clearCart(userId);

            console.log(`[Success Page] Fallback successfully created order and cleared cart for User: ${userId}`);
            return res.status(200).json({ message: "Order placed successfully via fallback handler!" });
            // return res.status(200).json({message: "Order placed successfully!"});
        }
        res.status(400).json({message: "Payment not verified"});
    }catch(err){
        res.status(500).json({error: err.message});
    }
};

const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // Verify that the request actually came securely from Stripe
        event = stripe.webhooks.constructEvent(
            req.body, 
            sig, 
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error(`Webhook Signature Verification Failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.metadata.userId;

        try {
            // Fetch current cart items to populate order items
            const cartItems = await cartService.getAllCartItem(userId);

            if (cartItems && cartItems.length > 0) {
                // Recalculate total amount
                const totalAmount = cartItems.reduce((acc, item) => {
                    const price = parseFloat(item.price_at_addition) || 0;
                    return acc + (price * item.quantity);
                }, 0);

                // Create the order in your database (Sets to 'pending' via your service)
                const newOrder = await orderService.createOrder(userId, cartItems, totalAmount, session.id);

                // Instantly mark it 'paid' since Stripe confirmed payment
                await orderService.stripeUpdateOrderStatus(session.id, 'paid');

                // Empty out their cart
                await cartService.clearCart(userId);

                console.log(`Order created and cart cleared successfully for User: ${userId}`);
            }
        } catch (error) {
            console.error("Fulfillment error inside webhook:", error);
            return res.status(500).json({ error: "Fulfillment failed" });
        }
    }
    res.json({ received: true });
};

const payPendingOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;

        const order = await orderService.payPendingOrder(orderId, userId);

        if (!order) {
            return res.status(404).json({ message: "Pending order not found" });
        }

        // Create stripe session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/orders`,
            customer_email: req.user.email,
            metadata: {
                userId: userId.toString() 
            },
            line_items: order.OrderItems.map(item => {
                const customDetails = typeof item.customization === 'string' 
                    ? JSON.parse(item.customization) 
                    : item.customization;

                return {
                    price_data: {
                        currency: 'myr',
                        product_data: {
                            name: item.Product.product_name,
                            description: `Size: ${customDetails?.size || 'Standard'}, Color: ${customDetails?.color || 'N/A'}`,
                            images: [`${process.env.CLIENT_URL}/${item.Product.product_image}`],
                        },
                        unit_amount: Math.round(parseFloat(item.price_at_purchase) * 100),
                    },
                    quantity: item.quantity,
                };
            }),
        });

        await orderService.updateOrderSession(orderId, session.id);
        res.status(200).json({ url: session.url });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || "Payment session creation failed" });
    }
};


//end payment





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


module.exports = {
    checkout,
    confirmPayment,
    getOrdersByUserId,
    getMonthlySalesData,
    getOrders,
    updateOrderStatus,
    payPendingOrder,
    handleStripeWebhook
};
