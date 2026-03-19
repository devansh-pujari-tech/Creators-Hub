# React Context API - Quick Reference Guide

## 🚀 Quick Start: 5 Minutes to Master

### 1️⃣ Basic Usage (Most Common)

```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) return <p>Not logged in</p>;
  
  return <p>Hello, {user.name}!</p>;
}
```

**That's it!** No props needed. No prop drilling.

---

### 2️⃣ Login Example

```javascript
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (email, password) => {
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    }
  };
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(email, password);
    }}>
      {/* form fields */}
      <button disabled={loading}>
        {loading ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
}
```

---

### 3️⃣ Protected Routes

```javascript
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

function Dashboard() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return <div>Protected Dashboard</div>;
}
```

---

### 4️⃣ Authenticated API Calls

```javascript
import { useAuth } from '../context/AuthContext';

function UserProfile() {
  const { getAuthHeader } = useAuth();
  
  const fetchData = async () => {
    const response = await fetch('/api/profile', {
      headers: getAuthHeader() // Automatically adds Authorization header
    });
    return response.json();
  };
  
  return <button onClick={fetchData}>Load Profile</button>;
}
```

---

## 📦 Available Context Data

```javascript
const {
  // State
  user,              // { _id, name, email }
  token,             // JWT string
  loading,           // boolean (true while checking session)
  isAuthenticated,   // boolean (true if logged in)
  
  // Methods
  login,             // async login(email, password)
  logout,            // logout()
  register,          // async register(name, email, password, confirmPassword)
  
  // Helpers
  getAuthHeader,     // () => { Authorization: "Bearer ..." }
  hasRole,           // (role) => boolean
  updateUserProfile, // (userData) => void
} = useAuth();
```

---

## 🎯 Common Patterns

### Pattern 1: Check if User is Admin
```javascript
const { hasRole } = useAuth();
if (hasRole('admin')) {
  // Show admin panel
}
```

### Pattern 2: Show/Hide Based on Auth
```javascript
const { isAuthenticated } = useAuth();
return isAuthenticated ? <Dashboard /> : <LoginPage />;
```

### Pattern 3: Handle Loading State
```javascript
const { loading } = useAuth();
if (loading) return <LoadingSpinner />;
// Now safe to use user/token
```

### Pattern 4: Logout on Hook
```javascript
const { logout } = useAuth();
useEffect(() => {
  const timer = setInterval(() => {
    // Auto-logout after 1 hour
    logout();
  }, 3600000);
  return () => clearInterval(timer);
}, [logout]);
```

### Pattern 5: Update User Name
```javascript
const { user, updateUserProfile } = useAuth();
const newName = "Jane Doe";
updateUserProfile({ ...user, name: newName });
```

---

## ❌ What NOT to Do

### ❌ Don't pass auth as props
```javascript
// BAD
<Dashboard user={user} token={token} logout={logout} />

// GOOD
<Dashboard />  // Components use useAuth() internally
```

### ❌ Don't access localStorage directly
```javascript
// BAD
const token = localStorage.getItem('token');

// GOOD
const { token } = useAuth();
```

### ❌ Don't duplicate auth logic
```javascript
// BAD - Multiple components with same auth check
function Page1() {
  const storedUser = JSON.parse(localStorage.getItem('user'));
}
function Page2() {
  const storedUser = JSON.parse(localStorage.getItem('user'));
}

// GOOD - One place, multiple uses
const { user } = useAuth();
```

### ❌ Don't use useAuth outside AuthProvider
```javascript
// BAD - This will error
function App() {
  return <MyComponent />; // MyComponent tries to useAuth()
}

// GOOD - Wrap inside Provider
function App() {
  return (
    <Router>
      <AuthProvider>
        <MyComponent /> {/* Now can useAuth() */}
      </AuthProvider>
    </Router>
  );
}
```

---

## 🔍 Debugging

### See All Auth Data
```javascript
const auth = useAuth();
console.log(auth);
// Shows all state and methods
```

### Check if Logged In
```javascript
const { isAuthenticated, loading } = useAuth();
console.log('Logged in:', isAuthenticated);
console.log('Still loading:', loading);
```

### Check LocalStorage
Open DevTools → Application → Local Storage
Look for:
- `token` (JWT string)
- `user` (JSON object)

### Enable Detailed Logging
Add to AuthContext.jsx:
```javascript
const login = async (email, password) => {
  console.log('Logging in:', email);
  // ... rest of login code
  console.log('Login successful:', user);
};

const logout = () => {
  console.log('Logging out');
  // ... rest of logout code
};
```

---

## 📝 Migration Checklist

### Converting Old Component to Use Context

**Before (with props):**
```javascript
function Header({ user, logout }) {
  return (
    <>
      <p>{user.name}</p>
      <button onClick={logout}>Logout</button>
    </>
  );
}
// Usage: <Header user={user} logout={logout} />
```

**After (with Context):**
```javascript
function Header() {
  const { user, logout } = useAuth();
  return (
    <>
      <p>{user.name}</p>
      <button onClick={logout}>Logout</button>
    </>
  );
}
// Usage: <Header />
```

**Steps:**
1. Remove props parameter: `function Header()` ← remove `({ user, logout })`
2. Add useAuth hook: `const { user, logout } = useAuth();`
3. Remove prop passing: `<Header />` ← was `<Header user={user} logout={logout} />`
4. Delete prop-passing chain

---

## 🆘 Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `useAuth must be used within AuthProvider` | Component outside AuthProvider | Verify AuthProvider wraps app in App.jsx |
| `Cannot read user.name` | Using user before loading | Check `loading` state first |
| Token not persisting | localStorage disabled | Enable in browser settings |
| Infinite redirect loop | isAuthenticated check bug | Verify loading state in protection logic |
| `import not found` | Wrong import path | Use `from '../context/AuthContext'` |

---

## 🎓 Key Concepts

### React Context
- Passes data without props
- All components can access
- Updates trigger re-renders

### useAuth Hook
- Custom hook to access context
- Returns all auth data
- Can be used in any component

### AuthProvider
- Makes context available to app
- Manages all auth state
- Handles persistence

### localStorage
- Browser storage (survives refresh)
- Token stored encrypted (JWT)
- User data stored as JSON
- Cleared on logout

---

## 📚 Full Guides

For detailed information, see:
- **CONTEXT_API_REFACTORING.md** - Complete technical guide
- **TESTING_GUIDE.md** - Testing procedures
- **ASSIGNMENT_SUMMARY.md** - Implementation summary

---

## 💡 Pro Tips

1. **Always check loading state first**
   ```javascript
   if (loading) return <LoadingSpinner />;
   // Now safe to use user/token
   ```

2. **Use useCallback for auth functions**
   ```javascript
   const handleLogout = useCallback(() => {
     logout();
     navigate('/login');
   }, [logout, navigate]);
   ```

3. **Memoize context value (optional optimization)**
   ```javascript
   const value = useMemo(() => ({
     user, token, loading, isAuthenticated,
     login, logout, register, getAuthHeader, hasRole, updateUserProfile
   }), [user, token, loading, isAuthenticated]);
   ```

4. **Create specific hooks for common patterns**
   ```javascript
   export const useIsAuthenticated = () => {
     const { isAuthenticated, loading } = useAuth();
     return !loading && isAuthenticated;
   };
   ```

---

## 🚀 Ready to Use!

You now have everything needed to:
- ✅ Access auth state anywhere
- ✅ Make authenticated API calls
- ✅ Protect routes
- ✅ Handle login/logout
- ✅ Persist sessions
- ✅ Debug auth issues

**Happy coding!** 🎉

---

For questions, refer to the detailed guides or check the example components:
- `frontend/src/components/Header.jsx`
- `frontend/src/components/ProtectedRoute.jsx`
- `frontend/src/components/UserProfileExample.jsx`
