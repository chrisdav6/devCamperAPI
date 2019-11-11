const express = require('express');
const { register, login } = require('../controllers/auth');
const router = express.Router();

//POST - Register user
router.post('/register', register);

//POST - Login user
router.post('/login', login);

module.exports = router;