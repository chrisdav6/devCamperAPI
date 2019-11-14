const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendMail = require('../utils/sendEmail');
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

//Desc    Log user out / clear cookie
//Route   GET /api/v1/auth/logout
//Access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  //Clear the cookie
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  //Send Response
  res.status(200).json({
    success: true,
    data: {}
  });
});

//Desc    Get current logged in user
//Route   GET /api/v1/auth/me
//Access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  //Get User by ID
  const user = await User.findById(req.user.id);
  //Send Response
  res.status(200).json({
    success: true,
    data: user
  });
});

//Desc    Forgot Password
//Route   POST /api/v1/auth/forgotpassword
//Access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  //Find user by submitted email
  const user = await User.findOne({ email: req.body.email });
  //Make sure user exists
  if (!user) {
    return next(new ErrorResponse(`No user found with email ${req.body.email}`, 404));
  }
  //Get reset token
  const resetToken = user.getResetPasswordToken();
  //Save User
  await user.save({ validateBeforeSave: false });
  //Create reset URL
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
  //Create Message
  const message = `You are receiving this eamil because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetURL}`;
  //Send Email
  try {
    await sendMail({
      email: user.email,
      subject: 'Password Reset Token',
      message
    });
    //Send Response
    res.status(200).json({
      success: true,
      data: 'Email Sent'
    });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse(`Email could not be sent`, 500));
  }
});

//Desc    Reset password
//Route   PUT /api/v1/auth/resetpassword/:resettoken
//Access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  //Get hashed token from URL
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
  //Get User by reset token
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });
  //Make sure user exists
  if (!user) {
    return next(new ErrorResponse(`Invalid token`, 400));
  }
  //Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  //Save user
  await user.save();
  //Send token response
  sendTokenResponse(user, 200, res);
});

//Desc    Update user details
//Route   PUT /api/v1/auth/updatedetails
//Access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  //Get fields to update
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email
  };
  //Get User by ID and Update
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });
  //Send Response
  res.status(200).json({
    success: true,
    data: user
  });
});

//Desc    Update user password
//Route   PUT /api/v1/auth/updatepassword
//Access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  //Get User by ID and select password
  const user = await User.findById(req.user.id).select('+password');
  //Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse(`Password is incorrect`, 401));
  }
  //Set password to new supplied password
  user.password = req.body.newPassword;
  //Save user
  await user.save();
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
