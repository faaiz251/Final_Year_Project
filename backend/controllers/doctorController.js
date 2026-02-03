const User = require('../models/User');

const markAttendance = async (req, res) => {
  try {
    const { status } = req.body; // 'present' or 'absent'
    const today = new Date();
    const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const existingIndex = user.attendance.findIndex(
      (a) => a.date && new Date(a.date).toDateString() === dateOnly.toDateString()
    );

    if (existingIndex >= 0) {
      user.attendance[existingIndex].status = status;
    } else {
      user.attendance.push({ date: dateOnly, status });
    }

    await user.save();

    res.json({ attendance: user.attendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAssignedPatients = async (req, res) => {
  try {
    // For simplicity, use distinct patients from appointments via aggregation on the frontend;
    // here we just return basic doctor info. Appointment endpoint provides patients.
    const doctor = await User.findById(req.user._id).select('-passwordHash');
    res.json({ doctor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  markAttendance,
  getAssignedPatients,
};

