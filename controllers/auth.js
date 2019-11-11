const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

//Desc    Register user
//Route   GET /api/v1/auth/register
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