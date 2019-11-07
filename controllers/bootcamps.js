const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');

//Desc    Get all bootcamps
//Route   GET /api/v1/bootcamps
//Access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  //Use query params to create queryString to filter bootcamps
  let query;

  //Copy req.query
  const reqQuery = { ...req.query };

  //Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  //Loop over fields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  //Create query string
  let queryStr = JSON.stringify(reqQuery);

  //Create operators ($gt, $gte, $lt, $lte, $in)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  //Find resource
  query = Bootcamp.find(JSON.parse(queryStr));

  //Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  //Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  //Get all resources
  const bootcamps = await query;

  //Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    }
  }

  //Send Response
  res.status(200)
    .json({
      success: true,
      count: bootcamps.length,
      pagination: pagination,
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

//Desc    Get bootcamps within a radius
//Route   DELETE /api/v1/bootcamps/radius/:zipcode/:distance
//Access  Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  //Get params from user
  const { zipcode, distance } = req.params;

  //Get lat and lon from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  //Calculate radius using radians
  //Divide distance by radius of earth
  //Earth radius = 3,963 miles
  const radius = distance / 3963;

  //Query Bootcamps in radius
  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius]
      }
    }
  });

  //Send Response
  res.status(200)
    .json({
      success: true,
      count: bootcamps.length,
      data: bootcamps
    });
});