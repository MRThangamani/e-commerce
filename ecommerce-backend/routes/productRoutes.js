const express = require('express');
const router = express.Router();
const { getProducts, loadProductsFromFile } = require('../controllers/productController');
const { adminMiddleware } = require('../middlewares/authMiddleware');

router.get('/', getProducts);
router.post('/load', adminMiddleware, loadProductsFromFile); // Load products (admin only)

module.exports = router;
