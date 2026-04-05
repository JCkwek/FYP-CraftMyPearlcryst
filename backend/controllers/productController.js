const productService = require('../services/productService');

const getProducts = async (req, res) => {
    try {
        const { q, type, available, limit, latest } = req.query;

        // Validation for limit to prevent NaN errors
        const parsedLimit = (limit && !isNaN(limit)) ? parseInt(limit) : undefined;

        const products = await productService.getProducts({
            query: q,
            type,
            onlyAvailable: available === 'true',
            limit: limit? parseInt(limit) : undefined,
            latest: latest ==='true'
        });

        res.status(200).json(products);
    } catch (err) {
        console.error("Controller Error (getProducts):", err);
        res.status(500).json({ error: "Internal server error while fetching products" });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await productService.getProductById(id);

        if (!product) {
            return res.status(404).json({ message: "Error fetching product details" });
        }

        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { getProducts, getProductById};