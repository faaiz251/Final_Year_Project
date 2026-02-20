# Environment Configuration Guide

## Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/healthcare_management_fyp

# Razorpay Payment Gateway (for online payments)
RAZORPAY_KEY_ID=rzp_test_dummy
RAZORPAY_KEY_SECRET=dummy_secret

# JWT Secret (optional, if implementing JWT)
JWT_SECRET=your_secret_key_here
```

### Getting Razorpay Credentials

**For Testing (Test Mode):**
1. Go to https://dashboard.razorpay.com/signin
2. Create a free account
3. Go to Settings → API Keys
4. Use Test Mode keys (starts with `rzp_test_`)

**For Production (Live Mode):**
1. Complete KYC verification
2. Activate Live Mode
3. Use Live Mode keys (starts with `rzp_live_`)

### Razorpay Test Mode Card Details

Use these cards for testing:
- **Success**: 4111 1111 1111 1111
- **Fail**: 4111 1111 1111 1112
- Expiry: Any future date
- CVV: Any 3 digits

---

## Frontend Environment Variables

Create a `.env.local` file in the `frontend` directory (optional):

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Starting the Application

### Backend
```bash
cd backend
npm install
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:3000`

---

## Features Enabled by Environment

### With Test Razorpay Keys
- Online payment during appointment booking
- Full payment workflow testing
- Payment verification and status updates

### Without Razorpay Keys
- Offline payment method works fine
- Online payment option disabled or shows error
- Patients can still book with counter payment

---

## Troubleshooting

### "ECONNREFUSED" when connecting to MongoDB
- Ensure MongoDB is running locally or connection string is correct
- Default: `mongodb://localhost:27017/healthcare_management_fyp`

### Razorpay payment not loading
- Check if Razorpay key ID and secret are configured
- Verify test keys are being used (not production keys on test site)
- Check browser console for CORS errors

### PDF not downloading
- Ensure backend is running
- Check authentication token is valid
- Verify appointment ID exists

---

## Optional: Using MongoDB Atlas (Cloud)

If you don't have MongoDB locally:

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster (free tier available)
3. Create a database user
4. Get connection string
5. Update MONGO_URI in .env:

```bash
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/healthcare_management_fyp?retryWrites=true&w=majority
```

---

**Date:** February 20, 2026
**For:** Healthcare Management System Final Year Project
