const express = require('express');
const { register, login, getMe, forgotPassword } = require('../controllers/auth');
const { protect } = require('../middleware/auth');
const router = express.Router();

//POST - Register user
router.post('/register', register);

//POST - Login user
router.post('/login', login);

//GET - Get Current user
router.get('/me', protect, getMe);

//POST - Forgot password
router.post('/forgotpassword', forgotPassword);

module.exports = router;