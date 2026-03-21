import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

/**
 * PublicRoute Component - Wrapper for restricting access to public pages for authenticated users
 * 
 * This component demonstrates:
 * 1. Checking authentication status before rendering
 * 2. Handling loading state
 * 3. Redirecting to dashboard if already authenticated
 * 4. Allowing unauthenticated users to access public content
 * 
 * Usage:
 * <Route path="/login" element={<PublicRoute element={<LoginForm />} />} />
 */
function PublicRoute({ element, fallback = null }) {
  const { isAuthenticated, loading } = useAuth();

  // While checking authentication status, show fallback (loading spinner, etc.)
  if (loading) {
    return fallback || <div className="loading">Loading...</div>;
  }

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // If not authenticated, render the public element
  return element;
}

export default PublicRoute;
