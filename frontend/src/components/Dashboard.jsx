import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, loading } = useAuth();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-navbar">
        <div className="navbar-brand">
          <h1>Creators Hub</h1>
        </div>
        <div className="navbar-menu">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome back, {user?.name}!</h2>
          <p>You have successfully logged in to your account.</p>
        </div>

        <div className="user-info-card">
          <h3>Your Account Information</h3>
          <div className="info-block">
            <div className="info-item">
              <label>Name:</label>
              <span>{user?.name}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{user?.email}</span>
            </div>
            <div className="info-item">
              <label>User ID:</label>
              <span>{user?._id}</span>
            </div>
          </div>
        </div>

        <div className="session-info-card">
          <h3>Session Information</h3>
          <p>
            Your session is now active. You will remain logged in until
            you log out or your session expires.
          </p>
          <div className="session-status">
            <span className="status-badge">● Active</span>
            <p>Last login: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
