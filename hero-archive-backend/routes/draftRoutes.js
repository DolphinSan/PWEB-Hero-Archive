const express = require('express');
const router = express.Router();
const draftController = require('../controllers/draftController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', draftController.createDraft);
router.get('/', draftController.getDrafts);
router.put('/:id', draftController.updateDraft);
router.delete('/:id', draftController.deleteDraft);

module.exports = router;