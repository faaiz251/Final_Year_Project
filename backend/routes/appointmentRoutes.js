const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  createAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
} = require('../controllers/appointmentController');

const router = express.Router();

router.use(authMiddleware);

// Patient creates appointment
router.post('/', roleMiddleware('patient'), createAppointment);

// Patient views own appointments
router.get('/my', roleMiddleware('patient'), getMyAppointments);

// Doctor views own appointments
router.get('/doctor', roleMiddleware('doctor'), getDoctorAppointments);

// Doctor or admin updates status
router.put('/:id/status', roleMiddleware('doctor', 'admin'), updateAppointmentStatus);

module.exports = router;

