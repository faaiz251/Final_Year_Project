const Appointment = require('../models/Appointment');

const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, reason, disease, fee, paymentConfirmed, paymentMethod } = req.body;

    // For offline payment, just confirm the appointment
    // For online payment, the appointment is created with pending payment status
    const isOfflinePayment = paymentMethod === 'offline';
    const appointmentStatus = isOfflinePayment ? 'confirmed' : 'pending';
    const paymentStatus = isOfflinePayment ? 'pending' : 'pending';

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date,
      time,
      reason,
      disease,
      fee: fee || 0,
      paymentStatus,
      paymentMethod: paymentMethod || 'offline',
      status: appointmentStatus,
      createdBy: req.user._id,
    });

    const populated = await appointment
      .populate('patient', 'name email')
      .populate('doctor', 'name email specialization specialty specialtyFee')
      .execPopulate();

    res.status(201).json({ appointment: populated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('doctor', 'name email specialization specialty specialtyFee')
      .sort({ date: 1 });
    res.json({ appointments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user._id })
      .populate('patient', 'name email phone')
      .sort({ date: 1 });
    res.json({ appointments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { $set: { status, notes } },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

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
};

