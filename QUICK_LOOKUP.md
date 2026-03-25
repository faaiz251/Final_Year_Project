# 🎯 Developer Quick Reference Card

## 🚀 **Start Commands**

```bash
# Backend
cd backend && npm start
# Runs on http://localhost:5000

# Frontend
cd frontend && npm run dev
# Runs on http://localhost:3000

# Build for production
cd frontend && npm run build && npm run start
```

---

## 📋 **Page Navigation Map**

### **Patient Routes**
```
/patient/appointments           - List & book appointments
/patient/appointments/[id]      - Appointment details (chat + treatment)
/patient/treatments             - View all active treatments
/patient/prescriptions          - View prescriptions by disease
/patient/profile                - Edit patient profile
/patient/records                - Medical records
```

### **Doctor Routes**
```
/doctor/appointments            - Dashboard of appointments
/doctor/appointments/[id]       - Manage appointment (treatment + prescription)
/doctor/attendance              - Attendance tracking
/doctor/patients                - List of patients
/doctor/prescriptions           - Issued prescriptions
```

### **Admin Routes**
```
/admin                          - Admin dashboard
/admin/users                    - Manage users
/admin/departments              - Manage departments
/admin/inventory                - Manage inventory
```

---

## 🧩 **Component Usage**

### **ChatComponent**
```jsx
import ChatComponent from '@/components/chat/ChatComponent';

<ChatComponent appointmentId={appointmentId} />
```

### **TreatmentSection**
```jsx
import TreatmentSection from '@/components/treatment/TreatmentSection';

<TreatmentSection 
  appointment={appointment} 
  onTreatmentUpdate={refreshFunction}
/>
```

### **PrescriptionHistory**
```jsx
import PrescriptionHistory from '@/components/prescription/PrescriptionHistory';

<PrescriptionHistory patientId={patientId} />
```

---

## 🔌 **API Calls Cheat Sheet**

### **Authentication**
```javascript
// Register
apiRequest('/auth/register', {
  method: 'POST',
  body: { name, email, password, role, phone }
})

// Login
apiRequest('/auth/login', {
  method: 'POST',
  body: { email, password }
})
```

### **Appointments**
```javascript
// Get my appointments
apiRequest('/appointments/my')

// Get all appointments (doctor/admin)
apiRequest('/appointments')

// Get appointment detail
apiRequest(`/appointments/${appointmentId}`)

// Book appointment
apiRequest('/appointments', {
  method: 'POST',
  body: { doctorId, appointmentDate, reason, disease }
})
```

### **Treatments**
```javascript
// Start treatment
apiRequest(`/treatments/${appointmentId}/start`, {
  method: 'POST',
  body: { treatmentName, treatmentDurationDays, treatmentNotes }
})

// Get treatment
apiRequest(`/treatments/${appointmentId}`)

// Update treatment status
apiRequest(`/treatments/${appointmentId}/status`, {
  method: 'PATCH',
  body: { treatmentStatus: 'active' | 'completed' | 'paused' }
})
```

### **Chat**
```javascript
// Send message
apiRequest(`/chats/${appointmentId}/messages`, {
  method: 'POST',
  body: { message: 'Hello' }
})

// Get messages
apiRequest(`/chats/${appointmentId}/messages?limit=20&page=1`)

// Mark as read
apiRequest(`/chats/${appointmentId}/messages/${messageId}/read`, {
  method: 'PATCH'
})

// Get unread count
apiRequest(`/chats/${appointmentId}/unread`)
```

### **Prescriptions**
```javascript
// Create prescription
apiRequest('/prescriptions', {
  method: 'POST',
  body: {
    patient: patientId,
    disease: 'Diabetes',
    medications: [
      { name: 'Metformin', dosage: '500mg', frequency: '3x daily' }
    ],
    prescriptionText: 'Take with food'
  }
})

// Get patient prescriptions
apiRequest(`/prescriptions/patient/${patientId}/history`)

// Get disease summary
apiRequest(`/prescriptions/patient/${patientId}/summary`)

// Get prescriptions by disease
apiRequest(`/prescriptions/patient/${patientId}/disease/Diabetes`)
```

---

## 🎨 **Element Styling**

### **Colors**
```javascript
// Primary
bg-blue-600 / text-blue-600

// Success/Active
bg-green-100 / text-green-700

// Warning/Paused
bg-yellow-100 / text-yellow-700

// Error/Completed
bg-red-100 / text-red-700

// Info
bg-gray-100 / text-gray-700
```

### **Common Classes**
```javascript
// Buttons
"px-4 py-2 rounded-lg font-semibold hover:opacity-90"

// Cards
"bg-white rounded-lg shadow-md p-6"

// Grids
"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

// Text
"text-sm text-gray-600" // small gray text
"text-lg font-semibold"  // larger bold text
```

---

## 💾 **State Management**

### **Authentication Context**
```javascript
import { useAuth } from '@/context/AuthContext';

const { user, userRole, login, logout } = useAuth();
```

### **Local Storage Keys**
```javascript
// Get token
const token = localStorage.getItem('token')

// Get user ID
const userId = localStorage.getItem('userId')

// Get user role
const userRole = localStorage.getItem('userRole')
```

---

## 🗂️ **File Locations**

```
📁 New Frontend Files Created:
  ✅ app/patient/treatments/page.js
  ✅ app/patient/appointments/[appointmentId]/page.js
  ✅ app/patient/prescriptions/page.js
  ✅ app/doctor/appointments/page.js
  ✅ app/doctor/appointments/[appointmentId]/page.js
  ✅ components/chat/ChatComponent.jsx
  ✅ components/treatment/TreatmentSection.jsx
  ✅ components/prescription/PrescriptionHistory.jsx

📁 Updated Files:
  ✅ lib/api.js (Added treatment, chat, prescription APIs)

📁 Backend Files (Previously Created):
  ✅ models/Chat.js
  ✅ controllers/treatmentController.js
  ✅ controllers/chatController.js
  ✅ controllers/prescriptionController.js
  ✅ routes/treatmentRoutes.js
  ✅ routes/chatRoutes.js
  ✅ routes/prescriptionRoutes.js (Extended)
```

---

## 🔍 **Debugging Checklist**

```
Chat Issues:
☐ Check backend console for errors
☐ Verify appointmentId is valid
☐ Check JWT token in localStorage
☐ Open DevTools → Network tab
☐ Look for 401/403 responses
☐ Check message length < 2000 chars

Treatment Issues:
☐ Verify appointment.isCompleted = true
☐ Check form validation passes
☐ Verify durationDays > 0
☐ Check API response in Network tab
☐ Check backend routes mounted correctly
☐ Look for MongoDB connection errors

Prescription Issues:
☐ Verify medications array not empty
☐ Check disease field populated
☐ Look for duplicate prescriptions
☐ Verify patient ID exists
☐ Check prescriptions aggregation query
☐ Clear browser cache if data stale

Access Control Issues:
☐ Check userRole in localStorage
☐ Verify JWT token valid
☐ Test with different user roles
☐ Check API returns 403 for unauthorized
☐ Look for middleware errors in console
☐ Verify role checks in controller
```

---

## 📊 **Database Queries (MongoDB)**

### **Common Queries**
```javascript
// All messages in appointment
db.chats.find({ appointment: ObjectId('...') })

// Treatments by status
db.appointments.find({ 'treatment.treatmentStatus': 'active' })

// Prescriptions by disease
db.prescriptions.find({ 
  patient: ObjectId('...'), 
  disease: 'Diabetes' 
})

// Unread messages count
db.chats.find({ 
  'messages.isRead': false, 
  'messages.sender': { $ne: ObjectId('...') }
})
```

---

## 🎯 **Common Tasks**

### **Add New Component**
1. Create file in `components/[category]/[ComponentName].jsx`
2. Add `'use client'` at top
3. Import hooks: `useState`, `useEffect`
4. Export default function
5. Import in page and use

### **Add New Page**
1. Create folder in `app/[role]/[feature]/`
2. Add `page.js` file
3. Add `'use client'` directive
4. Use `useParams()` for dynamic routes
5. Use `apiRequest()` for API calls

### **Add New API Call**
1. Add method to appropriate API object in `lib/api.js`
2. Use `apiRequest()` base function
3. Return `Promise`
4. Handle errors with `try-catch`

### **Debug API Response**
```javascript
try {
  const data = await apiRequest('/endpoint')
  console.log('Response:', data)
} catch (error) {
  console.log('Error:', error.message)
}
```

---

## 🧪 **Quick Test Commands**

```bash
# Check if backend running
curl http://localhost:5000/api/health

# Check if frontend running
curl http://localhost:3000

# Login and get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@test.com","password":"password"}'

# Test protected endpoint
curl http://localhost:5000/api/appointments \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📱 **Responsive Breakpoints**

```javascript
// Mobile first approach
// Default: mobile (< 640px)
// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px
// 2xl: 1536px

// Example:
"grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

---

## 🔐 **Authentication Flow**

```
1. User Register/Login
   ↓
2. Backend returns JWT token
   ↓
3. Frontend stores token in localStorage
   ↓
4. All API requests include Bearer token
   ↓
5. Backend validates token with middleware
   ↓
6. Route handler executes
   ↓
7. Response sent to frontend
```

---

## 📈 **Performance Tips**

### **Frontend**
- Use `React.memo()` for expensive components
- Implement image lazy loading
- Use dynamic imports for large components
- Debounce search/filter inputs
- Cache API responses where appropriate

### **Backend**
- Use indexes on frequently queried fields
- Limit database queries with `.limit()` and `.skip()`
- Use projections to select only needed fields
- Batch update operations when possible
- Implement caching for frequently accessed data

---

## 🚨 **Error Codes**

```
400 Bad Request      - Missing/invalid fields
401 Unauthorized     - No token or invalid token
403 Forbidden        - User doesn't have permission
404 Not Found        - Resource doesn't exist
500 Server Error     - Something went wrong on backend

Custom Messages:
"User not found"     - User ID doesn't exist
"Unauthorized user"  - Not the right doctor/patient
"Appointment not found" - Appointment ID doesn't exist
"Treatment already started" - Can't start again
```

---

## 📞 **Key Contacts**

```
Frontend Lead: [Your Name]
Backend Lead: [Your Name]
Database: MongoDB Atlas
Hosting: [Platform]
API Documentation: [Link]
```

---

## ✅ **Pre-Deployment Checklist**

- [ ] All `.env` variables configured
- [ ] Test login works
- [ ] Test appointment booking
- [ ] Test chat works
- [ ] Test treatment tracking
- [ ] Test prescriptions
- [ ] Test access control
- [ ] Run all tests: `npm test`
- [ ] Fix console errors
- [ ] Build frontend: `npm run build`
- [ ] Restart backend
- [ ] Test on production URL

---

**Last Updated**: 2024  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
