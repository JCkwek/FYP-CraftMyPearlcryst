const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const orderService = require('../services/orderService');
const cartService = require ('../services/cartService');

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
            return acc + (item.Product.product_price*item.quantity);
        }, 0);

        //create stripe session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cart`,
            customer_email: req.user.email,
            line_items: cartItems.map(item => ({
                price_data: {
                    currency: 'myr',
                    product_data: {
                        name: item.Product.product_name,
                        images: [ `${process.env.CLIENT_URL}/${item.Product.product_image}`],
                    },
                    unit_amount: Math.round(item.Product.product_price*100),
                },
                quantity: item.quantity,
            })),
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
            await orderService.updateOrderStatus(session_id, 'paid');
            await cartService.clearCart(userId);
            return res.status(200).json({message: "Order placed successfully!"});
        }
        res.status(400).json({message: "Payment not verified"});
    }catch(err){
        res.status(500).json({error: err.message});
    }
};

module.exports = {checkout, confirmPayment};
