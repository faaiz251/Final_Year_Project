const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  getSummary,
  listDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  listInventory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} = require('../controllers/adminController');

const router = express.Router();

// All admin routes require admin role
router.use(authMiddleware, roleMiddleware('admin'));

router.get('/summary', getSummary);

// User management
router.get('/users', listUsers);
router.post(
  '/users',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password of 6+ chars required'),
    body('role').isIn(['admin', 'doctor', 'patient', 'staff']).withMessage('Invalid role'),
  ],
  createUser
);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Departments
router.get('/departments', listDepartments);
router.post('/departments', createDepartment);
router.put('/departments/:id', updateDepartment);
router.delete('/departments/:id', deleteDepartment);

// Inventory / Pharmacy
router.get('/inventory', listInventory);
router.post('/inventory', createInventoryItem);
router.put('/inventory/:id', updateInventoryItem);
router.delete('/inventory/:id', deleteInventoryItem);

module.exports = router;

