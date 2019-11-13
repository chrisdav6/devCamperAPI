const express = require('express');
const { getReviews } = require('../controllers/reviews');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router({ mergeParams: true });
const Review = require('../models/Review');

//Advanced results
const advancedResults = require('../middleware/advancedResults');

//GET - Get all reviews
router.get('/', advancedResults(Review, {
  path: 'bootcamp',
  select: 'name description'
}), getReviews);

module.exports = router;