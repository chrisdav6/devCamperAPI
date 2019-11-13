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