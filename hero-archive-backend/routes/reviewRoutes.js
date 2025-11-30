const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

// Public route - get reviews by hero
router.get('/hero/:hero_id', reviewController.getReviewsByHero);

// Protected routes
router.post('/', authMiddleware, reviewController.createReview);
router.put('/:id', authMiddleware, reviewController.updateReview);
router.delete('/:id', authMiddleware, reviewController.deleteReview);

module.exports = router;