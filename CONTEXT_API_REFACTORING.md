# React Context API Refactoring - Complete Guide

## Overview

This document demonstrates how the JWT authentication system has been refactored to use React Context API for global state management, eliminating prop drilling and centralizing authentication logic.

---

## What is Prop Drilling?

**Before (Prop Drilling Problem):**

```
App
  ├── Page1
  │   ├── Header (needs auth data)
  │   │   └── UserMenu (needs user)
  │   └── MainContent (needs token)
  └── Page2
      └── Dashboard (needs user, isAuthenticated)

Result: We pass the same props through multiple levels of components,
even if intermediate components don't need them.
```

**After (Context API Solution):**

```
App (wrapped with AuthProvider)
  ├── Page1
  │   ├── Header (useAuth to get auth data)
  │   │   └── UserMenu (useAuth to get user)
  │   └── MainContent (useAuth to get token)
  └── Page2
      └── Dashboard (useAuth to get auth state)

Result: Any component can access auth data directly without passing props.
```

---

## Architecture

### 1. AuthContext Structure

**File:** `frontend/src/context/AuthContext.jsx`

```javascript
// Global state
- user: { _id, name, email }
- token: JWT string
- loading: boolean (initial load state)
- isAuthenticated: boolean

// Methods
- login(email, password): Authenticates user, stores token and user
- logout(): Clears authentication data
- register(name, email, password, confirmPassword): Registers new user
- getAuthHeader(): Returns Authorization header for API calls
- hasRole(role): Checks if user has specific role
- updateUserProfile(updatedUser): Updates user profile locally
```

### 2. Component Hierarchy

```
BrowserRouter
  └── AuthProvider (wraps entire app)
      ├── Routes
      │   ├── /register → RegistrationForm (uses useAuth for register)
      │   ├── /login → LoginForm (uses useAuth for login)
      │   ├── /dashboard → Dashboard (uses useAuth for isAuthenticated, user)
      │   └── / → Navigate to /login
```

---

## How to Use AuthContext

### Usage Pattern 1: Simple State Access

```javascript
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, isAuthenticated } = useAuth();

  return (
    <header>
      {isAuthenticated ? <p>Welcome, {user.name}!</p> : <p>Please log in</p>}
    </header>
  );
}
```

### Usage Pattern 2: Using Methods

```javascript
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    const result = await login(email, password);
    if (result.success) {
      navigate("/dashboard");
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin(email, password);
      }}
    >
      {/* form inputs */}
      <button disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
    </form>
  );
}
```

### Usage Pattern 3: Protected Routes

```javascript
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Dashboard() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return <div>Dashboard content</div>;
}
```

### Usage Pattern 4: Making Authenticated API Calls

```javascript
import { useAuth } from "../context/AuthContext";

function UserProfile() {
  const { getAuthHeader, token } = useAuth();

  const fetchUserData = async () => {
    const response = await fetch("/api/users/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(), // Includes Authorization: Bearer {token}
      },
    });

    const data = await response.json();
    return data;
  };

  return <button onClick={fetchUserData}>Load Profile</button>;
}
```

---

## Key Features Implemented

### 1. Global State Management

**Problem:** Multiple components need auth data → pass through props → prop drilling

**Solution:** AuthContext provides global access without props

```javascript
// In any component, just do:
const { user, token, isAuthenticated } = useAuth();
// No props needed!
```

### 2. Persistent Authentication

**Problem:** User loses session after page refresh

**Solution:** AuthProvider automatically restores session from localStorage

```javascript
// In AuthProvider:
useEffect(() => {
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (storedToken && storedUser) {
    setToken(storedToken);
    setUser(JSON.parse(storedUser));
    setIsAuthenticated(true);
  }
  setLoading(false);
}, []);
```

### 3. Loading State Management

**Problem:** How to handle initial auth check on app load?

**Solution:** Loading state prevents rendering until auth is verified

```javascript
// In components:
if (loading) return <div>Loading...</div>;
if (!isAuthenticated) return null; // or redirect

// This ensures we don't show wrong UI during auth check
```

### 4. Centralized API Calls

**Problem:** Login/logout/register logic scattered across components

**Solution:** All API calls are in AuthContext

```javascript
const login = async (email, password) => {
  // Centralized login logic
  // All error handling here
  // All state updates here
};

const logout = () => {
  // Centralized logout logic
  // Clears state and localStorage
};
```

### 5. Helper Functions

**New utilities for common patterns:**

```javascript
// Get Authorization header for any API call
const headers = getAuthHeader();
// Returns: { Authorization: "Bearer <token>" }

// Check if user has specific role
if (hasRole("admin")) {
  // Show admin panel
}

// Update user profile without re-login
updateUserProfile(newUserData);
```

---

## Complete Flow Demonstration

### Scenario 1: First-Time Login

```
User enters credentials on Login page
↓
Clicks "Login" button
↓
LoginForm calls: const result = await login(email, password)
↓
AuthContext.login():
  - Sends POST to /api/users/login
  - Receives JWT token and user data
  - Stores in localStorage
  - Updates state (user, token, isAuthenticated)
  - Returns { success: true }
↓
LoginForm checks success and navigates to /dashboard
↓
Dashboard component:
  - Calls useAuth()
  - Gets isAuthenticated = true
  - Gets user data
  - Renders dashboard with user info
```

### Scenario 2: Page Refresh (Session Persistence)

```
User is on dashboard
↓
User refreshes page (F5)
↓
App re-mounts, AuthProvider runs useEffect:
  - Checks localStorage for token and user
  - Finds them (from previous login)
  - Sets loading = true
  - Updates state with stored data
  - Sets loading = false
↓
Dashboard component still has access to user data
  - useAuth() returns user details
  - Dashboard renders immediately (no redirect)
↓
Session persisted! ✓
```

### Scenario 3: Logout

```
User clicks "Logout" button on Dashboard
↓
Dashboard calls: logout() from useAuth()
↓
AuthContext.logout():
  - Removes token from localStorage
  - Removes user from localStorage
  - Sets user = null
  - Sets token = null
  - Sets isAuthenticated = false
↓
Dashboard component detects isAuthenticated changed
  - useEffect triggers
  - Calls navigate('/login')
↓
User redirected to login page
↓
Logout complete! ✓
```

### Scenario 4: Protected Route Access

```
User tries to access /dashboard without login
↓
Dashboard component mounts
  - Calls useAuth()
  - Gets isAuthenticated = false (no token in localStorage)
↓
useEffect runs:
  - Checks: !isAuthenticated = true
  - Calls navigate('/login')
↓
User redirected to login page automatically ✓
```

---

## Benefits of This Approach

### ✅ No Prop Drilling

- Components access auth data directly from context
- No need to pass props through multiple levels
- Cleaner component tree

### ✅ Centralized State Management

- All auth logic in one place (AuthContext)
- Easier to find and modify auth functionality
- Single source of truth for auth state

### ✅ Code Reusability

- `useAuth()` hook can be used in any component
- Consistent authentication patterns across app
- Less code duplication

### ✅ Better Maintainability

- Changes to auth logic don't require updating multiple components
- Clear separation of concerns
- Easier to test

### ✅ Performance

- Context is optimized for this use case
- Only re-renders components that use specific context values
- No unnecessary prop updates

### ✅ Developer Experience

- Simple API: `const { user, login } = useAuth()`
- TypeScript support (can be added)
- Comprehensive error messages

---

## Files Structure

```
frontend/src/
├── context/
│   └── AuthContext.jsx ⭐ (Global auth state management)
│
├── components/
│   ├── LoginForm.jsx (uses useAuth)
│   ├── Dashboard.jsx (uses useAuth)
│   ├── RegistrationForm.jsx (uses useAuth)
│   └── ... other components can use useAuth
│
├── App.jsx ⭐ (Wrapped with AuthProvider inside Router)
│
└── main.jsx
```

**Key Files:**

- ⭐ AuthContext.jsx - Manages auth state
- ⭐ App.jsx - Provides context to entire app

---

## Best Practices

### ✅ DO

```javascript
// ✓ Use useAuth in any component
function Header() {
  const { user, logout } = useAuth();
  // ...
}

// ✓ Access context data without props
const { isAuthenticated } = useAuth();

// ✓ Use useEffect to respond to auth changes
useEffect(() => {
  if (!isAuthenticated) {
    navigate("/login");
  }
}, [isAuthenticated]);

// ✓ Use helper functions for common patterns
const headers = getAuthHeader();
```

### ❌ DON'T

```javascript
// ✗ Don't pass auth data through props
<Dashboard user={user} token={token} />;

// ✗ Don't access localStorage directly in components
const token = localStorage.getItem("token");

// ✗ Don't duplicate auth logic in multiple components
// Put all auth logic in AuthContext

// ✗ Don't use AuthContext outside of AuthProvider
// Always wrap app with Provider first
```

---

## Testing the Implementation

### Test 1: Initial Login

1. Open http://localhost:5174/login
2. Enter valid credentials
3. Should redirect to /dashboard
4. User info should display
5. **Expected:** Dashboard shows user name

### Test 2: Session Persistence

1. After login, open DevTools → Application → LocalStorage
2. Verify `token` and `user` are stored
3. Refresh page (F5)
4. Should stay on /dashboard
5. User info should still display
6. **Expected:** Session persisted without re-login

### Test 3: Logout

1. On dashboard, click "Logout" button
2. Should redirect to /login
3. LocalStorage should be cleared
4. Try to access /dashboard directly
5. **Expected:** Redirected to /login

### Test 4: Protected Routes

1. Open new incognito window
2. Try accessing http://localhost:5174/dashboard
3. Should redirect to /login
4. **Expected:** Cannot access dashboard without login

### Test 5: Context in Multiple Components

1. Create a new component that uses `useAuth()`
2. Access user data from auth context
3. Verify data is consistent across components
4. **Expected:** All components see same user data

---

## How to Extend the Context

### Add New Auth State

```javascript
// In AuthContext.jsx
const [preferences, setPreferences] = useState(null);

// In context value:
value = {
  // ... existing
  preferences,
  setPreferences,
};
```

### Add New Auth Method

```javascript
// In AuthContext.jsx
const updateProfile = async (userData) => {
  // API call to update profile
  // Update state
  // Update localStorage
  // Return result
};

// In context value:
value = {
  // ... existing
  updateProfile,
};
```

### Add Role-Based Access

```javascript
// In components:
const { hasRole } = useAuth();

if (hasRole("admin")) {
  // Show admin features
}
```

---

## Summary

### What Was Refactored

✅ **Before:** Props passed through multiple component levels  
✅ **After:** Single useAuth() hook for global access

✅ **Before:** Auth logic scattered across components  
✅ **After:** Centralized in AuthContext

✅ **Before:** Direct localStorage access in components  
✅ **After:** All localStorage handled in context

✅ **Before:** No consistent error handling  
✅ **After:** Centralized error handling

### Key Takeaways

1. **React Context API** - Eliminates prop drilling
2. **useAuth Hook** - Simple way to access auth state
3. **AuthProvider** - Single source of truth
4. **Session Persistence** - Automatic localStorage management
5. **Protected Routes** - Easy authentication checks
6. **Scalable** - Easy to add features (roles, permissions, etc.)

---

## Additional Resources

- [React Context API Documentation](https://react.dev/reference/react/useContext)
- [useContext Hook Guide](https://react.dev/reference/react/useContext)
- [React Patterns: Context API](https://react-patterns.com/)
- [Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

---

## Next Steps

1. **Use this pattern** in all your React applications
2. **Extend it** for role-based access control
3. **Add interceptors** for automatic token refresh
4. **Integrate** with error boundary for better error handling
5. **Add tests** for auth logic (unit tests for context)

---

## Code Quality Checklist

- ✅ AuthProvider wraps entire app inside Router
- ✅ useAuth hook has error checking
- ✅ localStorage access centralized
- ✅ Loading state prevents UI flashing
- ✅ Protected routes check isAuthenticated
- ✅ No prop drilling for auth data
- ✅ Consistent error handling
- ✅ Helper functions for common patterns

---

This refactoring demonstrates modern React patterns for global state management and is production-ready!
