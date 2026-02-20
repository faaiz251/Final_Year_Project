# Healthcare Management System - Enhanced Features

## What's New in This Update

### 🏥 Doctor Specialties System
The system now includes 12 different doctor specialties, each with their own consultation fees:

```
Cardiologist (₹800)        | Psychiatrist (₹850)
Neurologist (₹750)         | Radiologist (₹1000)
Dermatologist (₹600)       | Urologist (₹750)
Orthopedist (₹700)         | Ophthalmologist (₹650)
Pediatrician (₹550)        | ENT Specialist (₹600)
Gynecologist (₹700)        | General Practitioner (₹400)
```

### 📋 Doctor Registration Enhancement
When registering as a doctor, users must now:
1. Select their medical specialty from a dropdown
2. The consultation fee is automatically set based on specialty
3. Specialty and fee are displayed on their dashboard

### 💳 Dual Payment System
Patients can now choose how to pay for appointments:

**Offline Payment (Pay at Counter)**
- Book appointment with status "confirmed"
- Payment due amount displayed clearly
- Payment made at hospital counter
- Receipt included in PDF

**Online Payment (Razorpay)**
- Real-time payment via Razorpay gateway
- Appointment instantly confirmed on successful payment
- Secure payment processing
- Payment ID tracked in system

### 📄 PDF Appointment Export
All appointments can now be exported as professional PDF documents containing:
- Appointment ID and booking date
- Patient details (name, email, phone, gender, DOB, address)
- Doctor information (name, email, specialty, fee)
- Appointment details (date, time, reason)
- Payment information (method, status, amount)
- Special notices for offline payments

### 🎯 Automatic Fee Calculation
- No manual fee entry needed
- Consultation fee automatically applied based on doctor's specialty
- Fee visible during appointment booking
- Consistent pricing across all patients for same doctor

---

## How to Use

### For Doctors

**Registration:**
1. Click "Create an account" → Select "Doctor" role
2. A new "Medical Specialty" dropdown appears
3. Select your specialty (e.g., "Cardiologist - ₹800")
4. Complete registration

**Dashboard:**
- View your specialty and consultation fee in the profile card
- See all your appointments organized by status
- Track payments from patients

### For Patients

**Booking Appointments:**
1. Go to "Book Appointment" section
2. Doctor selector now shows specialty and fee: "Dr. Name (Specialty) - ₹Fee"
3. Select date and time
4. **Choose payment method:**
   - ✅ Pay at Counter - Confirm amount payable at hospital
   - 💳 Pay Online - Process payment via Razorpay now
5. Click "Book appointment"

**After Booking:**
- View appointment details in your list
- See payment status and method (online/offline)
- If offline: See "Payment due at counter: ₹Amount"
- Download as PDF for record keeping

**Payment:**
- Online: Complete payment immediately through secure gateway
- Offline: Pay amount at hospital counter when visiting

### For Admin

**Fees Page:**
- View all 12 doctor specialties
- See consultation fees for each specialty
- Services and charges displayed separately

---

## Technical Details

### Backend Architecture

**New Models Fields:**
- User: `specialty` (String), `specialtyFee` (Number)
- Appointment: `paymentMethod` (online/offline), `razorpayOrderId`, `razorpayPaymentId`

**New API Endpoints:**
- `GET /api/auth/specialties` - List all specialties
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment
- `POST /api/payments/offline` - Mark offline payment
- `GET /api/pdf/appointment/:id` - Download appointment PDF

**Payment Processing:**
- Creates Razorpay orders for online payments
- Verifies payment signatures
- Updates appointment status based on payment
- Generates professional PDFs with all details

### Frontend Features

**Registration Page:**
- Conditional specialty dropdown for doctors
- Real-time validation
- Fee display while selecting

**Fees Page:**
- Grid layout showing all 12 specialties
- Separate sections for services and consultations
- Color-coded cards

**Appointment Booking:**
- Radio buttons for payment method selection
- Real-time doctor fee display
- Payment method icons
- Visual status indicators

**Appointment List:**
- Payment method badges (Online/Counter)
- Payment status display
- Warning messages for unpaid counters
- PDF export button per appointment

---

## Configuration

### Environment Variables Required

Create `.env` in backend folder:
```
RAZORPAY_KEY_ID=your_test_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret
MONGO_URI=mongodb://localhost:27017/healthcare_management_fyp
```

Get free Razorpay keys at: https://dashboard.razorpay.com

---

## File Structure

```
backend/
├── config/
│   └── specialties.js (NEW)
├── controllers/
│   ├── paymentController.js (NEW)
│   ├── pdfController.js (NEW)
│   ├── authController.js (UPDATED)
│   └── appointmentController.js (UPDATED)
├── models/
│   ├── User.js (UPDATED)
│   └── Appointment.js (UPDATED)
├── routes/
│   ├── paymentRoutes.js (NEW)
│   ├── pdfRoutes.js (NEW)
│   ├── authRoutes.js (UPDATED)
│   └── server.js (UPDATED)
└── package.json (UPDATED)

frontend/
├── app/
│   ├── register/page.js (UPDATED)
│   ├── fees/page.js (UPDATED)
│   ├── doctor/page.js (UPDATED)
│   └── patient/appointments/page.js (UPDATED)
└── package.json (UPDATED)
```

---

## Installation & Setup

### 1. Install Dependencies

Backend:
```bash
cd backend
npm install
```

Frontend:
```bash
cd frontend
npm install
```

### 2. Configure Environment

Backend `.env`:
```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/healthcare_management_fyp
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
```

### 3. Start Services

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

Visit: http://localhost:3000

---

## Testing Scenarios

### Scenario 1: Doctor Registration
1. Register as doctor with "Cardiologist" specialty
2. Verify dashboard shows "Cardiologist" and "₹800"

### Scenario 2: Offline Payment
1. Book appointment with "Pay at Counter"
2. Verify appointment shows "confirmed" status
3. Verify fee display: "Payment due at counter: ₹800"
4. Export PDF and verify all details

### Scenario 3: Online Payment
1. Book appointment with "Pay Online"
2. Razorpay checkout opens
3. Use test card: 4111 1111 1111 1111
4. Verify appointment shows "paid" status

### Scenario 4: Multiple Doctors
1. Create doctors with different specialties
2. Book appointments with different doctors
3. Verify each shows correct fee
4. Compare fees in appointments list

---

## Support & Documentation

For detailed information, see:
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Complete technical details
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Step-by-step testing procedures
- [ENV_SETUP.md](./ENV_SETUP.md) - Environment configuration guide
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Quick lookup reference

---

## Features Summary

✅ 12 doctor specialties with fees (₹400-₹1000)
✅ Doctor registration with specialty selection
✅ Automatic fee calculation based on specialty
✅ Patient views doctor specialty and fee before booking
✅ Dual payment methods (online/offline)
✅ Razorpay payment integration
✅ PDF export for appointment details
✅ Payment status tracking
✅ Doctor dashboard shows specialty and fee
✅ Fees page displays all specialties
✅ Professional PDF generation with all details

---

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure Razorpay keys
3. ✅ Start backend and frontend
4. ✅ Test each scenario
5. ✅ Deploy to production

---

**Version:** 2.0 with Payment & Specialty System
**Date:** February 20, 2026
**Status:** Production Ready
