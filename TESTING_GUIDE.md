# Context API Refactoring - Testing & Validation Guide

## Overview
This guide walks through testing all aspects of the Context API implementation to ensure proper functionality, state management, and session persistence.

---

## Pre-Testing Checklist

- [ ] Backend running on http://localhost:3000
- [ ] Frontend running on http://localhost:5174 (or 5173)
- [ ] MongoDB is running and accessible
- [ ] `npm install` has been run in both frontend and backend
- [ ] `.env` files configured correctly
- [ ] Browser DevTools available

---

## Test Suite 1: AuthContext Implementation

### Test 1.1: Context is Created and Provided

**Expected:** AuthContext exists and AuthProvider wraps the app

**Steps:**
1. Open `frontend/src/App.jsx`
2. Verify:
   - [ ] `Router` is the outermost wrapper
   - [ ] `AuthProvider` wraps content inside Router
   - [ ] Routes are inside AuthProvider

**Expected Output:**
```
✓ AuthProvider found in App.jsx
✓ Wrapped inside BrowserRouter
✓ All routes are inside provider scope
```

### Test 1.2: useAuth Hook Works

**Expected:** useAuth hook returns auth context data

**Steps:**
1. Open any component that uses `useAuth()` (e.g., `LoginForm.jsx`)
2. Verify hook provides:
   - [ ] `user` object
   - [ ] `token` string
   - [ ] `isAuthenticated` boolean
   - [ ] `loading` boolean
   - [ ] `login` function
   - [ ] `logout` function
   - [ ] `register` function

**Test in Browser Console:**
```javascript
// This is just conceptual - shows what data is available
const auth = useAuth(); 
// {
//   user: { _id, name, email },
//   token: "jwt...",
//   loading: false,
//   isAuthenticated: true,
//   login: f,
//   logout: f,
//   register: f,
//   getAuthHeader: f,
//   hasRole: f,
//   updateUserProfile: f
// }
```

---

## Test Suite 2: Global State Management

### Test 2.1: No Prop Drilling

**Expected:** Components access auth data directly without props

**Steps:**
1. Open `frontend/src/components/LoginForm.jsx`
2. Verify:
   - [ ] No `props` parameter in component function
   - [ ] Uses `const { login } = useAuth()`
   - [ ] No `user` passed as prop

3. Open `frontend/src/components/Dashboard.jsx`
4. Verify:
   - [ ] No props received
   - [ ] Uses `const { user, logout } = useAuth()`

**Expected Output:**
```
✓ LoginForm receives no props
✓ LoginForm uses useAuth() directly
✓ Dashboard receives no props
✓ Dashboard uses useAuth() directly
✓ No prop drilling detected
```

### Test 2.2: Header Component Example

**Expected:** Header component demonstrates prop-free access

**Steps:**
1. Open `frontend/src/components/Header.jsx`
2. Verify:
   - [ ] Component uses `useAuth()`
   - [ ] Gets `user, isAuthenticated, logout`
   - [ ] Can be placed anywhere in app without props
   - [ ] Automatically shows correct content for logged-in/logged-out state

**Code to verify:**
```javascript
function Header() {
  const { user, isAuthenticated, logout } = useAuth(); // No props!
  // ...
}
```

---

## Test Suite 3: Authentication Functionality

### Test 3.1: User Registration

**Test Case:** New user can register successfully

**Steps:**
1. Navigate to http://localhost:5174/register
2. Fill form:
   - Name: Test User
   - Email: testuser@example.com
   - Password: TestPass123
   - Confirm: TestPass123
3. Click "Create Account"
4. Verify:
   - [ ] Success message appears
   - [ ] Auto-redirects to login page (after 2 seconds)
   - [ ] Form clears after submission

**Expected Output:**
```
✓ Registration form accepted
✓ Success message displayed
✓ Redirected to login page
✓ No errors in console
```

### Test 3.2: User Login

**Test Case:** User can login with valid credentials

**Steps:**
1. On login page, enter credentials:
   - Email: testuser@example.com
   - Password: TestPass123
2. Click "Login"
3. Verify:
   - [ ] Loading state shows briefly
   - [ ] Redirects to /dashboard
   - [ ] Dashboard displays user information
   - [ ] No errors in console

**Expected Output:**
```
✓ Login accepted
✓ Redirected to dashboard
✓ User name displayed: Test User
✓ Email displayed: testuser@example.com
✓ No errors in browser console
```

### Test 3.3: Invalid Credentials

**Test Case:** Login fails with invalid credentials

**Steps:**
1. On login page, enter:
   - Email: testuser@example.com
   - Password: WrongPassword
2. Click "Login"
3. Verify:
   - [ ] Error message shown: "Invalid email or password"
   - [ ] Stays on login page (no redirect)
   - [ ] Can try again

**Expected Output:**
```
✓ Error message displayed
✓ Access denied
✓ Redirects not triggered
✓ User can retry
```

---

## Test Suite 4: Session Persistence

### Test 4.1: localStorage Usage

**Test Case:** Token and user data stored in localStorage

**Steps:**
1. After login, open DevTools (F12)
2. Go to: Application → Storage → Local Storage → http://localhost:5174
3. Verify:
   - [ ] `token` key exists with JWT value
   - [ ] `user` key exists with JSON object
   - [ ] User object contains: _id, name, email

**Expected Output:**
```
LocalStorage contents:
token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
user: {"_id":"...","name":"Test User","email":"testuser@example.com"}
```

### Test 4.2: Session Restoration

**Test Case:** App restores session from localStorage on load

**Steps:**
1. After login (dashboard is open)
2. Refresh page (F5 or Ctrl+R)
3. Verify:
   - [ ] Loading spinner appears briefly
   - [ ] User remains on dashboard (not redirected to login)
   - [ ] User information still displayed
   - [ ] No authentication errors

**Expected Output:**
```
✓ Page refreshed
✓ Loading state triggered
✓ Session restored from localStorage
✓ Stayed on dashboard
✓ User data: Test User
```

### Test 4.3: Loading State During Initial Load

**Test Case:** Loading state prevents UI flashing

**Steps:**
1. Open browser DevTools Network tab
2. Set throttling to "Slow 3G"
3. Refresh page while logged in
4. Observe:
   - [ ] "Loading..." message appears
   - [ ] Dashboard doesn't show until loaded
   - [ ] No "undefined" user data flashing
   - [ ] Smooth transition to dashboard

**Expected Output:**
```
✓ Loading state shown
✓ No UI flashing
✓ Proper state management
✓ User data appears correctly
```

---

## Test Suite 5: Protected Routes

### Test 5.1: Access Dashboard Without Login

**Test Case:** Non-authenticated user redirected to login

**Steps:**
1. Open new **Incognito/Private** window
2. Navigate to http://localhost:5174/dashboard
3. Verify:
   - [ ] Immediately redirects to /login
   - [ ] Dashboard never visible
   - [ ] URL changes to /login

**Expected Output:**
```
✓ Attempted to access /dashboard without login
✓ Automatic redirect to /login
✓ No dashboard visible
✓ No errors in console
```

### Test 5.2: Access Register/Login Without Login

**Test Case:** Any user can access registration and login pages

**Steps:**
1. In incognito window, navigate to:
   - [ ] http://localhost:5174/register → Should load registration form
   - [ ] http://localhost:5174/login → Should load login form
   - [ ] http://localhost:5174 → Should redirect to /login

**Expected Output:**
```
✓ /register page loads
✓ /login page loads
✓ / redirects to /login
✓ No unnecessary redirects
```

---

## Test Suite 6: Logout Functionality

### Test 6.1: Logout Clears State

**Test Case:** Logout clears authentication state

**Steps:**
1. While logged in, open DevTools → Application → Local Storage
2. Note the stored data:
   - `token`: (should exist)
   - `user`: (should exist)
3. Click "Logout" button on dashboard
4. Verify:
   - [ ] Redirects to /login
   - [ ] localStorage is cleared:
     - `token`: (should be gone)
     - `user`: (should be gone)
   - [ ] Auth context state cleared
   - [ ] Can login again with fresh state

**Expected Output:**
```
Before logout:
- localStorage.token: exists ✓
- localStorage.user: exists ✓
- isAuthenticated: true ✓

After logout:
- localStorage.token: cleared ✓
- localStorage.user: cleared ✓
- isAuthenticated: false ✓
- Redirected to /login ✓
```

### Test 6.2: Logout Then Access Protected Routes

**Test Case:** Protected routes work correctly after logout

**Steps:**
1. Logout (follow Test 6.1)
2. Try to access /dashboard
3. Verify:
   - [ ] Redirected to /login
   - [ ] Cannot access dashboard
   - [ ] Must login again

**Expected Output:**
```
✓ After logout, /dashboard redirects to /login
✓ Protected routes still protected
```

---

## Test Suite 7: Context Helper Functions

### Test 7.1: getAuthHeader() Function

**Test Case:** getAuthHeader() provides Authorization header

**Expected:** Helper function returns correct Authorization header format

**Verification in Component:**
```javascript
const { getAuthHeader } = useAuth();
const headers = getAuthHeader();
// Should produce:
// { Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

### Test 7.2: hasRole() Function

**Test Case:** hasRole() checks user role (for future features)

**Expected:** Function returns boolean based on user role

```javascript
const { hasRole } = useAuth();
console.log(hasRole('admin')); // false (user doesn't have admin role)
```

### Test 7.3: updateUserProfile() Function

**Test Case:** updateUserProfile() updates user locally

**Expected:** Function updates user object and localStorage

```javascript
const { updateUserProfile } = useAuth();
updateUserProfile({ ...user, name: "New Name" });
// User object updated
// localStorage updated
```

---

## Test Suite 8: Component Integration

### Test 8.1: Multiple Components Access Same Context

**Test Case:** Multiple components access same auth state

**Steps:**
1. Look at Header, Dashboard, LoginForm components
2. All use `useAuth()` hook
3. Verify:
   - [ ] All get same `user` data
   - [ ] All see same `isAuthenticated` status
   - [ ] Changes in one component reflect in all

**Expected Output:**
```
✓ Header shows logged-in user name
✓ Dashboard shows same user name
✓ Both get data from same context
✓ No prop drilling needed
```

### Test 8.2: Context Update Triggers Re-renders

**Test Case:** State changes in context trigger component updates

**Steps:**
1. Login to dashboard
2. Click logout
3. Verify:
   - [ ] Dashboard component detects change
   - [ ] Triggers redirect
   - [ ] Logout button disappears
   - [ ] Header shows "Login" link instead

**Expected Output:**
```
✓ Context change detected immediately
✓ Components re-rendered
✓ UI updated correctly
```

---

## Test Suite 9: Error Handling

### Test 9.1: Network Error During Login

**Test Case:** Graceful error handling for network failures

**Steps:**
1. Stop backend server
2. Try to login
3. Verify:
   - [ ] Error message displayed
   - [ ] User-friendly error text
   - [ ] No crash or console errors
   - [ ] Can retry after server is back up

**Expected Output:**
```
✓ Error handled gracefully
✓ User sees error message
✓ App doesn't crash
✓ Can retry login
```

### Test 9.2: useAuth Outside Provider

**Test Case:** Error when useAuth used outside AuthProvider

**Verification (Dev time only):**
```javascript
// This would throw error:
// "useAuth must be used within AuthProvider"

// Correct usage:
// <AuthProvider>
//   <Component /> // can use useAuth here
// </AuthProvider>
```

---

## Test Suite 10: Browser Compatibility

### Test 10.1: Multiple Tabs/Windows

**Test Case:** Auth state synced across browser tabs

**Steps:**
1. Login in Tab 1, go to dashboard
2. Open Tab 2, navigate to http://localhost:5174/dashboard
3. Verify:
   - [ ] Tab 2 shows dashboard (session persistent)
   - [ ] User data available in both tabs
4. Logout in Tab 1
5. Verify:
   - [ ] Tab 2 eventually detects logout (if it checks on activity)

**Expected Output:**
```
✓ Both tabs share localStorage
✓ Session works across tabs
✓ Auth state consistent
```

### Test 10.2: Incognito/Private Window

**Test Case:** Auth doesn't lean across incognito windows

**Steps:**
1. Login in Normal window, go to dashboard
2. Open Incognito window
3. Navigate to http://localhost:5174/dashboard
4. Verify:
   - [ ] Redirected to login (separate localStorage)
   - [ ] Must login separately in incognito

**Expected Output:**
```
✓ Incognito has separate localStorage
✓ No auth data leaks between windows
✓ Session isolated correctly
```

---

## Test Suite 11: Performance

### Test 11.1: No Unnecessary Re-renders

**Test Case:** Context changes don't cause excessive re-renders

**Steps:**
1. Open DevTools → React DevTools (if installed)
2. Check render counts when:
   - [ ] User logs in
   - [ ] User logs out
   - [ ] Page refreshes with active session
3. Verify:
   - [ ] Only affected components re-render
   - [ ] Minimal re-renders for state updates

**Expected Output:**
```
✓ Efficient re-rendering
✓ No performance issues
✓ Context optimized
```

---

## Testing Checklist Summary

### Core Functionality
- [ ] AuthContext created and provided globally
- [ ] useAuth hook works in all components
- [ ] User registration works
- [ ] User login works with valid credentials
- [ ] Invalid credentials rejected
- [ ] Logout works and clears data

### State Management
- [ ] No prop drilling for auth data
- [ ] Multiple components access same state
- [ ] State changes trigger updates

### Persistence
- [ ] Token stored in localStorage
- [ ] User data stored in localStorage
- [ ] Session restored on page refresh
- [ ] Loading state handled correctly

### Security
- [ ] Protected routes work
- [ ] Non-authenticated users redirected to login
- [ ] localStorage cleared on logout
- [ ] Authorization headers correct

### User Experience
- [ ] Error messages clear and helpful
- [ ] Loading states shown appropriately
- [ ] Smooth redirects and transitions
- [ ] Works across browser tabs

### Browser & Environment
- [ ] Works in Chrome, Firefox, Safari, Edge
- [ ] Works in incognito/private windows
- [ ] Network errors handled gracefully
- [ ] Works with Vite development server

---

## Known Issues & Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| "react-router-dom not found" | Dependencies not installed | Run `npm install` in frontend |
| "useAuth must be used within AuthProvider" | Component not wrapped by provider | Ensure AuthProvider wraps app in App.jsx |
| Token not persisting | localStorage disabled | Check browser privacy settings |
| Redirect loops | isAuthenticated check issue | Verify loading state is handled |
| CORS error | Backend URL mismatch | Check VITE_API_URL in frontend/.env |
| "Cannot read user.name" | User accessing auth before load | Check loading state first |

---

## Sign-Off

All tests completed and passing? Congratulations! Your Context API refactoring is working correctly.

- [ ] All test suites passed
- [ ] No console errors
- [ ] No redirect loops
- [ ] Session persists correctly
- [ ] Protected routes secure
- [ ] Ready for production

---

## Next Steps

1. **Code Review** - Have team review the refactoring
2. **Performance Optimization** - Profile and optimize if needed
3. **Add More Features** - Implement refresh tokens, 2FA, etc.
4. **Write Unit Tests** - Add Jest/Vitest tests for AuthContext
5. **Document API** - Add JSDoc comments to functions
6. **Deploy** - Push to production with updated JWT_SECRET

---

Happy testing! 🚀
