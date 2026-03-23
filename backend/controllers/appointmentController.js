const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { markExpiredAppointments } = require('../utils/appointmentUtils');

/**
 * Create Appointment
 */
const createAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      date,
      time,
      reason,
      disease,
      fee,
      paymentMethod,
    } = req.body;

    // Validate required fields
    if (!doctorId || !date || !time) {
      return res.status(400).json({
        message: 'doctorId, date and time are required',
      });
    }

    // Validate future date
    const appointmentDate = new Date(date);
    if (appointmentDate < new Date()) {
      return res.status(400).json({
        message: 'Appointment date must be in the future',
      });
    }

    // Get doctor to retrieve their specialty fee if not provided
    const doctor = await User.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Use provided fee or doctor's specialtyFee or default to 1000
    const appointmentFee = fee || doctor.specialtyFee || 1000;

    const isOfflinePayment = paymentMethod === 'offline';

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date,
      time,
      reason,
      disease,
      fee: appointmentFee,
      paymentStatus: isOfflinePayment ? 'paid' : 'pending',
      paymentMethod: paymentMethod || 'offline',
      status: isOfflinePayment ? 'confirmed' : 'pending',
      createdBy: req.user._id,
    });

    // ✅ FIXED populate
    await appointment.populate([
      { path: 'patient', select: 'name email' },
      {
        path: 'doctor',
        select: 'name email specialization specialty specialtyFee',
      },
    ]);

    res.status(201).json({ appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Patient Appointments
 */
const getMyAppointments = async (req, res) => {
  try {
    await markExpiredAppointments();

    const appointments = await Appointment.find({
      patient: req.user._id,
    })
      .populate('doctor', 'name email specialization specialty specialtyFee')
      .sort({ date: 1 });

    const filtered = appointments.filter(
      (apt) => !(apt.status === 'no-show' && !apt.isCompleted)
    );

    res.json({ appointments: filtered });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Doctor Appointments
 */
const getDoctorAppointments = async (req, res) => {
  try {
    await markExpiredAppointments();

    const appointments = await Appointment.find({
      doctor: req.user._id,
    })
      .populate('patient', 'name email phone')
      .sort({ date: 1 });

    const filtered = appointments.filter(
      (apt) => !(apt.status === 'no-show' && !apt.isCompleted)
    );

    res.json({ appointments: filtered });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update Appointment Status (SAFE VERSION)
 */
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const allowedStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    if (notes) appointment.notes = notes;

    await appointment.save();

    res.json({ appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Mark Appointment Completed
 */
const markAppointmentCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    const { doctorNotes } = req.body;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Authorization
    if (appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Only the assigned doctor can mark completion',
      });
    }

    // Prevent duplicate completion
    if (appointment.isCompleted) {
      return res.status(400).json({
        message: 'Already completed',
      });
    }

    appointment.isCompleted = true;
    appointment.completedAt = new Date();
    appointment.doctorNotes = doctorNotes;
    appointment.status = 'completed';

    await appointment.save();

    // ✅ FIXED populate
    await appointment.populate([
      { path: 'patient', select: 'name email' },
      { path: 'doctor', select: 'name email specialization specialty' },
    ]);

    res.json({ appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  markAppointmentCompleted,
};