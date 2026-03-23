require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const { DOCTOR_SPECIALTIES } = require('./config/specialties');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare_management_fyp';

const migrateSpecialtyFees = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all doctors without specialtyFee or with 0 specialtyFee
    const doctors = await User.find({
      role: 'doctor',
      $or: [
        { specialtyFee: { $exists: false } },
        { specialtyFee: 0 },
      ]
    });

    console.log(`Found ${doctors.length} doctors needing fee updates`);

    let updated = 0;
    for (const doctor of doctors) {
      // Get specialty fee from config
      const specialty = doctor.specialty || 'General Practitioner';
      const specialtyConfig = DOCTOR_SPECIALTIES.find(s => s.name === specialty);
      const newFee = specialtyConfig?.fee || 1000;

      // Update doctor
      await User.updateOne(
        { _id: doctor._id },
        { $set: { specialtyFee: newFee } }
      );

      console.log(`✓ Updated ${doctor.name} (${specialty}): ₹${newFee}`);
      updated++;
    }

    console.log(`\n✅ Successfully updated ${updated} doctors with specialty fees`);

    mongoose.disconnect();
  } catch (err) {
    console.error('Migration error:', err.message);
    mongoose.disconnect();
    process.exit(1);
  }
};

migrateSpecialtyFees();
