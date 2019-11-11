const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');

//Desc    Get all bootcamps
//Route   GET /api/v1/bootcamps
//Access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  //Send Response
  res.status(200).json(res.advancedResults);
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
  //Create Bootcamp
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
  //Get single bootcamp by ID
  const bootcamp = await Bootcamp.findById(req.params.id);
  //Send Error if no Bootcamp found
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404));
  }
  //Remove bootcamp here so that it triggers 'remove' mongoose middleware to cascade delete courses
  await bootcamp.remove();
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

//Desc    Upload photo for bootcamp
//Route   PUT /api/v1/bootcamps/:id/photo
//Access  Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  //Get single bootcamp by ID
  const bootcamp = await Bootcamp.findById(req.params.id);
  //Send Error if no Bootcamp found
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404));
  }
  //Make sure file was uploaded successfully
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  //Make sure the file is an image
  const file = req.files.file;
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }
  //Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400));
  }
  //Create a custom file name
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  //Upload file
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    //Update DB with photo file name
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name, new: true });
    //Send Response
    res.status(200)
      .json({
        success: true,
        data: bootcamp
      });
  });
});