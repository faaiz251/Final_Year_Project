const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { markAttendance, getAssignedPatients } = require('../controllers/doctorController');

const router = express.Router();

router.use(authMiddleware, roleMiddleware('doctor'));

router.post('/attendance', markAttendance);
router.get('/assigned-patients', getAssignedPatients);

module.exports = router;

