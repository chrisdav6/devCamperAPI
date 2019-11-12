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
  //Send token response
  sendTokenResponse(user, 200, res);
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
  //Send token response
  sendTokenResponse(user, 200, res);
});

//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create token
  const token = user.getSignedJwtToken();
  //Create cookie
  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }
  //Send Response
  res.status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
};

//Desc    Get current logged in user
//Route   GET /api/v1/auth/me
//Access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});