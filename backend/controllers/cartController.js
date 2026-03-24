const cartService = require('../services/cartService');
const jwt = require('jsonwebtoken');

const addToCart = async (req, res) => {
    try {
        //get token
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({error: "No token provided"});
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);

        //set id from token
        const userId = decoded.id;

        //set data from request body
        const { productId, quantity } = req.body;

        const result = await cartService.addToCart(userId, productId, quantity);

        res.json({
            message: "Added to cart",
            data: result
        });

    } catch (err) {
        console.error(err);
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Invalid token" });
        }
        res.status(500).json({ error: err.message || "Failed to add to cart" });
    }
};

const getCart = async (req,res) => {
    try{
        //get token
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({error: "No token provided"});
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);

        //set id from token
        const userId = decoded.id;

        const items = await cartService.getAllCartItem(userId);
        res.json(items);

    }catch(err){
        res.status(500).json({error: "Could not fetch cart items"})
    }
}

module.exports = {
    addToCart, getCart
};