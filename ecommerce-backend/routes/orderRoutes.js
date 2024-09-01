const express = require('express');
const router = express.Router();
const { placeOrder, getOrderSummary } = require('../controllers/orderController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/place', authMiddleware, placeOrder);
router.get('/summary', authMiddleware, getOrderSummary);

module.exports = router;
