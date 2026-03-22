const productService = require('../services/productService');

const getProducts = async (req, res) => {
    try {
        const { q, type, available } = req.query;

        const products = await productService.getProducts({
            query: q,
            type,
            onlyAvailable: available === 'true'
        });

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getProducts };