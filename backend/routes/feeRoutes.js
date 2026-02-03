const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getFees, getFeeByDisease } = require('../controllers/feeController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getFees);
router.get('/by-disease', getFeeByDisease);

module.exports = router;
