const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { getUsers } = require('../controllers/adminController');

router.post('/signup', signup);
router.post('/login', login);

router.get('/users', authMiddleware, getUsers);

module.exports = router;
