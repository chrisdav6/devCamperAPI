const express = require('express');
const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/users');
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router({ mergeParams: true });

//Advanced results
const advancedResults = require('../middleware/advancedResults');

//Use Protect and authorize on all routes
router.use(protect);
router.use(authorize('admin'));

//GET - Get all users
router.get('/', advancedResults(User), getUsers);

//GET - Get single user
router.get('/:id', getUser);

//POST - Create user
router.post('/', createUser);

//PUT - Update user
router.put('/:id', updateUser);

//DELETE - Delete user
router.delete('/:id', deleteUser);

module.exports = router;