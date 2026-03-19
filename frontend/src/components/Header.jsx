import { useAuth } from "../context/AuthContext";
import "../styles/Header.css";

/**
 * Header Component - Example of using useAuth hook
 * 
 * This component demonstrates:
 * 1. Getting user data from context (no props needed)
 * 2. Getting authentication status
 * 3. Accessing methods from context
 * 4. Responsive design
 * 
 * No prop drilling! This component gets everything from useAuth()
 */
function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo / Brand */}
        <div className="header-brand">
          <h1>Creators Hub</h1>
        </div>

        {/* Navigation */}
        <nav className="header-nav">
          {isAuthenticated ? (
            <>
              {/* User is logged in - show user menu */}
              <span className="user-name">👤 {user?.name}</span>
              <button className="logout-link" onClick={() => logout()}>
                Logout
              </button>
            </>
          ) : (
            <>
              {/* User is not logged in - show login link */}
              <a href="/login" className="nav-link">
                Login
              </a>
              <a href="/register" className="nav-link primary">
                Sign Up
              </a>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
