const express = require('express');
const { getReviews, getReview, createReview, updateReview, deleteReview } = require('../controllers/reviews');
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

//GET - Get review by ID
router.get('/:id', getReview);

//POST - Create new review
router.post('/', protect, authorize('user', 'admin'), createReview);

//PUT - Update review by ID
router.put('/:id', protect, authorize('user', 'admin'), updateReview);

//DELETE - Delete review by ID
router.delete('/:id', protect, authorize('user', 'admin'), deleteReview);

module.exports = router;