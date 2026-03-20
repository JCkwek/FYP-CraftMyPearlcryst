const { Product } = require('../models/productModel');

const getProducts = async () => {
  return await Product.findAll();
};

module.exports = { getProducts };
