# 🧪 Complete Testing Guide - Advanced Features

## 🚀 Prerequisites

### 1. **Start Backend**
```bash
cd backend
npm start
```
Backend runs on `http://localhost:5000`

### 2. **Start Frontend**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:3000`

### 3. **Have Test Accounts Ready**
- ✅ Patient account (any email)
- ✅ Doctor account (any email)

---

## 📋 Test Scenarios

### **Scenario 1: Patient Books Appointment**

**Steps**:
1. Navigate to `http://localhost:3000`
2. **Login** as patient
3. Click **"My Appointments"** in sidebar or navigate to `/patient/appointments`
4. Fill out the appointment form:
   - Select a doctor from dropdown
   - Pick a date and time in the future
   - Enter reason (e.g., "Routine Checkup")
   - Select disease (e.g., "Diabetes")
   - Choose payment method
5. Click **"Book Appointment"**

**Expected Results**:
- ✅ Appointment appears in the list
- ✅ Status shows "SCHEDULED"
- ✅ Date and time are displayed correctly
- ✅ Toast notification confirms booking

---

### **Scenario 2: Doctor Views Appointments Dashboard**

**Steps**:
1. **Login** as doctor
2. Navigate to **Doctor Board** → **Appointments**
3. View the dashboard

**Expected Results**:
- ✅ Statistics cards show: upcoming count, completed count, total count
- ✅ Filter buttons work (Upcoming, Completed, Cancelled)
- ✅ Patient appointments list displays with:
  - Patient name
  - Patient email
  - Appointment date/time
  - Appointment reason
  - Disease
  - Department
- ✅ Cards show "No treatment plan yet" or "Active Treatment: [name]"
- ✅ Each appointment is clickable

---

### **Scenario 3: Complete Appointment (Doctor)**

**Steps**:
1. **Login** as doctor
2. Go to Appointments dashboard
3. Click on a scheduled appointment
4. At the top of the page, you should see appointment status
5. Look for a button to mark as completed (if exists in your system)
6. Mark appointment as **"Completed"**

**Expected Results**:
- ✅ Appointment status changes to "COMPLETED"
- ✅ Treatment section becomes available
- ✅ Toast confirms completion

---

### **Scenario 4: Doctor Starts Treatment Plan**

**Steps**:
1. Doctor clicks on a **completed** appointment detail
2. Scroll to **"Treatment Plan"** section
3. Doctor sees form with fields:
   - Treatment Name (e.g., "Diabetes Management")
   - Duration in Days (e.g., "30")
   - Notes (e.g., "Follow insulin injection protocol")
4. Fill in all fields
5. Click **"Start Treatment"**

**Expected Results**:
- ✅ Form submissions successfully
- ✅ Success toast appears
- ✅ Treatment details now display below the form
- ✅ Progress bar shows 0% (just started)
- ✅ Remaining days shows "30 days"

---

### **Scenario 5: Patient Views Treatment Progress**

**Steps**:
1. **Login** as patient
2. Navigate to **"My Treatments"** (or `/patient/treatments`)
3. View treatment dashboard

**Expected Results**:
- ✅ Treatment card displays:
  - Treatment name (e.g., "Diabetes Management")
  - Doctor name
  - Start date
  - End date
  - Status badge (green = active)
  - Remaining days (in green/yellow/red based on threshold)
  - Progress bar showing % complete
  - Treatment notes

**Remaining Days Colors**:
- 🟢 Green: >30 days
- 🟡 Yellow: 7-30 days
- 🔴 Red: <7 days

---

### **Scenario 6: Real-Time Chat Communication**

**Flow 1: Patient Initiates**
1. Patient opens appointment detail (`/patient/appointments/[id]`)
2. Scroll to **"Patient Communication"** section
3. Type a message: "Hello doctor, how am I progressing?"
4. Click **"Send"** or press Enter

**Expected Results**:
- ✅ Message appears in chat instantly
- ✅ Message shows in green (patient message)
- ✅ Timestamp shows relative time (e.g., "just now")
- ✅ Message text is visible

**Flow 2: Doctor Responds**
1. Doctor opens same appointment detail (`/doctor/appointments/[id]`)
2. Already sees patient message
3. Types response: "Your progress looks good! Keep following the treatment plan."
4. Sends message

**Expected Results**:
- ✅ Doctor message appears in blue (doctor message)
- ✅ Patient's page auto-refreshes message list (3-second polling)
- ✅ Patient sees doctor's message within 3 seconds
- ✅ Messages are in chronological order

**Flow 3: Read Receipts**
1. Patient views the message in chat
2. Doctor's message should show read indicator

**Expected Results**:
- ✅ Message shows "✓✓ Read" or similar indicator
- ✅ Timestamp of when read is logged

---

### **Scenario 7: Doctor Creates Prescription**

**Steps**:
1. Doctor clicks on patient appointment detail
2. Scroll right sidebar to **"Prescriptions"** section
3. Click **"+ Add Prescription"** button
4. Fill in prescription form:
   - Disease: (auto-filled from appointment)
   - Medications (add multiple):
     - Medicine 1: Name, Dosage, Frequency
     - Medicine 2: Name, Dosage, Frequency
   - Notes/Instructions: "Take with food, follow for 30 days"
5. Click **"Save Prescription"**

**Expected Results**:
- ✅ Prescription added successfully
- ✅ Toast confirms creation
- ✅ New prescription appears in sidebar list
- ✅ Form resets
- ✅ Counter updates (Prescriptions (1))

**Example Medication Fill**:
```
Medicine 1:
- Name: Metformin
- Dosage: 500mg
- Frequency: 3x daily

Medicine 2:
- Name: Atorvastatin
- Dosage: 10mg
- Frequency: 1x daily at night
```

---

### **Scenario 8: Patient Views Prescriptions - Summary View**

**Steps**:
1. **Login** as patient
2. Navigate to **"My Prescriptions"** (or `/patient/prescriptions`)
3. View prescription dashboard (summary mode)

**Expected Results**:
- ✅ Disease aggregation cards displayed
- ✅ Each card shows:
  - Disease name (from appointment)
  - Prescription count (e.g., "1 prescription")
  - First prescribed date
  - Last prescribed date
- ✅ Cards are clickable

---

### **Scenario 9: Patient Views Prescriptions - Detail View**

**Steps**:
1. From prescription dashboard, **click on a disease card**
2. View expands to show detailed prescriptions

**Expected Results**:
- ✅ Back button visible
- ✅ Prescriptions for that disease listed
- ✅ Each prescription shows:
  - Medications table (Name, Dosage, Frequency)
  - Prescription text/notes
  - Doctor name
  - Date prescribed
  - Status badge
- ✅ Click "Back" returns to summary view

---

### **Scenario 10: Access Control - Patient Isolation**

**Steps**:
1. Have 2 patient accounts: Patient A, Patient B
2. Doctor creates appointment with Patient A only
3. Test Patient B cannot access Patient A's data

**Tests**:
- Patient B tries to visit `/patient/appointments/[PatientA_Appointment_ID]`
  - 🔴 Should get error or 403 forbidden
- Patient B tries to view Patient A's prescriptions
  - 🔴 Should only see own prescriptions
- Patient B tries to chat with Patient A's appointment
  - 🔴 Should get authorization error

**Expected Results**:
- ✅ API returns 403 Forbidden
- ✅ Frontend shows error message
- ✅ User cannot access other patient's data

---

### **Scenario 11: Treatment Duration Calculations**

**Steps**:
1. Doctor creates treatment with 30-day duration starting today
2. Wait and observe progress updates

**Day 0 (Today)**:
- ✅ Progress bar: ~0%
- ✅ Remaining: 30 days (green)

**Day 10**:
- ✅ Progress bar: ~33%
- ✅ Remaining: 20 days (green)

**Day 25**:
- ✅ Progress bar: ~83%
- ✅ Remaining: 5 days (red) - "Treatment ending soon" warning

**Day 30**:
- ✅ Cannot set treatment duration < 1 day
- ✅ Or treatment auto-completes

---

### **Scenario 12: Treatment Status Management**

**Steps**:
1. Doctor starts treatment
2. Patient sees active treatment
3. Doctor clicks **"Pause"** (if button exists)
4. Doctor clicks **"Complete"**

**Expected Results**:
- ✅ Status changes in real-time
- ✅ Patient view updates (might need page refresh)
- ✅ Progress bar reflects current status
- ✅ "Treatment ending soon" alert disappears when completed

---

### **Scenario 13: Error Handling - Chat Message Length**

**Steps**:
1. Patient tries to send message > 2000 characters
2. Frontend should validate before sending

**Expected Results**:
- ⚠️ Error message: "Message too long"
- ✅ Message not sent until shortened

---

### **Scenario 14: Empty States**

**Test Cases**:
1. Patient with no appointments → **"Book an appointment to get started"**
2. Doctor with no appointments → **"No upcoming appointments"**
3. Patient with no treatments → **"No active treatments"**
4. Patient with no prescriptions → **"No prescriptions yet"**
5. Appointment with no chat messages → **Empty chat area with input ready**

**Expected Results**:
- ✅ Proper empty state messages displayed
- ✅ Icons/illustrations shown
- ✅ Call-to-action buttons visible

---

## 🔧 **Manual API Testing** (Using CURL or Postman)

### **Create Chat Message**
```bash
curl -X POST http://localhost:5000/api/chats/[appointmentId]/messages \
  -H "Authorization: Bearer [token]" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello doctor"}'
```

### **Get Chat Messages**
```bash
curl http://localhost:5000/api/chats/[appointmentId]/messages \
  -H "Authorization: Bearer [token]"
```

### **Start Treatment**
```bash
curl -X POST http://localhost:5000/api/treatments/[appointmentId]/start \
  -H "Authorization: Bearer [token]" \
  -H "Content-Type: application/json" \
  -d '{
    "treatmentName": "Diabetes Management",
    "treatmentDurationDays": 30,
    "treatmentNotes": "Follow insulin protocol"
  }'
```

### **Get Treatment**
```bash
curl http://localhost:5000/api/treatments/[appointmentId] \
  -H "Authorization: Bearer [token]"
```

### **Create Prescription**
```bash
curl -X POST http://localhost:5000/api/prescriptions \
  -H "Authorization: Bearer [token]" \
  -H "Content-Type: application/json" \
  -d '{
    "patient": "[patientId]",
    "disease": "Diabetes",
    "medications": [{"name": "Metformin", "dosage": "500mg", "frequency": "3x daily"}],
    "prescriptionText": "Take with food"
  }'
```

---

## ✅ **Checklist - All Features Tested**

- [ ] Patient can book appointment
- [ ] Doctor sees appointment in dashboard
- [ ] Doctor can view appointment details
- [ ] Doctor can start treatment plan
- [ ] Remaining days calculated correctly
- [ ] Progress bar updates based on time
- [ ] Patient views treatment in treatments page
- [ ] Treatment progress bar visible to patient
- [ ] Patient and doctor can chat
- [ ] Chat messages persist on page refresh
- [ ] Read receipts work
- [ ] Doctor can create prescription
- [ ] Patient views prescriptions in summary mode
- [ ] Patient can click disease to see details
- [ ] Prescriptions show medications correctly
- [ ] Access control prevents unauthorized access
- [ ] Empty states display correctly
- [ ] Error messages show appropriately
- [ ] Toast notifications appear

---

## 🐛 **Debugging Tips**

### **Chat not updating?**
- Check browser console for errors
- Verify backend is running (`npm start`)
- Check polling interval in ChatComponent (set to 3 seconds)
- Open browser DevTools → Network tab to see API calls

### **Treatment not saving?**
- Verify appointment status is "completed" first
- Check that all required fields are filled
- Look for API error in backend console
- Check localStorage has valid JWT token

### **Prescriptions not showing?**
- Verify API endpoint `/prescriptions/patient/:patientId/history` works
- Check that prescriptions are created with correct data
- Clear browser cache if data looks stale
- Check MongoDB has prescription records

### **Access control not working?**
- Verify token includes user role
- Check middleware on backend is protecting routes
- Look at API response header (should be 403 if unauthorized)
- Test with different user roles

### **Styling issues?**
- Check TailwindCSS is compiled: `npm run build`
- Verify components import globals.css
- Check browser supports CSS Grid/Flexbox
- Try hard refresh (Ctrl+Shift+R on Windows)

---

## 📱 **Responsive Testing**

### **Mobile (375px)**
- [ ] All pages fit on mobile screen
- [ ] Buttons are touch-friendly (44px+)
- [ ] Text is readable (no zoom needed)
- [ ] Chat message input is accessible
- [ ] Cards stack vertically

### **Tablet (768px)**
- [ ] 2-column layouts work
- [ ] Sidebars collapse properly
- [ ] Tables are readable
- [ ] Forms are properly aligned

### **Desktop (1920px)**
- [ ] All features visible
- [ ] Multi-column layouts display correctly
- [ ] No horizontal scrolling

---

## 🎉 **Success Criteria**

All tests pass when:
1. ✅ Patient can complete full appointment booking → treatment → prescription flow
2. ✅ Doctor can manage all appointments with treatments and prescriptions
3. ✅ Real-time chat works without errors
4. ✅ Treatment progress displays accurately
5. ✅ All data persists across page refreshes
6. ✅ Access control prevents unauthorized access
7. ✅ Responsive design works on all devices
8. ✅ No console errors or warnings
9. ✅ Toast notifications appear for all major actions
10. ✅ Empty states handle missing data gracefully

---

## 📊 **Test Report Template**

```
Date: [Date]
Tester: [Name]
Environment: Windows/Mac/Linux

Feature: [Feature Name]
Status: PASS / FAIL / PARTIAL

Details:
- What was tested: 
- Expected result:
- Actual result:
- Issues found:

Screenshots/Video: [Link]
```

---

## 🚀 **Next Steps for QA**

1. Set up automated tests with Jest/React Testing Library
2. Create end-to-end tests with Cypress
3. Load testing (many concurrent appointments/messages)
4. Security testing (SQL injection, XSS attempts)
5. Browser compatibility testing (Chrome, Firefox, Safari)
6. Mobile app testing (iOS/Android)
7. Performance testing (page load times, API response times)

---

**Happy Testing! 🎉**
