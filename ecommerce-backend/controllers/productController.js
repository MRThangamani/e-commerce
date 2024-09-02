const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

exports.getProducts = async (req, res) => {
  const filePath = path.join(__dirname, 'data', 'product.json');
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the products file:', err);
      return res.status(500).json({ error: 'Failed to load products' });
    }
    try {
      const products = JSON.parse(data);
      res.json(products);
    } catch (parseError) {
      console.error('Error parsing the products file:', parseError);
      res.status(500).json({ error: 'Failed to parse products' });
    }
  });
};


exports.loadProductsFromFile = (req, res) => {
  const filePath = path.join(__dirname, 'data', 'product.json');
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the products file:', err);
      return res.status(500).json({ error: 'Failed to load products' });
    }
    try {
      const products = JSON.parse(data);
      res.json(products);
    } catch (parseError) {
      console.error('Error parsing the products file:', parseError);
      res.status(500).json({ error: 'Failed to parse products' });
    }
  });
};
