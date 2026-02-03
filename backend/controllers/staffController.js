const User = require('../models/User');

const getMyStaffProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-passwordHash')
      .populate('department', 'name');
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateMyStaffProfile = async (req, res) => {
  try {
    const { phone, address, schedule } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { phone, address, ...(schedule ? { schedule } : {}) } },
      { new: true }
    )
      .select('-passwordHash')
      .populate('department', 'name');
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const assignDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { departmentId } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { department: departmentId } },
      { new: true }
    ).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { schedule } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { schedule } },
      { new: true }
    ).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateServiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isOnDuty, shift } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { 'schedule.0.isOnDuty': isOnDuty, 'schedule.0.shift': shift } },
      { new: true }
    ).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getMyStaffProfile,
  updateMyStaffProfile,
  assignDepartment,
  updateSchedule,
  updateServiceStatus,
};

