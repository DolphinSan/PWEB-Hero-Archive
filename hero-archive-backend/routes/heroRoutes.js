const express = require('express');
const router = express.Router();
const heroController = require('../controllers/heroController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public routes
router.get('/', heroController.getAllHeroes);
router.get('/:id', heroController.getHeroById);

// Admin only routes
router.post('/', authMiddleware, adminMiddleware, heroController.createHero);
router.put('/:id', authMiddleware, adminMiddleware, heroController.updateHero);
router.delete('/:id', authMiddleware, adminMiddleware, heroController.deleteHero);

module.exports = router;