const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const  authMiddleware  = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Create prescription
router.post('/', prescriptionController.createPrescription);

// Get patient prescription history
router.get('/patient/:patientId/history', prescriptionController.getPatientPrescriptionHistory);

// Get disease-wise summary
router.get('/patient/:patientId/summary', prescriptionController.getDiseaseWiseSummary);

// Get prescriptions for specific disease
router.get('/patient/:patientId/disease/:disease', prescriptionController.getPrescriptionsByDisease);

module.exports = router;
