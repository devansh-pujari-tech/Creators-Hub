import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute Component - Wrapper for protecting routes with authentication
 * 
 * This component demonstrates:
 * 1. Checking authentication status before rendering
 * 2. Handling loading state
 * 3. Redirecting to login if not authenticated
 * 4. Rendering protected content if authenticated
 * 
 * Usage:
 * <ProtectedRoute element={<Dashboard />} />
 * or
 * <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
 */
function ProtectedRoute({ element, fallback = null }) {
  const { isAuthenticated, loading } = useAuth();

  // While checking authentication status, show fallback (loading spinner, etc.)
  if (loading) {
    return fallback || <div className="loading">Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected element
  return element;
}

export default ProtectedRoute;
