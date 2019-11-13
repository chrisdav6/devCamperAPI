const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');

//Desc    Get all reviews
//Route   GET /api/v1/reviews
//Route   GET /api/v1/bootcamps/:bootcampId/reviews
//Access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  //Check if bootcamp id was passed into the params
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    })
  } else {
    res.status(200).json(res.advancedResults);
  }
});

//Desc    Get single review by ID
//Route   GET /api/v1/reviews/:id
//Access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  //Get single review by ID
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
  });
  //Send Error if no Review found
  if (!review) {
    return next(new ErrorResponse(`Review not found with ID of ${req.params.id}`, 404));
  }
  //Send Response
  res.status(200)
    .json({
      success: true,
      data: review
    });
});

//Desc    Add new review
//Route   POST /api/v1/bootcamps/:bootcampId/reviews
//Access  Private
exports.createReview = asyncHandler(async (req, res, next) => {
  //Get User
  req.body.user = req.user.id;
  //Get Bootcamp id
  req.body.bootcamp = req.params.bootcampId;
  //Get bootcamp
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  //Send Error if no Bootcamp found
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with ID of ${req.params.bootcampId}`, 404));
  }
  //Create review
  const review = await Review.create(req.body);
  //Send Response
  res.status(201)
    .json({
      success: true,
      data: review
    });
});

//Desc    Update review
//Route   PUT /api/v1/reviews/:id
//Access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  //Find review by ID
  let review = await Review.findById(req.params.id);
  //Send Error if no review found
  if (!review) {
    return next(new ErrorResponse(`Review not found with ID of ${req.params.id}`, 404));
  }
  //Make sure review belongs to logged in user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User with ID of ${req.user.id} is not authorized to update review ${review._id}`, 401));
  }
  //Update review
  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  //Send Response
  res.status(200)
    .json({
      success: true,
      data: review
    });
});