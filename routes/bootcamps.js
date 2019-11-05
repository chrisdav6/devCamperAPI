const express = require('express');
const router = express.Router();

//GET - Get all bootcamps
router.get('/', (req, res, next) => {
  res.status(200)
    .json({
      success: true,
      msg: 'Show all bootcamps'
    });
});

//GET - Get bootcamp by ID
router.get('/:id', (req, res, next) => {
  res.status(200)
    .json({
      success: true,
      msg: `Show bootcamp ${req.params.id}`
    });
});

//POST - Create new bootcamp
router.post('/', (req, res, next) => {
  res.status(200)
    .json({
      success: true,
      msg: 'Create new bootcamp'
    });
});

//PUT - Update bootcamp by ID
router.put('/:id', (req, res, next) => {
  res.status(200)
    .json({
      success: true,
      msg: `Update bootcamp ${req.params.id}`
    });
});

//DELETE - Delete bootcamp by ID
router.delete('/:id', (req, res, next) => {
  res.status(200)
    .json({
      success: true,
      msg: `Delete bootcamp ${req.params.id}`
    });
});

module.exports = router;