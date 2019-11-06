const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');

//Route   GET /api/v1/bootcamps
//Access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  //Get all bootcamps
  const bootcamps = await Bootcamp.find();
  //Send Response
  res.status(200)
    .json({
      success: true,
      count: bootcamps.length,
      data: bootcamps
    });
});

//Desc    Get single bootcamp by ID
//Route   GET /api/v1/bootcamps/:id
//Access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  //Get single bootcamp by ID
  const bootcamp = await Bootcamp.findById(req.params.id);
  //Send Error if no Bootcamp found
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404));
  }
  //Send Response
  res.status(200)
    .json({
      success: true,
      data: bootcamp
    });
});

//Desc    Create new bootcamp
//Route   POST /api/v1/bootcamps
//Access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  //Create Post
  const bootcamp = await Bootcamp.create(req.body);
  //Send Response
  res.status(201)
    .json({
      success: true,
      data: bootcamp
    });
});

//Desc    Update bootcamp by ID
//Route   PUT /api/v1/bootcamps/:id
//Access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  //Get single bootcamp by ID and Update
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  //Send Error if no Bootcamp found
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404));
  }
  //Send Response
  res.status(200)
    .json({
      success: true,
      data: bootcamp
    });
});

//Desc    Delete bootcamp by ID
//Route   DELETE /api/v1/bootcamps/:id
//Access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  //Get single bootcamp by ID and Delete
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  //Send Error if no Bootcamp found
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404));
  }
  //Send Response
  res.status(200)
    .json({
      success: true,
      data: bootcamp
    });
});