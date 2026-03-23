const Appointment = require('../models/Appointment');

/**
 * Check if an appointment has expired (date has passed)
 * @param {Date} appointmentDate - The appointment date
 * @returns {boolean}
 */
const isAppointmentExpired = (appointmentDate) => {
  const now = new Date();
  return appointmentDate < now;
};

/**
 * Mark expired appointments as 'expired' if they haven't been marked yet
 * Only marks those that are not in final states (completed, cancelled, expired, no-show)
 */
const markExpiredAppointments = async () => {
  try {
    const now = new Date();
    
    // Find appointments that are not in final status and date has passed
    const expiredAppointments = await Appointment.find({
      date: { $lt: now },
      status: { $in: ['pending', 'confirmed'] },
      isCompleted: false
    });

    // Update all expired appointments
    if (expiredAppointments.length > 0) {
      await Appointment.updateMany(
        {
          date: { $lt: now },
          status: { $in: ['pending', 'confirmed'] },
          isCompleted: false
        },
        {
          $set: { status: 'no-show' }
        }
      );
    }

    return expiredAppointments.length;
  } catch (err) {
    console.error('Error marking expired appointments:', err);
  }
};

/**
 * Get active appointments (filter out expired ones)
 * @param {Array} appointments - Array of appointments
 * @returns {Array} - Filtered appointments
 */
const filterActiveAppointments = (appointments) => {
  const now = new Date();
  return appointments.filter(apt => {
    // If appointment is in final status, don't include it
    if (['cancelled', 'expired', 'no-show'].includes(apt.status)) {
      return false;
    }
    // If completed, but date hasn't passed, include it
    if (apt.isCompleted) {
      return true;
    }
    // If not completed and date has passed, don't include
    if (apt.date < now) {
      return false;
    }
    // Otherwise include
    return true;
  });
};

module.exports = {
  isAppointmentExpired,
  markExpiredAppointments,
  filterActiveAppointments,
};
