const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware); // All routes require authentication

router.post('/', favoriteController.addFavorite);
router.get('/', favoriteController.getFavorites);
router.put('/:id', favoriteController.updateFavorite);
router.delete('/:id', favoriteController.deleteFavorite);

module.exports = router;