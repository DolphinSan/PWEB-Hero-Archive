const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/authMiddleware');

//a Auth for all route
router.use(authMiddleware);

router.post('/', favoriteController.addFavorite);
router.get('/', favoriteController.getFavorites);
router.put('/:id', favoriteController.updateFavorite);
router.delete('/:id', favoriteController.deleteFavorite);

module.exports = router;