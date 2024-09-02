const express = require('express');
const router = express.Router();
const { createOrder, getOrderSummary } = require('../controllers/orderController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/checkout', authMiddleware, createOrder);
router.get('/summary', authMiddleware, getOrderSummary);

module.exports = router;
