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
        const { productId, quantity, size } = req.body;

        if (!productId) {
            return res.status(400).json({ error: "Product ID is required" });
        }

        const result = await cartService.addToCart(userId, productId, quantity, size);

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
        // res.status(500).json({error: "Could not fetch cart items"})
        console.error("DETAILED GET_CART ERROR:", err); 
        res.status(500).json({ error: err.message });   // sends the real error to the browser
        if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Session expired. Please login again." });
        }
        // Otherwise, it's a real server error (like a DB issue)
        res.status(500).json({ error: "Could not fetch cart items" });
    }
}

const updateQuantity = async (req,res) => {
    try{
        const { cartItemId, action } = req.body;

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

        const updatedItem = await cartService.updateQuantity(userId, cartItemId, action);
        res.json(updatedItem);

    }catch(err){
        res.status(500).json({error: "Failed to update cart item quantity"})
    }
}

const deleteCartItem = async (req,res) => {
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
        
        const {cartItemId} = req.params;

        await cartService.deleteCartItem(userId, cartItemId);
        res.status(200).json({message: "Item removed from cart"});
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

const clearCart = async (req, res) => {
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

        await cartService.clearCart(userId);
        res.json({message: "Cart cleared successfully"});
    }catch(err){
        res.status(500).json({error: "Failed to clear cart"});
    }
}
module.exports = {
    addToCart, getCart, updateQuantity,deleteCartItem, clearCart
};