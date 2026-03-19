# Quick Start Guide - JWT Authentication System

## Getting Started

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Step 3: Start Backend Server

```bash
cd backend
npm run dev
# Runs on http://localhost:3000
```

### Step 4: Start Frontend Development Server

_In a new terminal:_

```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

### Step 5: Open Your Browser

Navigate to: **http://localhost:5173**

---

## Quick Test Flow

### Test 1: Register a New User

1. Click "Sign up here" on login page OR go to: `/register`
2. Fill in the form:
   - **Name:** John Doe
   - **Email:** john@example.com
   - **Password:** SecurePass123
   - **Confirm Password:** SecurePass123
3. Click "Create Account"
4. You'll see success message and auto-redirect to login

### Test 2: Login with Your Credentials

1. Enter email: john@example.com
2. Enter password: SecurePass123
3. Click "Login"
4. You should see the Dashboard with your user info

### Test 3: Session Persistence

1. On dashboard, refresh the page (F5 or Ctrl+R)
2. You should STAY on dashboard (not redirected to login)
3. Your user information should be visible

### Test 4: Logout

1. Click the "Logout" button in top-right
2. You should be redirected to login page
3. Refresh page - should still be on login page

### Test 5: Protected Route

1. Open NEW incognito/private window
2. Go to: http://localhost:5173/dashboard
3. You should be redirected to login page

---

## What Was Implemented

### ✅ Backend (Node.js/Express)

1. **Login Endpoint** - `/api/users/login`
   - Validates credentials
   - Generates JWT token (7-day expiration)
   - Returns user data and token

2. **JWT Middleware** - `middleware/auth.js`
   - Verifies JWT tokens
   - Protects routes
   - Handles token expiration

3. **Database Integration**
   - Uses existing User model with bcrypt password verification

### ✅ Frontend (React/Vite)

1. **Authentication Context** - Manages global auth state
   - Login/logout functions
   - Session persistence
   - User data storage

2. **Login Page** - Complete login form with:
   - Email and password inputs
   - Form validation
   - Error handling
   - Loading states

3. **Dashboard Page** - Protected route with:
   - User information display
   - Session status
   - Logout button
   - Auto-redirect if not authenticated

4. **Updated Registration** - Now integrates with auth system
   - Uses context for API calls
   - Redirects to login after success

5. **App Routing** - React Router setup
   - `/register` - Registration page
   - `/login` - Login page
   - `/dashboard` - Protected dashboard
   - `/` - Redirects to login

---

## Key Features

🔐 **Security**

- Passwords hashed with bcryptjs
- JWT tokens with expiration
- CORS protection
- Server-side validation

💾 **Session Persistence**

- Token stored in localStorage
- Automatic session restore on page refresh
- User remains logged in across browser sessions

📱 **User Experience**

- Loading states during API calls
- Clear error messages
- Smooth redirects
- Responsive design

🛡️ **Protected Routes**

- Dashboard only accessible to logged-in users
- Automatic redirect to login if not authenticated

---

## File Structure

```
Components:
✓ LoginForm.jsx - Login page
✓ Dashboard.jsx - Protected dashboard
✓ RegistrationForm.jsx - Registration page (updated)

Context:
✓ AuthContext.jsx - Global auth state management

Styles:
✓ LoginForm.css - Login styling
✓ Dashboard.css - Dashboard styling

Backend:
✓ routes/users.js - Login endpoint (added)
✓ middleware/auth.js - JWT verification (new)
```

---

## Environment Variables

**Backend (.env)**

```
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/creators-hub
PORT=3000
JWT_SECRET=your-secure-jwt-secret-key-change-in-production
```

**Frontend (.env)**

```
VITE_API_URL=http://localhost:3000/api
```

---

## Common Issues & Solutions

| Issue                       | Solution                                       |
| --------------------------- | ---------------------------------------------- |
| "Invalid email or password" | Check email exists and password is correct     |
| CORS error                  | Ensure backend CLIENT_URL matches frontend URL |
| Token not stored            | Check browser localStorage is enabled          |
| Can't access dashboard      | Make sure you're logged in first               |
| "Module not found" errors   | Run `npm install` in the appropriate directory |

---

## Next Steps

1. **Database:** Ensure MongoDB is running on localhost:27017
2. **Testing:** Follow the Quick Test Flow above
3. **Production:** Change JWT_SECRET in production
4. **Enhancement:** Consider adding password reset, email verification, etc.

---

## Documentation Files

📄 [JWT_AUTHENTICATION_GUIDE.md](JWT_AUTHENTICATION_GUIDE.md) - Complete technical documentation
📄 [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) - Original implementation guide (if exists)

---

Happy coding! 🚀
