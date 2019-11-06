const Bootcamp = require('../models/Bootcamp');

//Route   GET /api/v1/bootcamps
//Access  Public
exports.getBootcamps = async (req, res, next) => {
  try {
    //Get all bootcamps
    const bootcamps = await Bootcamp.find();
    //Send Response
    res.status(200)
      .json({
        success: true,
        data: bootcamps
      });
  } catch (err) {
    res.status(400)
      .json({
        success: false
      });
  }
};

//Desc    Get single bootcamp by ID
//Route   GET /api/v1/bootcamps/:id
//Access  Public
exports.getBootcamp = async (req, res, next) => {
  try {
    //Get single bootcamp by ID
    const bootcamp = await Bootcamp.findById(req.params.id);
    //Send Error if no Bootcamp found
    if (!bootcamp) {
      return res.status(400)
        .json({
          success: false
        });
    }
    //Send Response
    res.status(200)
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
exports.updateBootcamp = async (req, res, next) => {
  try {
    //Get single bootcamp by ID and Update
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    //Send Error if no Bootcamp found
    if (!bootcamp) {
      return res.status(400)
        .json({
          success: false
        });
    }
    //Send Response
    res.status(200)
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