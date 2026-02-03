# Healthcare Management System – Final Year Project

This is a full-stack Healthcare Management System built as a final year project.

- **Frontend**: Next.js (JavaScript), Tailwind CSS, shadcn-style UI components, lucide-react, react-icons, framer-motion, react-hot-toast  
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT authentication, role-based access control  

## Project structure

```text
final-year-project/
  backend/   # Node + Express REST API
  frontend/  # Next.js frontend
```

## Backend – setup & run

```bash
cd final-year-project/backend
npm install
cp .env.example .env      # edit values if needed
npm run dev               # or: npm start
```

Backend defaults:

- API base URL: `http://localhost:5000/api`
- MongoDB: `mongodb://localhost:27017/healthcare_management_fyp`

## Frontend – setup & run

```bash
cd final-year-project/frontend
npm install
npm run dev
```

Frontend dev server:

- URL: `http://localhost:3000`
- Configure backend base URL with `NEXT_PUBLIC_API_BASE_URL` if different from default.

## Core features

- **Authentication**
  - Email/password login (JWT)
  - Forgot / reset password flow
  - Role-based dashboards and route protection (Admin, Doctor, Patient, Staff)
- **Admin**
  - Dashboard metrics (doctors, patients, staff, appointments)
  - User management (create/list/delete users with roles)
  - Department management (CRUD)
  - Pharmacy / inventory management (CRUD)
- **Patient**
  - Dashboard with upcoming/recent appointments
  - Profile view/update
  - Book appointment (doctor selection, date/time, reason)
  - View appointments with statuses
- **Doctor**
  - Dashboard with appointments count
  - Attendance marking (present/absent)
  - View assigned patients
  - E-prescribing (create prescriptions saved in MongoDB)
- **Staff**
  - Dashboard with department info
  - View schedule

## Important API endpoints (examples)

Backend routes are all under `/api`:

- Auth: `/api/auth/login`, `/api/auth/forgot-password`, `/api/auth/reset-password`, `/api/auth/me`
- Users: `/api/users/profile`, `/api/users/doctors`
- Admin: `/api/admin/summary`, `/api/admin/users`, `/api/admin/departments`, `/api/admin/inventory`
- Appointments: `/api/appointments` (POST), `/api/appointments/my`, `/api/appointments/doctor`
- Medical: `/api/records/patient/:id`, `/api/prescriptions`, `/api/prescriptions/patient/:id`, `/api/prescriptions/doctor/me`
- Staff: `/api/staff/me`
- Doctor: `/api/doctor/attendance`

## Manual test checklist (high level)

- **Auth**
  - Register or create users via admin.
  - Login as admin / doctor / patient / staff.
  - Verify each role lands on its own dashboard.
- **Admin flows**
  - Create doctor, patient, and staff users.
  - Create departments and inventory items.
  - Confirm dashboard summary cards update.
- **Patient flows**
  - Update profile.
  - Book an appointment and see it listed with status.
  - Verify success toast and status values.
- **Doctor flows**
  - Mark attendance present/absent.
  - View assigned patients from appointments.
  - Create prescriptions and see them listed.
- **Staff flows**
  - View staff dashboard and schedule (once assigned via admin/staff APIs).

