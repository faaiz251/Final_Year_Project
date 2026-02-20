# Testing Guide - Healthcare Management System

## Quick Start Testing

### 1. Doctor Registration with Specialty

#### Steps:
1. Go to `/register` page
2. Fill in details:
   - Name: "Dr. Rajesh Kumar"
   - Email: "rajesh@hospital.com"
   - Password: "password123"
   - Role: **Select "doctor"**
   - Medical Specialty: **Select "Cardiologist"** (₹800)
3. Click "Register"
4. You'll be redirected to login page

#### Expected Result:
- Doctor account created successfully
- Can login and see doctor dashboard
- Dashboard shows specialty "Cardiologist" and fee "₹800"

---

### 2. Patient Viewing Doctor Specialties & Fees

#### Steps:
1. Go to `/fees` page
2. Scroll down to see "Doctor Consultation Fees" section
3. View all 12 specialties with their fees

#### Expected Specialties:
- Cardiologist: ₹800
- Neurologist: ₹750
- Dermatologist: ₹600
- Orthopedist: ₹700
- Pediatrician: ₹550
- Gynecologist: ₹700
- Psychiatrist: ₹850
- Urologist: ₹750
- Ophthalmologist: ₹650
- ENT Specialist: ₹600
- General Practitioner: ₹400
- Radiologist: ₹1000

---

### 3. Booking Appointment with Offline Payment

#### Steps:
1. Login as patient
2. Go to `/patient/appointments`
3. Fill appointment form:
   - Doctor: Select "Dr. Rajesh Kumar (Cardiologist) - ₹800"
   - Date: Select future date
   - Time: Select any time
   - Reason: "Heart checkup" (optional)
4. **Payment Method: Select "Pay at Counter"**
5. Click "Book appointment"

#### Expected Result:
- Appointment created successfully
- Toast message: "Appointment booked! Payment to be made at counter."
- Appointment shows in list with:
  - Status badge: "confirmed"
  - Payment badge: "Counter"
  - Fee: ₹800
  - Message: "Payment due at counter: ₹800"

---

### 4. Exporting Appointment to PDF

#### Steps:
1. In appointment list, click **"Export as PDF"** button
2. Browser will download `appointment_[id].pdf` file

#### PDF Should Include:
- ✅ Appointment ID
- ✅ Patient name, email, phone, gender, DOB, address
- ✅ Doctor name, email, specialty
- ✅ Date and time
- ✅ Consultation fee
- ✅ Payment method (Online/Counter)
- ✅ Payment status
- ✅ Warning message for unpaid counter payments

---

### 5. Doctor Dashboard with Specialty

#### Steps:
1. Login as doctor
2. Go to `/doctor` dashboard
3. Look at top of page

#### Expected Display:
- Doctor profile card showing:
  - Name: "Dr. Rajesh Kumar"
  - Specialty: 🩺 Cardiologist
  - Consultation Fee: ₹800
- Quick stats below:
  - Today's Appointments
  - Total Appointments
  - Pending
  - Confirmed

---

### 6. Booking with Multiple Doctor Specialties

#### Steps:
1. Create 3 doctors with different specialties:
   - Dr. A: Neurologist (₹750)
   - Dr. B: Dermatologist (₹600)
   - Dr. C: Psychiatrist (₹850)
2. Book appointment with each
3. Compare fees in appointment list

#### Expected Result:
- Each appointment shows correct fee based on doctor's specialty
- Different doctors show different fees

---

### 7. Online Payment (Razorpay)

#### Prerequisites:
- Razorpay test keys configured in `.env`

#### Steps:
1. In appointment form, select **"Pay Online (Razorpay)"**
2. Fill other fields (doctor, date, time)
3. Click "Book appointment"
4. Razorpay checkout window opens
5. Use test card:
   - Card: 4111 1111 1111 1111
   - Expiry: 12/25
   - CVV: 123
6. Click Pay

#### Expected Result:
- Payment processed
- Toast: "Payment successful! Appointment confirmed."
- Appointment shows payment status: "paid"
- Badge shows "Online"

---

### 8. Testing Appointment List Features

#### Verify:
- ✅ Doctor name and specialty displayed
- ✅ Appointment date and time shown
- ✅ Payment method badge (Online/Counter)
- ✅ Status badge (pending/confirmed)
- ✅ Fee shown correctly
- ✅ Warning message for offline unpaid appointments
- ✅ PDF export button works
- ✅ List sorted by date (earliest first)

---

### 9. Doctor Dashboard Features

#### Verify:
- ✅ Doctor profile card with specialty and fee
- ✅ Statistics:
  - Today's appointments count
  - Total appointments count
  - Pending count
  - Confirmed count
- ✅ Doctor can see all their appointments
- ✅ Patient details displayed in appointments

---

### 10. Payment Status Workflow

#### Offline Payment Flow:
1. Book with offline payment → Status: confirmed, Payment: pending
2. Patient pays at counter
3. Staff updates payment status → Status: paid
4. PDF shows amount paid

#### Online Payment Flow:
1. Book with online payment → Status: pending (initially)
2. Razorpay payment → Status: confirmed, Payment: paid
3. PDF shows paid status

---

## Troubleshooting Test Scenarios

### Issue: "Specialty is required" error
- **Solution**: Make sure role is set to "doctor" in registration before specialty appears

### Issue: Doctor selector shows no doctors
- **Solution**: Create at least one doctor account first with registration

### Issue: Fee not showing in appointment
- **Solution**: Verify doctor was created with specialty field set

### Issue: PDF download doesn't work
- **Solution**: 
  - Check backend is running
  - Verify user is logged in
  - Check browser console for errors
  - Verify MongoDB has the appointment record

### Issue: Razorpay checkout not opening
- **Solution**:
  - Check if keys are configured in `.env`
  - Check browser console for errors
  - Verify script is loading from CDN
  - Try test keys, not live keys

---

## Test Data to Create

### Doctor Accounts to Create:
```
Dr. A - Cardiologist - ₹800
Dr. B - Neurologist - ₹750
Dr. C - Dermatologist - ₹600
Dr. D - Psychiatrist - ₹850
```

### Patient Accounts:
```
Patient 1 - patient1@hospital.com
Patient 2 - patient2@hospital.com
```

### Test Appointments:
- 1-2 appointments per doctor
- Mix of online and offline payments
- Various dates (today, tomorrow, next week)

---

## Success Criteria

- [ ] Doctor can register with specialty
- [ ] Doctor dashboard shows specialty and fee
- [ ] Fees page displays all 12 specialties
- [ ] Patient sees doctor with fee in selector
- [ ] Appointment created with correct fee
- [ ] Offline payment confirmation works
- [ ] Online payment (Razorpay) works
- [ ] PDF exports successfully
- [ ] Payment status displays correctly
- [ ] Multiple doctors with different fees work

---

**Date:** February 20, 2026
**Status:** Ready for Testing
