const Fee = require('../models/Fee');

const getFees = async (req, res) => {
  try {
    const fees = await Fee.find().sort({ disease: 1 });
    // If none exist, return a safe default set to avoid blocking frontend
    if (!fees || fees.length === 0) {
      const defaults = [
        { disease: 'General Consultation', amount: 500 },
        { disease: 'Cardiology', amount: 1500 },
        { disease: 'Orthopedics', amount: 1200 },
        { disease: 'Dermatology', amount: 800 },
      ];
      return res.json({ fees: defaults });
    }
    res.json({ fees });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getFeeByDisease = async (req, res) => {
  try {
    const { disease } = req.query;
    if (!disease) return res.status(400).json({ message: 'Missing disease query' });
    const fee = await Fee.findOne({ disease });
    if (!fee) return res.status(404).json({ message: 'Fee not found' });
    res.json({ fee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getFees,
  getFeeByDisease,
};
