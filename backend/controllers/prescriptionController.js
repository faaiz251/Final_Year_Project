// const Prescription = require('../models/Prescription');
// const mongoose = require('mongoose');

// /**
//  * Create Prescription
//  */
// exports.createPrescription = async (req, res) => {
//   try {
//     const { patientId, disease, medications, prescription } = req.body;

//     if (!disease) {
//       return res.status(400).json({ message: 'Disease is required' });
//     }

//     if (!medications || !Array.isArray(medications) || medications.length === 0) {
//       return res.status(400).json({ message: 'At least one medication required' });
//     }

//     // Only doctor can create
//     if (req.user.role !== 'doctor') {
//       return res.status(403).json({ message: 'Only doctors can create prescriptions' });
//     }

//     const newPrescription = await Prescription.create({
//       patient: patientId,
//       doctor: req.user.id,
//       disease,
//       medications,
//       prescription,
//       issuedDate: new Date(),
//       status: 'active'
//     });

//     await newPrescription.populate([
//       { path: 'patient', select: 'name email' },
//       { path: 'doctor', select: 'name email specialization' }
//     ]);

//     res.status(201).json({
//       message: 'Prescription created',
//       prescription: newPrescription
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to create prescription' });
//   }
// };

// /**
//  * Get Patient Prescription History
//  */
// exports.getPatientPrescriptionHistory = async (req, res) => {
//   try {
//     const { patientId } = req.params;
//         console.log('Fetching disease-wise summary for patient:', patientId);


//     // Access control
//     const isPatient = patientId === req.user.id.toString() || req.user.id.toString() === patientId;
//         console.log('Is patient accessing:', isPatient);

//     const isAdmin = req.user.role === 'admin';

//     if (!isPatient) {
//       return res.status(403).json({ message: 'Not authorized' });
//     }

//     const prescriptions = await Prescription.find({ patient: patientId })
//       .populate('doctor', 'name email specialization')
//       .sort({ issuedDate: -1 });

//     res.json({
//       total: prescriptions.length,
//       prescriptions
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch prescriptions' });
//   }
// };

// /**
//  * Get Disease-wise Prescription Summary
//  */
// exports.getDiseaseWiseSummary = async (req, res) => {
//   try {
//     const { patientId } = req.params;
//     console.log('Fetching disease-wise summary for patient:', patientId);

//     // Access control
//     const isPatient = patientId === req.user.id.toString() || req.user.id.toString() === patientId;
//     console.log('Is patient accessing:', isPatient);
//     const isAdmin = req.user.role === 'admin';

//     if (!isPatient) {
//       return res.status(403).json({ message: 'Not authorized' });
//     }

//     // Aggregation: group by disease, count, and get dates
//     const summary = await Prescription.aggregate([
//       { $match: { patient: mongoose.Types.ObjectId(patientId) } },
//       {
//         $group: {
//           id: '$disease',
//           count: { $sum: 1 },
//           lastPrescribed: { $max: '$issuedDate' },
//           firstPrescribed: { $min: '$issuedDate' },
//           doctors: { $push: '$doctor' }
//         }
//       },
//       { $sort: { lastPrescribed: -1 } }
//     ]);

//     res.json({
//       total: summary.length,
//       diseaseWiseSummary: summary
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch disease summary' });
//   }
// };

// /**
//  * Get All Prescriptions for a Specific Disease
//  */
// exports.getPrescriptionsByDisease = async (req, res) => {
//   try {
//     const { patientId, disease } = req.params;
//         console.log('Fetching disease-wise summary for patient:', patientId);


//     // Access control
//     const isPatient = patientId === req.user.id.toString() || req.user.id.toString() === patientId;
//         console.log('Is patient accessing:', isPatient);

//     const isAdmin = req.user.role === 'admin';

//     if (!isPatient && !isAdmin) {
//       return res.status(403).json({ message: 'Not authorized' });
//     }

//     const prescriptions = await Prescription.find({
//       patient: patientId,
//       disease: disease
//     })
//       .populate('doctor', 'name email specialization')
//       .sort({ issuedDate: -1 });

//     res.json({
//       disease,
//       total: prescriptions.length,
//       prescriptions
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch prescriptions' });
//   }
// };

const Prescription = require('../models/Prescription');
const mongoose = require('mongoose');

/**
 * Create Prescription (Doctor Only)
 */
exports.createPrescription = async (req, res) => {
  try {
    const { patientId, disease, medications, prescription } = req.body;

    if (!patientId) {
      return res.status(400).json({ message: 'Patient ID is required' });
    }

    if (!disease) {
      return res.status(400).json({ message: 'Disease is required' });
    }

    if (!Array.isArray(medications) || medications.length === 0) {
      return res.status(400).json({
        message: 'At least one medication is required',
      });
    }

    // Only doctor allowed
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        message: 'Only doctors can create prescriptions',
      });
    }

    const newPrescription = await Prescription.create({
      patient: patientId,
      doctor: req.user.id,
      disease,
      medications,
      prescription,
      issuedDate: new Date(),
      status: 'active',
    });

    await newPrescription.populate([
      { path: 'patient', select: 'name email' },
      { path: 'doctor', select: 'name email specialization' },
    ]);

    res.status(201).json({
      message: 'Prescription created successfully',
      prescription: newPrescription,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create prescription' });
  }
};

/**
 * Get Patient Prescription History
 */
exports.getPatientPrescriptionHistory = async (req, res) => {
  try {
    const { patientId } = req.params;

    // 🔥 FIX: null check
    if (!patientId || patientId === 'null') {
      return res.status(400).json({ message: 'Invalid patient ID' });
    }

    // Access control
    const isPatient = patientId === req.user.id.toString();
    const isAdmin = req.user.role === 'admin';
    const isDoctor = req.user.role === 'doctor';

    if (!isPatient && !isAdmin && !isDoctor) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const prescriptions = await Prescription.find({ patient: patientId })
      .populate('doctor', 'name email specialization')
      .sort({ issuedDate: -1 });

    res.json({
      total: prescriptions.length,
      prescriptions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch prescriptions' });
  }
};

/**
 * Get Disease-wise Summary
 */
exports.getDiseaseWiseSummary = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!patientId || patientId === 'null') {
      return res.status(400).json({ message: 'Invalid patient ID' });
    }

    const isPatient = patientId === req.user.id.toString();
    const isAdmin = req.user.role === 'admin';
    const isDoctor = req.user.role === 'doctor';

    if (!isPatient && !isAdmin && !isDoctor) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const summary = await Prescription.aggregate([
      {
        $match: {
          patient: new mongoose.Types.ObjectId(patientId),
        },
      },
      {
        $group: {
          id: '$disease',
          count: { $sum: 1 },
          lastPrescribed: { $max: '$issuedDate' },
          firstPrescribed: { $min: '$issuedDate' },
        },
      },
      { $sort: { lastPrescribed: -1 } },
    ]);

    res.json({
      total: summary.length,
      diseaseWiseSummary: summary,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch disease summary' });
  }
};

/**
 * Get Prescriptions by Disease
 */
exports.getPrescriptionsByDisease = async (req, res) => {
  try {
    const { patientId, disease } = req.params;

    if (!patientId || patientId === 'null') {
      return res.status(400).json({ message: 'Invalid patient ID' });
    }

    const isPatient = patientId === req.user.id.toString();
    const isAdmin = req.user.role === 'admin';
    const isDoctor = req.user.role === 'doctor';

    if (!isPatient && !isAdmin && !isDoctor) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const prescriptions = await Prescription.find({
      patient: patientId,
      disease,
    })
      .populate('doctor', 'name email specialization')
      .sort({ issuedDate: -1 });

    res.json({
      disease,
      total: prescriptions.length,
      prescriptions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch prescriptions' });
  }
};


