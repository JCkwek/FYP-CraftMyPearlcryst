const { Product } = require('../models/productModel');
const {Op} = require('sequelize');

const getProducts = async (query) => {
     console.log("QUERY:", query);
    if(query){
        //search
        return await Product.findAll({
            where: {
                product_name: {
                    [Op.like]: `%${query}%`
                }
            }
        });
    }
    //default return all
  return await Product.findAll();
};

module.exports = { getProducts };
