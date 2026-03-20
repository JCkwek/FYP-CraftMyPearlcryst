const productService = require('../services/productService');

const getProducts = async (req, res) => {
  try {
    const users = await productService.getProducts();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { getProducts };