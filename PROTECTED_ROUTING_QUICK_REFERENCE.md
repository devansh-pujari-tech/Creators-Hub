# Protected Routing Implementation - Quick Reference

## 🎯 What Was Implemented

### 1. PublicRoute Component (`frontend/src/components/PublicRoute.jsx`)

**Purpose:** Restrict access to public pages (login/register) for authenticated users

```jsx
function PublicRoute({ element, fallback = null }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return fallback || <div className="loading">Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return element;
}
```

**Features:**

- ✅ Checks if user is authenticated
- ✅ Shows loading state during auth verification
- ✅ Redirects authenticated users to dashboard
- ✅ Allows unauthenticated users access to public routes

### 2. ProtectedRoute Component (Already Existed)

**Purpose:** Restrict access to protected pages (dashboard) for unauthenticated users

```jsx
function ProtectedRoute({ element, fallback = null }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return fallback || <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return element;
}
```

### 3. Updated Route Configuration (`frontend/src/App.jsx`)

**Before:**

```jsx
<Routes>
  <Route path="/register" element={<RegistrationForm />} />
  <Route path="/login" element={<LoginForm />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/" element={<Navigate to="/login" replace />} />
</Routes>
```

**After:**

```jsx
<Routes>
  {/* Public Routes - Only accessible to unauthenticated users */}
  <Route
    path="/register"
    element={<PublicRoute element={<RegistrationForm />} />}
  />
  <Route path="/login" element={<PublicRoute element={<LoginForm />} />} />

  {/* Protected Routes - Only accessible to authenticated users */}
  <Route
    path="/dashboard"
    element={<ProtectedRoute element={<Dashboard />} />}
  />

  {/* Default route - Redirects to login */}
  <Route path="/" element={<Navigate to="/login" replace />} />
</Routes>
```

---

## 🔄 Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User Action                              │
│              (Navigate to a route)                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│          Route Component Matches                            │
│        (ProtectedRoute or PublicRoute)                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│         Check: Is loading === true?                         │
└────────────┬─────────────────────────────┬──────────────────┘
             │ YES                         │ NO
             ▼                             ▼
    ┌─────────────────┐        ┌──────────────────────┐
    │  Show Loading   │        │ Route Type Check     │
    │   Fallback UI   │        └──────────────────────┘
    └─────────────────┘                   │
                                          ▼
                    ┌─────────────────────────────────────┐
                    │  Is this a Protected Route? (Private)
                    └──────────┬──────────────┬────────────┘
                               │ YES          │ NO
                ┌──────────────▼───┐    ┌──────▼──────────────┐
                │ Is user auth'd?  │    │Is this a Public Route?
                └────┬──────────┬──┘    └──────┬──────┬───────┘
                     │ YES      │ NO           │YES   │NO
                   ┌─┘          └─┐          ┌─┘      └─┐
                   │              │          │          │
              ┌────▼──┐  ┌────────▼──┐ ┌─────▼──┐ ┌────▼──┐
              │Render │  │Redirect   │ │Redirect│ │Render │
              │Route  │  │to /login  │ │to /dash│ │Route  │
              │Content│  │           │ │ board  │ │Content│
              └───────┘  └───────────┘ └────────┘ └───────┘
```

---

## 📋 Route Access Matrix

| Route        | Logged Out    | Logged In     | Resulting Page           |
| ------------ | ------------- | ------------- | ------------------------ |
| `/login`     | ✅ Accessible | ❌ Redirected | Redirect to `/dashboard` |
| `/register`  | ✅ Accessible | ❌ Redirected | Redirect to `/dashboard` |
| `/dashboard` | ❌ Blocked    | ✅ Accessible | Protected Page           |
| `/`          | Redirected    | Redirected    | Redirect to `/login`     |

---

## 🔐 Authentication State Management

### Where Authentication Lives

- **AuthContext** (`frontend/src/context/AuthContext.jsx`)
  - Manages: `user`, `token`, `loading`, `isAuthenticated`
  - Provides: `login()`, `logout()`, `register()` functions
  - Persists to: `localStorage` for token and user data

### How Auth State Updates

1. **On App Load:**

   ```
   App mounts → AuthProvider loads → Check localStorage → Restore auth state
   ```

2. **On Login:**

   ```
   User submits form → API request → Token received → Store in localStorage → Update context state
   ```

3. **On Logout:**

   ```
   Logout clicked → Remove from localStorage → Clear context state → Redirect to login
   ```

4. **On Page Refresh:**
   ```
   Page reloads → AuthProvider initializes → Check localStorage → Restore previous auth state
   ```

---

## 🚀 Quick Start Guide

### Prerequisites

```bash
# Ensure Node.js and npm are installed
node --version
npm --version

# Install dependencies
cd frontend && npm install
cd ../backend && npm install
```

### Running the Application

**Terminal 1 - Backend:**

```bash
cd backend
node server.js
# Output: Server running on port 5000
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
# Output: Local: http://localhost:5173/
```

### Testing the Routes

1. **Open browser to:** `http://localhost:5173`
2. **Try accessing `/dashboard` while logged out:**
   - URL: `http://localhost:5173/dashboard`
   - Expected: Redirect to `/login`

3. **Login:**
   - Email: `test@example.com`
   - Password: `password123`

4. **Try accessing `/login` while logged in:**
   - URL: `http://localhost:5173/login`
   - Expected: Redirect to `/dashboard`

5. **Logout and verify:**
   - Click logout button
   - Try accessing `/dashboard` again
   - Expected: Redirect to `/login`

---

## 📁 File Organization

```
frontend/src/
├── context/
│   └── AuthContext.jsx (Authentication state & logic)
├── components/
│   ├── ProtectedRoute.jsx (Existing - for protected pages)
│   ├── PublicRoute.jsx (New - for public auth pages)
│   ├── LoginForm.jsx
│   ├── RegistrationForm.jsx
│   └── Dashboard.jsx
└── App.jsx (Route configuration - UPDATED)
```

---

## 🔍 How Each Component Works

### AuthContext.jsx (State Management)

```
Responsibilities:
├── Initialize auth state from localStorage
├── Handle user login (API call + storage)
├── Handle user registration (API call + storage)
├── Handle user logout (clear storage + state)
└── Provide custom useAuth() hook for all components
```

### ProtectedRoute.jsx (Route Guard)

```
Flow:
1. Receives a component to render (element)
2. Checks isAuthenticated & loading from context
3. If loading → return loading UI
4. If not authenticated → redirect to /login
5. If authenticated → render element
```

### PublicRoute.jsx (Route Guard - NEW)

```
Flow:
1. Receives a component to render (element)
2. Checks isAuthenticated & loading from context
3. If loading → return loading UI
4. If authenticated → redirect to /dashboard
5. If not authenticated → render element
```

### App.jsx (Route Configuration)

```
Responsibilities:
├── Define all application routes
├── Wrap protected routes with ProtectedRoute
├── Wrap public auth routes with PublicRoute
├── Wrap entire app with AuthProvider
└── Handle default route navigation
```

---

## 💡 Key Concepts

### Loading State

- Used during initial app load and auth verification
- Prevents routing decisions before auth state is known
- Shows "Loading..." fallback UI by default

### Navigation with Replace

- Uses `<Navigate to="path" replace />`
- `replace` prevents "back" button from returning to protected route
- Better UX - users can't bypass protection with browser back button

### localStorage Persistence

- Token and user data persist across page refreshes
- AuthContext checks localStorage on app init
- Enables seamless experience after refresh

### useAuth() Hook

- Custom hook that accesses AuthContext
- Throws error if used outside AuthProvider
- Safe way to access auth state from any component

---

## ✨ Features Implemented

✅ Prevent unauthorized access to protected pages
✅ Prevent authorized access to login/register pages
✅ Handle loading state gracefully
✅ Persist authentication across page refreshes
✅ Support direct URL access
✅ Smooth redirects with proper UX
✅ Reusable, composable route components
✅ Clear, well-documented code
✅ Production-ready implementation

---

## 🔄 Next Steps & Enhancements

### Potential Improvements

1. **Token Refresh:** Implement automatic token refresh before expiration
2. **Role-Based Access:** Create specialized protected routes for specific roles (admin, user, etc.)
3. **Error Boundaries:** Wrap routes in error boundaries for better error handling
4. **Loading Skeleton:** Replace simple "Loading..." with skeleton screens
5. **Protected API Calls:** Add backend validation for protected endpoints
6. **Logout on Token Expiry:** Automatically logout when token expires
7. **Breadcrumb Navigation:** Add breadcrumbs for better navigation UX

### Security Enhancements

1. Implement HTTPS in production
2. Add CSRF tokens for form submissions
3. Implement rate limiting on auth endpoints
4. Add account lockout after failed login attempts
5. Implement secure password reset flow

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue:** Not redirecting properly

- **Solution:** Check browser console for errors, verify AuthProvider is wrapping app

**Issue:** Stuck on loading screen

- **Solution:** Verify backend is running, check network tab for API errors

**Issue:** localStorage not working

- **Solution:** Check browser privacy settings, try incognito mode

**Issue:** Token not persisting

- **Solution:** Verify login response includes token, check storage quota

---

## 📚 Resources

- [React Router Docs](https://reactrouter.com/)
- [React Context API](https://react.dev/reference/react/useContext)
- [JWT.io](https://jwt.io/)
- [Browser LocalStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
