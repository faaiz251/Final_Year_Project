const PDFDocument = require('pdfkit');
const Appointment = require('../models/Appointment');

// Generate and download appointment details as PDF
const generateAppointmentPDF = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId)
      .populate('patient', 'name email phone gender dateOfBirth address')
      .populate('doctor', 'name email phone specialty specialtyFee');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Create a PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
    });

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="appointment_${appointmentId}.pdf"`
    );

    // Pipe document to response
    doc.pipe(res);

    // Title
    doc.fontSize(24).font('Helvetica-Bold').text('APPOINTMENT DETAILS', {
      align: 'center',
    });
    doc.moveDown(0.5);

    // Horizontal line
    doc.strokeColor('#cccccc').moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(0.5);

    // Appointment ID and Date
    doc.fontSize(12).font('Helvetica');
    doc.text(`Appointment ID: ${appointment._id}`, { continued: true });
    doc.text(`  |  Created: ${new Date(appointment.createdAt).toLocaleDateString()}`, {
      align: 'left',
    });
    doc.moveDown(0.3);

    // Status badge
    const statusColors = {
      pending: '#fbbf24',
      confirmed: '#10b981',
      completed: '#3b82f6',
      cancelled: '#ef4444',
    };
    const statusColor = statusColors[appointment.status] || '#6b7280';
    doc.fillColor(statusColor);
    doc.fontSize(10).text(`Status: ${appointment.status.toUpperCase()}`, {
      indent: 0,
    });
    doc.fillColor('#000000');
    doc.moveDown(0.5);

    // Patient Information Section
    doc.fontSize(13).font('Helvetica-Bold').text('PATIENT INFORMATION', {
      underline: true,
    });
    doc.moveDown(0.2);
    doc.fontSize(11).font('Helvetica');
    doc.text(`Name: ${appointment.patient.name}`);
    doc.text(`Email: ${appointment.patient.email}`);
    doc.text(`Phone: ${appointment.patient.phone || 'N/A'}`);
    doc.text(`Gender: ${appointment.patient.gender || 'N/A'}`);
    if (appointment.patient.dateOfBirth) {
      doc.text(`Date of Birth: ${new Date(appointment.patient.dateOfBirth).toLocaleDateString()}`);
    }
    if (appointment.patient.address) {
      doc.text(`Address: ${appointment.patient.address}`);
    }
    doc.moveDown(0.5);

    // Doctor Information Section
    doc.fontSize(13).font('Helvetica-Bold').text('DOCTOR INFORMATION', {
      underline: true,
    });
    doc.moveDown(0.2);
    doc.fontSize(11).font('Helvetica');
    doc.text(`Name: ${appointment.doctor.name}`);
    doc.text(`Email: ${appointment.doctor.email}`);
    doc.text(`Phone: ${appointment.doctor.phone || 'N/A'}`);
    doc.text(`Specialty: ${appointment.doctor.specialty || appointment.doctor.specialization || 'N/A'}`);
    doc.moveDown(0.5);

    // Appointment Details Section
    doc.fontSize(13).font('Helvetica-Bold').text('APPOINTMENT DETAILS', {
      underline: true,
    });
    doc.moveDown(0.2);
    doc.fontSize(11).font('Helvetica');
    doc.text(`Date: ${new Date(appointment.date).toLocaleDateString()}`);
    doc.text(`Time: ${appointment.time}`);
    doc.text(`Reason: ${appointment.reason || 'N/A'}`);
    doc.text(`Disease/Condition: ${appointment.disease || 'N/A'}`);
    if (appointment.notes) {
      doc.text(`Notes: ${appointment.notes}`);
    }
    doc.moveDown(0.5);

    // Payment Information Section
    doc.fontSize(13).font('Helvetica-Bold').text('PAYMENT INFORMATION', {
      underline: true,
    });
    doc.moveDown(0.2);
    doc.fontSize(11).font('Helvetica');
    doc.text(`Fee: ₹${appointment.fee}`);
    doc.text(`Payment Method: ${appointment.paymentMethod === 'online' ? 'Online (Razorpay)' : 'Offline (Counter)'}`);
    doc.text(`Payment Status: ${appointment.paymentStatus}`);
    if (appointment.paymentMethod === 'offline' && appointment.paymentStatus === 'pending') {
      doc.moveDown(0.2);
      doc.fontSize(10).fillColor('#dc2626');
      doc.text('⚠ Amount to be paid at counter: ₹' + appointment.fee, {
        align: 'left',
      });
      doc.fillColor('#000000');
    }
    doc.moveDown(0.5);

    // Footer
    doc.moveDown(1);
    doc.strokeColor('#cccccc').moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(0.3);
    doc.fontSize(9).fillColor('#666666');
    doc.text('This is an official appointment record from Healthcare Management System', {
      align: 'center',
    });
    doc.text(`Generated on: ${new Date().toLocaleString()}`, {
      align: 'center',
    });

    // Finalize the PDF
    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
};

module.exports = {
  generateAppointmentPDF,
};
