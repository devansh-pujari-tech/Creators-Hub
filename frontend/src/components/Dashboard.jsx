import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PostList from "./PostList";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [refreshPosts, setRefreshPosts] = useState(false);

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

  const handleCreatePostClick = () => {
    navigate("/create-post");
  };

  const handlePostCreated = () => {
    // Trigger a post refresh
    setRefreshPosts((prev) => !prev);
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
          <h1>🎨 Creators Hub</h1>
        </div>
        <div className="navbar-menu">
          <button onClick={handleCreatePostClick} className="create-post-btn">
            ✏️ Create Post
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome back, {user?.name}! 👋</h2>
          <p>Ready to share your next creation?</p>
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

        {/* Posts Section */}
        <div className="posts-section">
          <PostList key={refreshPosts} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
