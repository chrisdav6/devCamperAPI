const express = require('express');
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse } = require('../controllers/courses');
const { protect } = require('../middleware/auth');
const router = express.Router({ mergeParams: true });
const Course = require('../models/Course');

//Advanced results
const advancedResults = require('../middleware/advancedResults');

//GET - Get all courses
router.get('/', advancedResults(Course, {
  path: 'bootcamp',
  select: 'name description'
}), getCourses);

//GET - Get course by ID
router.get('/:id', getCourse);

//POST - Create new course
router.post('/', protect, createCourse);

//PUT - Update course by ID
router.put('/:id', protect, updateCourse);

//DELETE - Delete course by ID
router.delete('/:id', protect, deleteCourse);

module.exports = router;