const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');

//Desc    Get all courses
//Route   GET /api/v1/courses
//Route   GET /api/v1/bootcamps/:bootcampId/courses
//Access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  //Check if bootcamp id was passed into the params
  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description'
    });
  }

  //Get all resources
  const courses = await query;

  //Send Response
  res.status(200)
    .json({
      success: true,
      count: courses.length,
      data: courses
    });
});

