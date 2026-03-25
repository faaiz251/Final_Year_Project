const Appointment = require('../models/Appointment');

/**
 * Start Treatment (only if appointment completed)
 */
exports.startTreatment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { treatmentName, treatmentDurationDays, treatmentEndDate, treatmentNotes } = req.body;

    // Validate required fields
    if (!treatmentName || (!treatmentDurationDays && !treatmentEndDate)) {
      return res.status(400).json({
        message: 'treatmentName and either treatmentDurationDays or treatmentEndDate are required'
      });
    }

    // Cannot have both duration and end date
    if (treatmentDurationDays && treatmentEndDate) {
      return res.status(400).json({
        message: 'Provide either treatmentDurationDays or treatmentEndDate, not both'
      });
    }

    // Find appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only doctor assigned to appointment can start treatment
    if (appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only assigned doctor can start treatment' });
    }

    // Appointment must be completed
    if (!appointment.isCompleted || appointment.status !== 'completed') {
      return res.status(400).json({
        message: 'Appointment must be completed before starting treatment'
      });
    }

    // Treatment already started
    if (appointment.treatment && appointment.treatment.treatmentStatus !== 'not-started') {
      return res.status(400).json({ message: 'Treatment already started for this appointment' });
    }

    // Validate dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (treatmentEndDate && new Date(treatmentEndDate) < today) {
      return res.status(400).json({ message: 'Treatment end date cannot be in the past' });
    }

    // Calculate end date if duration provided
    let finalEndDate = treatmentEndDate;
    if (treatmentDurationDays) {
      finalEndDate = new Date();
      finalEndDate.setDate(finalEndDate.getDate() + treatmentDurationDays);
    }

    // Validate duration days range
    if (treatmentDurationDays && (treatmentDurationDays < 1 || treatmentDurationDays > 730)) {
      return res.status(400).json({ message: 'Treatment duration must be between 1 and 730 days' });
    }

    // Update appointment with treatment
    appointment.treatment = {
      treatmentName,
      treatmentStartDate: new Date(),
      treatmentDurationDays,
      treatmentEndDate: finalEndDate,
      treatmentNotes,
      treatmentStatus: 'active'
    };

    await appointment.save();
    
    await appointment.populate([
      { path: 'patient', select: 'name email' },
      { path: 'doctor', select: 'name email specialization' }
    ]);

    res.status(201).json({
      message: 'Treatment started successfully',
      appointment
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get Treatment Details
 */
exports.getTreatment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId)
      .populate('patient', 'name email')
      .populate('doctor', 'name email specialization');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Access control
    const isPatient = appointment.patient._id.toString() === req.user._id.toString();
    const isDoctor = appointment.doctor._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isPatient && !isDoctor && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!appointment.treatment || appointment.treatment.treatmentStatus === 'not-started') {
      return res.status(404).json({ message: 'No active treatment for this appointment' });
    }

    res.json({
      appointment: {
        _id: appointment._id,
        patient: appointment.patient,
        doctor: appointment.doctor,
        date: appointment.date,
        status: appointment.status,
        treatment: appointment.treatment,
        remainingDays: appointment.remainingDays
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update Treatment Status
 */
exports.updateTreatmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { treatmentStatus } = req.body;

    if (!['active', 'completed', 'paused'].includes(treatmentStatus)) {
      return res.status(400).json({ message: 'Invalid treatment status' });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only doctor can update
    if (appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only doctor can update treatment' });
    }

    if (!appointment.treatment) {
      return res.status(404).json({ message: 'No treatment found' });
    }

    appointment.treatment.treatmentStatus = treatmentStatus;
    await appointment.save();

    res.json({ message: 'Treatment status updated', appointment });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
