const express = require('express');
const { register } = require('../controllers/auth');
const router = express.Router();

//POST - Register user
router.post('/register', register);

module.exports = router;