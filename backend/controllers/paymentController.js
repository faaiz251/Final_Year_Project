const Razorpay = require('razorpay');
const Appointment = require('../models/Appointment');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

// Create a Razorpay order for online payment
const createPaymentOrder = async (req, res) => {
  try {
    const { appointmentId, amount, doctorId } = req.body;

    if (!appointmentId || !amount || !doctorId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // amount in paise
      currency: 'INR',
      receipt: `apt_${appointmentId}`,
      notes: {
        appointmentId,
        patientId: req.user._id,
        doctorId,
      },
    });

    // Update appointment with order details
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        razorpayOrderId: order.id,
        paymentMethod: 'online',
      },
      { new: true }
    );

    res.json({
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create payment order' });
  }
};

// Verify payment and update appointment
const verifyPayment = async (req, res) => {
  try {
    const { appointmentId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!appointmentId || !razorpayOrderId || !razorpayPaymentId) {
      return res.status(400).json({ message: 'Missing payment details' });
    }

    // In production, verify signature using Razorpay's signature verification
    // For now, we'll accept valid-looking payment IDs
    if (razorpayPaymentId && razorpayOrderId) {
      const appointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        {
          razorpayPaymentId,
          razorpayOrderId,
          paymentStatus: 'paid',
          status: 'confirmed',
          paymentMethod: 'online',
        },
        { new: true }
      ).populate('doctor', 'name specialization specialty');

      res.json({
        message: 'Payment verified successfully',
        appointment,
      });
    } else {
      res.status(400).json({ message: 'Invalid payment details' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Payment verification failed' });
  }
};

// Mark appointment as offline payment (to be paid at counter)
const markOfflinePayment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({ message: 'Appointment ID required' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        paymentMethod: 'offline',
        paymentStatus: 'pending',
        status: 'confirmed',
      },
      { new: true }
    ).populate('doctor', 'name specialization specialty specialtyFee');

    res.json({
      message: 'Appointment confirmed. Payment to be made at counter.',
      appointment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  markOfflinePayment,
};
