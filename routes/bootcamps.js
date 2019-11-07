const express = require('express');
const {
  getBootcamps,
  getBootcamp,
  getBootcampsInRadius,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp } = require('../controllers/bootcamps');
const router = express.Router();

//GET - Get all bootcamps
router.get('/', getBootcamps);

//GET - Get bootcamp by ID
router.get('/:id', getBootcamp);

//GET - Get bootcamp within radius
router.get('/radius/:zipcode/:distance', getBootcampsInRadius);

//POST - Create new bootcamp
router.post('/', createBootcamp);

//PUT - Update bootcamp by ID
router.put('/:id', updateBootcamp);

//DELETE - Delete bootcamp by ID
router.delete('/:id', deleteBootcamp);

module.exports = router;