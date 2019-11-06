const Bootcamp = require('../models/Bootcamp');

//Route   GET /api/v1/bootcamps
//Access  Public
exports.getBootcamps = (req, res, next) => {
  res.status(200)
    .json({
      success: true,
      msg: 'Show all bootcamps'
    });
};

//Desc    Get single bootcamp by ID
//Route   GET /api/v1/bootcamps/:id
//Access  Public
exports.getBootcamp = (req, res, next) => {
  res.status(200)
    .json({
      success: true,
      msg: `Show bootcamp ${req.params.id}`
    });
};

//Desc    Create new bootcamp
//Route   POST /api/v1/bootcamps
//Access  Private
exports.createBootcamp = async (req, res, next) => {
  try {
    //Create Post
    const bootcamp = await Bootcamp.create(req.body);
    //Send Response
    res.status(201)
      .json({
        success: true,
        data: bootcamp
      });
  } catch (err) {
    res.status(400)
      .json({
        success: false
      });
  }
};

//Desc    Update bootcamp by ID
//Route   PUT /api/v1/bootcamps/:id
//Access  Private
exports.updateBootcamp = (req, res, next) => {
  res.status(200)
    .json({
      success: true,
      msg: `Update bootcamp ${req.params.id}`
    });
};

//Desc    Delete bootcamp by ID
//Route   DELETE /api/v1/bootcamps/:id
//Access  Private
exports.deleteBootcamp = (req, res, next) => {
  res.status(200)
    .json({
      success: true,
      msg: `Delete bootcamp ${req.params.id}`
    });
};