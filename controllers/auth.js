const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

//Desc    Register user
//Route   POST /api/v1/auth/register
//Access  Public
exports.register = asyncHandler(async (req, res, next) => {
  //Get data from user submission
  const { name, email, password, role } = req.body;
  //Create User
  const user = await User.create({
    name,
    email,
    password,
    role
  });
  //Create token
  const token = user.getSignedJwtToken();
  //Send Response
  res.status(200).json({
    success: true,
    token,
    data: user
  });
});

//Desc    Login user
//Route   POST /api/v1/auth/login
//Access  Public
exports.login = asyncHandler(async (req, res, next) => {
  //Get data from user submission
  const { email, password } = req.body;
  //Make sure email and password exist
  if (!email || !password) {
    return next(new ErrorResponse(`Please provide email and password`, 400));
  }
  //Check that user exists
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorResponse(`Invalid credentials`, 401));
  }
  //Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse(`Invalid credentials`, 401));
  }
  //Create token
  const token = user.getSignedJwtToken();
  //Send Response
  res.status(200).json({
    success: true,
    token,
    data: user
  });
});