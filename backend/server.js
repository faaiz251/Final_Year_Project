require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Process-level handlers to log and exit gracefully on unexpected errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const medicalRoutes = require('./routes/medicalRoutes');
const staffRoutes = require('./routes/staffRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const feeRoutes = require('./routes/feeRoutes');

const app = express();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare_management_fyp';
const allowedOrigins = [
  "http://localhost:3000",
  "https://healthcare-management-system-vert.vercel.app"
];

// Core middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);
app.options("*", cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api', medicalRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/fees', feeRoutes);

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Healthcare Management API running' });
});

// Global error handler placeholder
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || 'Internal server error',
  });
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Remove legacy problematic indexes that may cause duplicate-null errors
    try {
      const db = mongoose.connection.db;
      const usersColl = db.collection('users');
      usersColl.indexes()
        .then((idxs) => {
          const legacyPhoneIdx = idxs.find((i) => i.name === 'phoneNumber_1');
          if (legacyPhoneIdx) {
            console.log('Dropping legacy index: phoneNumber_1');
            return usersColl.dropIndex('phoneNumber_1').catch((err) => {
              console.error('Failed to drop legacy index phoneNumber_1:', err.message || err);
            });
          }
        })
        .catch((err) => {
          // ignore index listing errors
          console.error('Could not list indexes for users collection:', err.message || err);
        });
    } catch (err) {
      console.error('Index cleanup error:', err.message || err);
    }
    // Try to listen, and if the port is in use, attempt the next available port
    const startServer = (port, attemptsLeft = 5) => {
      const server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });

      server.on('error', (err) => {
        if (err && err.code === 'EADDRINUSE') {
          console.error(`Port ${port} in use.`);
          if (attemptsLeft > 0) {
            const nextPort = port + 1;
            console.log(`Trying port ${nextPort}... (${attemptsLeft - 1} attempts left)`);
            setTimeout(() => startServer(nextPort, attemptsLeft - 1), 500);
          } else {
            console.error('No available ports found, exiting.');
            process.exit(1);
          }
        } else {
          console.error('Server error:', err);
          process.exit(1);
        }
      });
    };

    startServer(PORT);
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

// Global handlers to log unexpected errors without crashing silently
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

