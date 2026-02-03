const MedicalRecord = require('../models/MedicalRecord');
const Prescription = require('../models/Prescription');

const createMedicalRecord = async (req, res) => {
  try {
    const { patientId, visitDate, diagnosis, treatment, notes } = req.body;

    const record = await MedicalRecord.create({
      patient: patientId,
      doctor: req.user._id,
      visitDate,
      diagnosis,
      treatment,
      notes,
    });

    res.status(201).json({ record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { diagnosis, treatment, notes } = req.body;

    const record = await MedicalRecord.findByIdAndUpdate(
      id,
      { $set: { diagnosis, treatment, notes } },
      { new: true }
    );

    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    res.json({ record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPatientRecords = async (req, res) => {
  try {
    const { id } = req.params; // patient id
    // patient can view own, doctor can view any
    if (req.user.role === 'patient' && String(req.user._id) !== id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const records = await MedicalRecord.find({ patient: id })
      .populate('doctor', 'name email')
      .sort({ visitDate: -1 });

    res.json({ records });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createPrescription = async (req, res) => {
  try {
    const { patientId, medicalRecordId, medications } = req.body;

    const prescription = await Prescription.create({
      patient: patientId,
      doctor: req.user._id,
      medicalRecord: medicalRecordId || undefined,
      medications,
    });

    if (medicalRecordId) {
      await MedicalRecord.findByIdAndUpdate(medicalRecordId, {
        $push: { prescriptions: prescription._id },
      });
    }

    res.status(201).json({ prescription });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPatientPrescriptions = async (req, res) => {
  try {
    const { id } = req.params; // patient id
    if (req.user.role === 'patient' && String(req.user._id) !== id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const prescriptions = await Prescription.find({ patient: id })
      .populate('doctor', 'name email')
      .sort({ createdAt: -1 });

    res.json({ prescriptions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getDoctorPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ doctor: req.user._id })
      .populate('patient', 'name email')
      .sort({ createdAt: -1 });
    res.json({ prescriptions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createMedicalRecord,
  updateMedicalRecord,
  getPatientRecords,
  createPrescription,
  getPatientPrescriptions,
  getDoctorPrescriptions,
};

