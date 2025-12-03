// routes/favorites.js ← PERBAIKAN URUTAN!
const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/authMiddleware');

// Terapkan auth untuk semua route
router.use(authMiddleware);

// URUTAN PENTING! Route spesifik dulu, baru yang umum
router.post('/', favoriteController.addFavorite);
router.get('/', favoriteController.getFavorites);
router.put('/:id', favoriteController.updateFavorite);
router.delete('/:id', favoriteController.deleteFavorite);

module.exports = router;