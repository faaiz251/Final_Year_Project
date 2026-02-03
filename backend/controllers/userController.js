const { validationResult } = require('express-validator');
const User = require('../models/User');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const listDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor', status: 'active' }).select(
      'name email specialization'
    );
    res.json({ doctors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { name, phone, gender, dateOfBirth, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          name,
          phone,
          gender,
          dateOfBirth,
          address,
        },
      },
      { new: true }
    ).select('-passwordHash');

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  listDoctors,
};

