const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  getMyStaffProfile,
  updateMyStaffProfile,
  assignDepartment,
  updateSchedule,
  updateServiceStatus,
} = require('../controllers/staffController');

const router = express.Router();

router.use(authMiddleware);

// Staff self profile
router.get('/me', roleMiddleware('staff'), getMyStaffProfile);
router.put('/me', roleMiddleware('staff'), updateMyStaffProfile);

// Admin operations on staff
router.put('/:id/department', roleMiddleware('admin'), assignDepartment);
router.put('/:id/schedule', roleMiddleware('admin'), updateSchedule);
router.put('/:id/service-status', roleMiddleware('admin'), updateServiceStatus);

module.exports = router;

