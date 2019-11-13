const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

//Desc    Get all users
//Route   GET /api/v1/users
//Access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//Desc    Get single user by ID
//Route   GET /api/v1/users/:id
//Access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  //Get single user by ID
  const user = await User.findById(req.params.id);
  //Send Response
  res.status(200)
    .json({
      success: true,
      data: user
    });
});

//Desc    Create new user
//Route   POST /api/v1/users
//Access  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  //Create User
  const user = await User.create(req.body);
  //Send Response
  res.status(201)
    .json({
      success: true,
      data: user
    });
});

//Desc    Update user by ID
//Route   PUT /api/v1/users/:id
//Access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  //Find user by ID and Update
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  //Send Error if no User found
  if (!user) {
    return next(new ErrorResponse(`User not found with ID of ${req.params.id}`, 404));
  }
  //Send Response
  res.status(200)
    .json({
      success: true,
      data: user
    });
});

//Desc    Delete user by ID
//Route   DELETE /api/v1/users/:id
//Access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  //Get single user by ID and Delete
  const user = await User.findByIdAndRemove(req.params.id);
  //Send Error if no User found
  if (!user) {
    return next(new ErrorResponse(`User not found with ID of ${req.params.id}`, 404));
  }
  //Send Response
  res.status(200)
    .json({
      success: true,
      data: user
    });
});