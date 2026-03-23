require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare_management_fyp';

const createAdminUser = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('Admin user already exists');
      mongoose.disconnect();
      return;
    }

    // Create new admin
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin1234', salt);

    const admin = await User.create({
      name: 'Administrator',
      email: 'admin@gmail.com',
      passwordHash,
      role: 'admin',
      status: 'active',
    });

    console.log('✅ Admin user created successfully');
    console.log('Email: admin@gmail.com');
    console.log('Password: admin1234');

    mongoose.disconnect();
  } catch (err) {
    console.error('Error creating admin user:', err.message);
    mongoose.disconnect();
    process.exit(1);
  }
};

createAdminUser();
