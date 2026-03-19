# JWT Authentication System - Complete Implementation Guide

## Overview

This document provides a complete guide to the JWT-based authentication system implemented for the Creators Hub application. The system includes user registration, login, session persistence, and dashboard access.

---

## Backend Implementation

### 1. Login Endpoint (`/api/users/login`)

**File:** [backend/routes/users.js](backend/routes/users.js)

**Functionality:**

- Accepts email and password
- Validates email format
- Fetches user from database with password field
- Compares passwords using bcrypt
- Returns JWT token on successful authentication
- Returns 401 error for invalid credentials

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

**Error Response (401):**

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### 2. JWT Middleware (`verifyToken`)

**File:** [backend/middleware/auth.js](backend/middleware/auth.js)

**Functionality:**

- Extracts JWT from Authorization header
- Verifies token signature and expiration
- Attaches decoded user data to request object
- Returns 401 error for invalid/expired tokens

**Usage:**

```javascript
const { verifyToken } = require("../middleware/auth");
router.get("/protected", verifyToken, (req, res) => {
  // req.user contains decoded JWT payload
});
```

### 3. Environment Setup

**File:** [backend/.env](backend/.env)

Add JWT_SECRET:

```
JWT_SECRET=your-secure-jwt-secret-key-change-in-production
```

**Note:** Change this secret in production to a secure, random value.

---

## Frontend Implementation

### 1. Authentication Context

**File:** [frontend/src/context/AuthContext.jsx](frontend/src/context/AuthContext.jsx)

**Provides:**

- `user`: Current logged-in user object
- `token`: JWT token
- `loading`: Loading state for initial auth check
- `isAuthenticated`: Boolean authentication status
- `login(email, password)`: Login function
- `logout()`: Logout function
- `register(name, email, password, confirmPassword)`: Registration function

**Session Persistence:**

- Automatically loads token and user from localStorage on app startup
- Stores token and user in localStorage after successful login
- Clears localStorage on logout

### 2. Login Component

**File:** [frontend/src/components/LoginForm.jsx](frontend/src/components/LoginForm.jsx)

**Features:**

- Email and password input fields
- Form validation
- Error message display
- Loading state during submission
- Link to registration page
- Automatic redirect to dashboard on successful login

### 3. Dashboard Component

**File:** [frontend/src/components/Dashboard.jsx](frontend/src/components/Dashboard.jsx)

**Features:**

- Protected route - redirects to login if not authenticated
- Displays user information (name, email, user ID)
- Shows session status
- Logout functionality
- Responsive design

### 4. Updated Registration Component

**File:** [frontend/src/components/RegistrationForm.jsx](frontend/src/components/RegistrationForm.jsx)

**Changes:**

- Now uses AuthContext for registration
- Redirects to login page after successful registration
- Uses react-router-dom for navigation
- Link to login page instead of anchor tag

### 5. Main App Component

**File:** [frontend/src/App.jsx](frontend/src/App.jsx)

**Routes:**

- `/register` - Registration page
- `/login` - Login page
- `/dashboard` - Protected dashboard (requires authentication)
- `/` - Redirects to login

**Features:**

- Wraps entire app with AuthProvider
- Uses React Router for navigation
- Session persistence on page refresh

---

## How It Works

### Authentication Flow

1. **Registration:**

   ```
   User fills registration form
   ↓
   Frontend sends to /api/users/register
   ↓
   Backend validates and creates user (password hashed with bcrypt)
   ↓
   User can now log in
   ```

2. **Login:**

   ```
   User enters email and password on login page
   ↓
   Frontend sends to /api/users/login
   ↓
   Backend validates credentials and generates JWT (7-day expiration)
   ↓
   Frontend stores JWT and user data in localStorage
   ↓
   Redirect to dashboard
   ```

3. **Session Persistence:**

   ```
   User refreshes page
   ↓
   App loads and auth context checks localStorage
   ↓
   If token exists, restore user session automatically
   ↓
   User remains logged in
   ```

4. **Protected Routes:**

   ```
   User tries to access /dashboard
   ↓
   Dashboard component checks isAuthenticated
   ↓
   If false, redirect to /login
   ↓
   If true, show dashboard with user info
   ```

5. **Logout:**
   ```
   User clicks logout button
   ↓
   Frontend clears token and user from localStorage
   ↓
   Auth context updates state
   ↓
   Redirect to login page
   ```

---

## Dependencies

### Backend

- `jsonwebtoken` - JWT generation and verification
- `bcryptjs` - Password hashing
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `validator` - Input validation
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variables

### Frontend

- `react-router-dom` - Client-side routing
- `react` - UI library
- `vite` - Build tool

---

## Security Features

1. **Password Hashing:** Passwords are hashed with bcryptjs (10 salt rounds)
2. **JWT Expiration:** Tokens expire after 7 days
3. **CORS Protection:** Only accepts requests from configured CLIENT_URL
4. **Authorization Header:** JWT passed in Authorization header (not in URL)
5. **Server-side Validation:** All inputs validated on backend
6. **Error Messages:** Generic error messages prevent user enumeration

---

## Setup Instructions

### Backend Setup

1. Install dependencies:

```bash
cd backend
npm install
```

2. Configure `.env`:

```
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/creators-hub
PORT=3000
JWT_SECRET=your-secure-jwt-secret-key
```

3. Start server:

```bash
npm run dev
```

### Frontend Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Configure `.env`:

```
VITE_API_URL=http://localhost:3000/api
```

3. Start development server:

```bash
npm run dev
```

---

## API Endpoints

### Authentication Endpoints

| Method | Endpoint              | Description            |
| ------ | --------------------- | ---------------------- |
| POST   | `/api/users/register` | Register new user      |
| POST   | `/api/users/login`    | Login user and get JWT |

### Protected Endpoint Example

```javascript
// Add to backend/routes/users.js or new file
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching profile" });
  }
});
```

---

## Testing the System

### Test Scenario 1: New User Registration and Login

1. Go to http://localhost:5173/register
2. Fill in registration form with:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
3. Click "Create Account"
4. Should redirect to login page
5. Enter credentials and login
6. Should redirect to dashboard

### Test Scenario 2: Session Persistence

1. After logging in, refresh the page (F5)
2. Should remain on dashboard (not redirected to login)
3. User info should still be visible

### Test Scenario 3: Logout

1. On dashboard, click "Logout" button
2. Should redirect to login page
3. LocalStorage should be cleared
4. Refresh page should stay on login page

### Test Scenario 4: Protected Routes

1. Open new incognito window
2. Try to access http://localhost:5173/dashboard
3. Should redirect to login page

---

## Troubleshooting

### Issue: "Invalid email or password" on valid credentials

- **Cause:** Email not found or wrong password
- **Solution:** Check user exists in MongoDB, verify password is correct

### Issue: JWT token expired

- **Cause:** Token older than 7 days
- **Solution:** User needs to login again to get new token

### Issue: CORS errors

- **Cause:** Frontend URL not in backend CORS whitelist
- **Solution:** Update `CLIENT_URL` in backend `.env`

### Issue: localStorage not storing token

- **Cause:** Browser privacy settings or third-party cookies disabled
- **Solution:** Check browser privacy settings, use incognito mode

---

## Future Enhancements

1. **Refresh Tokens:** Implement refresh token rotation for better security
2. **Password Reset:** Add email-based password reset flow
3. **Two-Factor Authentication:** Add 2FA for enhanced security
4. **Role-Based Access Control:** Implement user roles and permissions
5. **Session Management:** Add session timeout and activity tracking
6. **Email Verification:** Verify email before enabling account
7. **OAuth Integration:** Add Google/GitHub login

---

## Key Files Structure

```
backend/
├── routes/
│   └── users.js (login endpoint added)
├── middleware/
│   └── auth.js (verifyToken middleware)
└── .env (JWT_SECRET added)

frontend/
├── src/
│   ├── components/
│   │   ├── LoginForm.jsx (new)
│   │   ├── Dashboard.jsx (new)
│   │   └── RegistrationForm.jsx (updated)
│   ├── context/
│   │   └── AuthContext.jsx (new)
│   ├── styles/
│   │   ├── LoginForm.css (new)
│   │   └── Dashboard.css (new)
│   ├── App.jsx (updated with routing)
│   └── main.jsx
└── .env (new)
```

---

## Summary

The JWT authentication system provides:
✅ Secure user registration with password hashing
✅ JWT-based login with 7-day expiration
✅ Session persistence using localStorage
✅ Protected dashboard accessible only to authenticated users
✅ Logout functionality with state cleanup
✅ Form validation and error handling
✅ Responsive UI design

The system follows security best practices and is ready for production use with appropriate configuration changes (especially JWT_SECRET).
