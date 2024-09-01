const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Optionally load product data from a JSON file
exports.loadProductsFromFile = (req, res) => {

};
