const express = require('express');
const {
  getBootcamps,
  getBootcamp,
  getBootcampsInRadius,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  bootcampPhotoUpload } = require('../controllers/bootcamps');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();
const Bootcamp = require('../models/Bootcamp');

//Advanced results
const advancedResults = require('../middleware/advancedResults');

//Include other resource routers
const courseRouter = require('./courses');
//Re-route into other resourse routers
router.use('/:bootcampId/courses', courseRouter);

//GET - Get all bootcamps
router.get('/', advancedResults(Bootcamp, 'courses'), getBootcamps);

//GET - Get bootcamp by ID
router.get('/:id', getBootcamp);

//GET - Get bootcamp within radius
router.get('/radius/:zipcode/:distance', getBootcampsInRadius);

//POST - Create new bootcamp
router.post('/', protect, authorize('publisher', 'admin'), createBootcamp);

//PUT - Update bootcamp by ID
router.put('/:id', protect, authorize('publisher', 'admin'), updateBootcamp);

//DELETE - Delete bootcamp by ID
router.delete('/:id', protect, authorize('publisher', 'admin'), deleteBootcamp);

//PUT - Upload bootcamp photo
router.put('/:id/photo', protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

module.exports = router;