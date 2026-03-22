const productService = require('../services/productService');

const getProducts = async (req, res) => {
    try {
        const { q, type, available, limit, latest } = req.query;

        const products = await productService.getProducts({
            query: q,
            type,
            onlyAvailable: available === 'true',
            limit: limit? parseInt(limit) : undefined,
            latest: latest ==='true'
        });

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getProducts };