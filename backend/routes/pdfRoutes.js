const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { generateAppointmentPDF } = require('../controllers/pdfController');

const router = express.Router();

// Generate appointment PDF
router.get('/appointment/:appointmentId', authMiddleware, generateAppointmentPDF);

module.exports = router;
