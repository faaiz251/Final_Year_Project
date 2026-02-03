const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  createMedicalRecord,
  updateMedicalRecord,
  getPatientRecords,
  createPrescription,
  getPatientPrescriptions,
  getDoctorPrescriptions,
} = require('../controllers/medicalController');

const router = express.Router();

router.use(authMiddleware);

// Medical records
router.post('/records', roleMiddleware('doctor'), createMedicalRecord);
router.put('/records/:id', roleMiddleware('doctor'), updateMedicalRecord);
router.get('/records/patient/:id', roleMiddleware('doctor', 'patient'), getPatientRecords);

// Prescriptions
router.post('/prescriptions', roleMiddleware('doctor'), createPrescription);
router.get('/prescriptions/patient/:id', roleMiddleware('doctor', 'patient'), getPatientPrescriptions);
router.get('/prescriptions/doctor/me', roleMiddleware('doctor'), getDoctorPrescriptions);

module.exports = router;

