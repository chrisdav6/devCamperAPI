const express = require('express');
const { getCourses, getCourse, createCourse, updateCourse } = require('../controllers/courses');
const router = express.Router({ mergeParams: true });

//GET - Get all courses
router.get('/', getCourses);

//GET - Get course by ID
router.get('/:id', getCourse);

//POST - Create new course
router.post('/', createCourse);

//PUT - Update course by ID
router.put('/:id', updateCourse);

module.exports = router;