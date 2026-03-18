# User Registration System - Setup & Testing Guide

## Overview

This project implements a complete end-to-end user registration flow with a React frontend, Express backend, and MongoDB database.

## Project Structure

```
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   └── User.js              # User schema with validation
│   ├── routes/
│   │   └── users.js             # Registration API endpoint
│   ├── server.js                # Express server
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── RegistrationForm.jsx    # Registration form component
    │   ├── styles/
    │   │   └── RegistrationForm.css    # Form styling
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or Atlas connection string)
- npm or yarn package manager

## Setup Instructions

### 1. MongoDB Setup

**Option A: Local MongoDB**

- Install MongoDB Community Edition from https://www.mongodb.com/try/download/community
- Start MongoDB service (Windows: `mongod` command)

**Option B: MongoDB Atlas (Cloud)**

- Create free account at https://www.mongodb.com/cloud/atlas
- Create a cluster and get connection string
- Update `.env` file with your MongoDB URI

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies (if not already installed)
npm install

# Create/update .env file with:
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/creators-hub
PORT=3000

# Start the backend server
npm run dev
# Server runs on http://localhost:3000
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies (if not already installed)
npm install

# Start the frontend development server
npm run dev
# Frontend runs on http://localhost:5173
```

## Testing the Registration Flow

### Step 1: Open the Application

1. Open browser and go to `http://localhost:5173`
2. You should see the "Create Account" registration form

### Step 2: Test Validation

**Test Invalid Inputs:**

- Try submitting empty form - should show validation errors
- Enter a name with less than 3 characters - should show error
- Enter invalid email format - should show error
- Enter password less than 8 characters - should show error
- Enter mismatched passwords - should show error

**Test Valid Input:**

```
Name: John Doe
Email: john@example.com
Password: Test@1234
Confirm Password: Test@1234
```

### Step 3: Submit Registration

1. Fill all fields with valid data
2. Click "Create Account" button
3. Should see success message: "Welcome [Name]! Registration successful..."

### Step 4: Verify Database Storage

```bash
# Connect to MongoDB
mongosh
# or mongo (depending on version)

# Select database
use creators-hub

# View all users
db.users.find()

# View specific user
db.users.findOne({ email: "john@example.com" })
```

**Expected Output:**

```json
{
  "_id": ObjectId("..."),
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$10$...", // Hashed password (NOT plain text)
  "createdAt": ISODate("2024-01-01T12:00:00.000Z"),
  "updatedAt": ISODate("2024-01-01T12:00:00.000Z")
}
```

### Step 5: Test Error Scenarios

**Duplicate Email:**

- Try registering with same email again
- Should see error: "Email already registered"

**Backend Connection Error:**

- Stop the backend server
- Try to register
- Should see error: "An error occurred during registration"

## Frontend Features

### RegistrationForm Component

- **State Management:** Uses React `useState` hooks
- **Validation:** Real-time client-side validation
- **Error Handling:** Clear error messages for each field
- **Loading State:** Visual feedback during submission
- **Success State:** Confirmation message with user name
- **Responsive Design:** Works on mobile and desktop

### Validation Rules

1. **Name:** Required, minimum 3 characters
2. **Email:** Required, valid email format
3. **Password:** Required, minimum 8 characters
4. **Confirm Password:** Must match password field

## Backend Features

### POST /api/users/register Endpoint

**Request Body:**

```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "confirmPassword": "string"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "createdAt": "ISO8601 date"
  }
}
```

**Error Responses:**

- 400: Validation error (missing fields, invalid format, password mismatch)
- 409: Duplicate email (conflict)
- 500: Server error

## Security Features

### Password Security

- Password hashing using bcryptjs with salt rounds of 10
- Passwords are never returned in API responses
- Password field marked with `select: false` in MongoDB schema

### Input Validation

- Client-side validation prevents invalid submissions
- Server-side validation ensures data integrity
- Email format validation using validator library
- Password strength requirements

### CORS Protection

- CORS only allows requests from configured frontend URL
- Credentials are included in requests

## Troubleshooting

### Issue: "MongoDB connection error"

- **Solution:** Ensure MongoDB is running (`mongod` in terminal)
- Check MONGODB_URI in .env file is correct

### Issue: "Email already registered"

- **Solution:** Register with a different email address
- Or delete the user from MongoDB: `db.users.deleteOne({ email: "..." })`

### Issue: CORS errors

- **Solution:** Check CLIENT_URL in backend .env matches frontend URL
- Default: `http://localhost:5173` for Vite frontend

### Issue: "Cannot find module 'mongoose'"

- **Solution:** Run `npm install` in backend directory

### Issue: Form doesn't submit

- **Solution:** Open browser console (F12) to see error messages
- Check both frontend and backend console for detailed logs

## Database Verification Commands

```bash
# Connect to MongoDB
mongosh

# Show all databases
show dbs

# Use creators-hub database
use creators-hub

# Show all collections
show collections

# View all users
db.users.find().pretty()

# Count total users
db.users.countDocuments()

# View user details with password hash
db.users.findOne({ email: "john@example.com" })

# Verify password is hashed (should start with $2a$)
db.users.findOne({ email: "john@example.com" }).password

# Delete a user
db.users.deleteOne({ email: "john@example.com" })

# Drop entire collection
db.users.drop()
```

## API Testing with cURL

```bash
# Register a new user
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123"
  }'

# Expected success response:
# {"success":true,"message":"User registered successfully","user":{...}}
```

## Next Steps

1. Add login functionality
2. Implement JWT authentication
3. Add profile update feature
4. Create forgot password flow
5. Add email verification
6. Implement refresh tokens

## Important Files Summary

| File                                           | Purpose                       |
| ---------------------------------------------- | ----------------------------- |
| `backend/config/database.js`                   | MongoDB connection setup      |
| `backend/models/User.js`                       | User schema with validation   |
| `backend/routes/users.js`                      | Registration API endpoint     |
| `backend/server.js`                            | Express app config and routes |
| `frontend/src/components/RegistrationForm.jsx` | React form component          |
| `frontend/src/styles/RegistrationForm.css`     | Form styling                  |

---

**Documentation created:** 2024
**Version:** 1.0
