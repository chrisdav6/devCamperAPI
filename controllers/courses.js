const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

//Desc    Get all courses
//Route   GET /api/v1/courses
//Route   GET /api/v1/bootcamps/:bootcampId/courses
//Access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  //Check if bootcamp id was passed into the params
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    })
  } else {
    res.status(200).json(res.advancedResults);
  }
});

//Desc    Get single course by ID
//Route   GET /api/v1/courses/:id
//Access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  //Get single course by ID
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
  });
  //Send Error if no Course found
  if (!course) {
    return next(new ErrorResponse(`Course not found with ID of ${req.params.id}`, 404));
  }
  //Send Response
  res.status(200)
    .json({
      success: true,
      data: course
    });
});

//Desc    Create new course
//Route   POST /api/v1/bootcamps/:bootcampId/courses
//Access  Private
exports.createCourse = asyncHandler(async (req, res, next) => {
  //Get Bootcamp id
  req.body.bootcamp = req.params.bootcampId;
  //Get bootcamp
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  //Send Error if no Bootcamp found
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with ID of ${req.params.bootcampId}`, 404));
  }
  //Create Course
  const course = await Course.create(req.body);
  //Send Response
  res.status(201)
    .json({
      success: true,
      data: course
    });
});

//Desc    Update course
//Route   PUT /api/v1/courses/:id
//Access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  //Get single course by ID and Update
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  //Send Error if no Course found
  if (!course) {
    return next(new ErrorResponse(`Course not found with ID of ${req.params.id}`, 404));
  }
  //Send Response
  res.status(201)
    .json({
      success: true,
      data: course
    });
});

//Desc    Delete course by ID
//Route   DELETE /api/v1/courses/:id
//Access  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  //Get single course by ID
  const course = await Course.findById(req.params.id);
  //Send Error if no Course found
  if (!course) {
    return next(new ErrorResponse(`Course not found with ID of ${req.params.id}`, 404));
  }
  //Remove course here so that it triggers 'remove' mongoose middleware to cascade delete
  await course.remove();
  //Send Response
  res.status(200)
    .json({
      success: true,
      data: course
    });
});

