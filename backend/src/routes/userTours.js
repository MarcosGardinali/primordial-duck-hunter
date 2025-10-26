const express = require('express');
const UserTourController = require('../controllers/UserTourController');
const auth = require('../middleware/auth');

const router = express.Router();
const userTourController = new UserTourController();

router.post('/complete', auth, userTourController.markTourCompleted.bind(userTourController));
router.get('/my-tours', auth, userTourController.getUserTours.bind(userTourController));

module.exports = router;