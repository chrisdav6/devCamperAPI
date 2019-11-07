const express = require('express');
const { getCourses } = require('../controllers/courses');
const router = express.Router({ mergeParams: true });

//GET - Get all courses
router.get('/', getCourses);

module.exports = router;