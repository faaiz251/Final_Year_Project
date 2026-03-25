const express = require('express');
const router = express.Router();
const treatmentController = require('../controllers/treatmentController');
const  authMiddleware  = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Start treatment (only after appointment completed)
router.post('/:appointmentId/start', treatmentController.startTreatment);

// Get treatment details
router.get('/:appointmentId', treatmentController.getTreatment);

// Update treatment status
router.patch('/:appointmentId/status', treatmentController.updateTreatmentStatus);

module.exports = router;
