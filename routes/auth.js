const express = require('express');
const { register, login, getMe, forgotPassword, resetPassword, updateDetails, updatePassword, logout } = require('../controllers/auth');
const { protect } = require('../middleware/auth');
const router = express.Router();

//POST - Register user
router.post('/register', register);

//POST - Login user
router.post('/login', login);

//GET - Logout Current user
router.get('/logout', logout);

//GET - Get Current user
router.get('/me', protect, getMe);

//POST - Forgot password
router.post('/forgotpassword', forgotPassword);

//PUT - Reset password
router.put('/resetpassword/:resettoken', resetPassword);

//PUT - Update user details
router.put('/updatedetails', protect, updateDetails);

//PUT - Update user password
router.put('/updatepassword', protect, updatePassword);

module.exports = router;