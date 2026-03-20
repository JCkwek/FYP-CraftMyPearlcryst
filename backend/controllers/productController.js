const productService = require('../services/productService');

const getProducts = async (req, res) => {
  try {
    const query = req.query.q;
    const products = await productService.getProducts(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { getProducts };