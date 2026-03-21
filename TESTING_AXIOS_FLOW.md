# Complete Authentication & API Flow Testing Guide

This guide explains how to test the complete Axios + JWT authentication implementation.

## Prerequisites

- MongoDB is running locally
- Backend server will run on `http://localhost:3000`
- Frontend Vite dev server will run on `http://localhost:5173`

## System Architecture

```
Frontend (React + Vite)
    ↓
Axios API Utility (api.js)
    ├─ Request Interceptor: Adds Authorization header with JWT token
    └─ Response Interceptor: Handles 401 errors, clears localStorage, redirects to login
    ↓
Backend (Express + JWT)
    └─ verifyToken Middleware: Validates JWT token from Authorization header
    ↓
Database (MongoDB)
```

## Testing Workflow

### 1. Start the Backend Server

```bash
cd backend
npm run dev
```

Expected output:

```
Server running on port 3000
Connected to Database
```

### 2. Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

Expected output:

```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### 3. Test Case: New User Registration

**Steps:**

1. Navigate to `http://localhost:5173/`
2. Click "Register"
3. Fill in:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "TestPass123"
   - Confirm Password: "TestPass123"
4. Click "Register"

**Expected Behavior:**

- ✅ Request sent via Axios to `/api/users/register`
- ✅ User created in database
- ✅ Success message displayed
- ✅ User redirected to login page

**Verify in Network Tab:**

- Request Method: POST
- URL: `http://localhost:3000/api/users/register`
- Response Status: 201 Created
- Response includes: `{ success: true, message: "...", user: {...} }`

---

### 4. Test Case: User Login Without Token

**Steps:**

1. Navigate to `http://localhost:5173/login`
2. Enter credentials:
   - Email: "test@example.com"
   - Password: "TestPass123"
3. Click "Login"

**Expected Behavior:**

- ✅ Axios sends POST to `/api/users/login`
- ✅ Backend validates credentials
- ✅ Backend generates JWT token
- ✅ Token stored in localStorage
- ✅ User redirected to `/dashboard`

**Verify in Browser DevTools:**

1. Open Developer Tools (F12)
2. Go to **Application** → **Local Storage**
3. Check for:
   - `token`: Contains your JWT (format: `eyJhbGc...`)
   - `user`: Contains `{ _id, name, email }`

**Verify in Network Tab:**

- Request: POST `/api/users/login`
- Request Headers: `Content-Type: application/json`
- Response Status: 200 OK
- Response includes: `{ success: true, token: "eyJ...", user: {...} }`

---

### 5. Test Case: Authenticated Request With Token

**Steps:**

1. Login (see Test Case 4)
2. On Dashboard, navigate to a component that makes authenticated API calls
3. Open Network tab (F12)
4. Trigger an API call (e.g., fetch user profile)

**Expected Behavior:**

- ✅ Axios Request Interceptor automatically adds `Authorization: Bearer {token}`
- ✅ Backend `verifyToken` middleware validates the token
- ✅ Route handler has access to `req.user` data
- ✅ Response returns user data with 200 OK

**Verify in Network Tab:**

1. Find the API request (e.g., `/api/users/profile`)
2. Check **Request Headers**:
   ```
   GET /api/users/profile HTTP/1.1
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   Content-Type: application/json
   ```
3. Check **Response**:
   ```json
   {
     "success": true,
     "user": {
       "_id": "...",
       "name": "Test User",
       "email": "test@example.com"
     }
   }
   ```

---

### 6. Test Case: Request Without Token (Should Fail)

**Steps:**

1. Modify browser console and clear localStorage:
   ```javascript
   localStorage.clear();
   ```
2. Manually try to access protected route: `http://localhost:5173/dashboard`
3. Try to make API call to a protected endpoint

**Expected Behavior:**

- ✅ Request interceptor skips Authorization header (no token exists)
- ✅ Backend returns 401 Unauthorized
- ✅ Response shows: `{ success: false, message: "No token provided" }`

**Verify in Network Tab:**

1. Request to protected endpoint shows **Status: 401 Unauthorized**
2. Response: `{ success: false, message: "No token provided. Please log in." }`

---

### 7. Test Case: Expired or Invalid Token (Auto-Logout)

**Steps:**

1. Login to get a valid token
2. Open browser console and manually modify the token:
   ```javascript
   localStorage.setItem("token", "invalid-token-xyz123");
   ```
3. Try to make an API call (e.g., refresh dashboard data)

**Expected Behavior:**

- ✅ Axios sends request with invalid token header
- ✅ Backend `verifyToken` middleware rejects the token
- ✅ Backend returns 401 Unauthorized
- ✅ Axios Response Interceptor detects 401 status
- ✅ localStorage is cleared (`token` and `user` removed)
- ✅ Event `authTokenExpired` dispatched
- ✅ AuthContext clears authentication state
- ✅ User redirected to `/login`

**Verify in Network Tab:**

1. Request shows **Status: 401 Unauthorized**
2. Response shows: `{ success: false, message: "Invalid token. Please log in." }`
3. Check localStorage - should be empty

**Verify in Console:**

1. LocalStorage cleared
2. User redirected to login page
3. Session state reset

---

### 8. Test Case: Token Interception & Automatic Attachment

**Steps:**

1. Login to get a token
2. Open Network tab in DevTools
3. Perform actions that trigger multiple API calls:
   - Load dashboard
   - Fetch user profile
   - Any other authenticated endpoint

**Expected Behavior:**

- ✅ Every request automatically includes the token
- ✅ No manual token attachment in components
- ✅ All requests use `Authorization: Bearer {token}` header

**Verify in Network Tab:**
All API requests should show:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Troubleshooting

### Issue: Token not being sent

**Solution:**

- Check if localStorage has `token` key
- Verify Axios instance is imported correctly in components
- Check Request Interceptor in `src/services/api.js`

### Issue: 401 errors not redirecting to login

**Solution:**

- Verify Response Interceptor checks for status 401
- Check if `authTokenExpired` event listener is set up in AuthContext
- Test in browser console: `window.dispatchEvent(new Event('authTokenExpired'))`

### Issue: CORS errors

**Solution:**

- Verify `CLIENT_URL` in backend `.env` matches frontend URL
- Check CORS middleware in `server.js`

### Issue: Backend can't find token

**Solution:**

- Verify middleware uses: `req.headers.authorization?.split(" ")[1]`
- Token must be sent as: `Authorization: Bearer {token}`
- Not: `Authorization: {token}` (missing "Bearer ")

---

## Key Files

| File                                   | Purpose                                                |
| -------------------------------------- | ------------------------------------------------------ |
| `frontend/src/services/api.js`         | Centralized Axios instance with interceptors           |
| `frontend/src/context/AuthContext.jsx` | Authentication state & logic (refactored to use Axios) |
| `backend/routes/users.js`              | API routes (register, login, protected profile)        |
| `backend/middleware/auth.js`           | JWT verification middleware                            |

---

## Success Indicators

✅ All tests pass
✅ Token automatically attached to all authenticated requests
✅ 401 errors trigger auto-logout and redirect
✅ Network tab shows proper headers
✅ localStorage correctly stores/clears token
✅ No manual token handling in components
✅ Clean, DRY code following best practices
