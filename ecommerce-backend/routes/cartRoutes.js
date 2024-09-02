const express = require('express');
const router = express.Router();
const { addToCart, getCart, updateCartItem, removeCartItem } = require('../controllers/cartController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/add', authMiddleware, addToCart);
router.get('/', authMiddleware, getCart);
router.post('/update', authMiddleware, updateCartItem);
router.post('/remove', authMiddleware, removeCartItem);

module.exports = router;
