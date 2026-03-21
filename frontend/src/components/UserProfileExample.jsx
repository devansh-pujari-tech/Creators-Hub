import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../styles/UserProfileExample.css";

/**
 * UserProfileExample Component - Shows how to make authenticated API calls
 * 
 * This component demonstrates:
 * 1. Using the centralized api.js utility for authenticated requests
 * 2. Authorization header is automatically added by interceptor
 * 3. 401 errors are automatically handled by interceptor
 * 4. Handling loading and error states
 * 5. Making authenticated API calls with useEffect
 * 
 * This is an EXAMPLE component. Copy this pattern for your own components.
 */
function UserProfileExample() {
  const { user, token } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Example: Fetch additional user data from protected endpoint
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) return; // Don't fetch if no token

      setLoading(true);
      setError(null);

      try {
        // ✓ Using centralized api utility
        // Authorization header is automatically added by interceptor!
        const response = await api.get("/users/profile");

        setProfileData(response.data.user);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.message || err.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]); // Re-fetch if token changes

  return (
    <div className="user-profile-example">
      <h2>User Profile</h2>

      {/* Display current user from context */}
      <div className="profile-section">
        <h3>Current User (from Context)</h3>
        {user ? (
          <div className="info-block">
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>User ID:</strong> {user._id}
            </p>
          </div>
        ) : (
          <p>No user data available</p>
        )}
      </div>

      {/* Display additional profile data from API */}
      <div className="profile-section">
        <h3>Additional Profile Data</h3>
        {loading && <p className="loading">Loading profile data...</p>}
        {error && <p className="error">Error: {error}</p>}
        {profileData && (
          <div className="info-block">
            <p>
              <strong>Bio:</strong> {profileData.bio || "Not set"}
            </p>
            <p>
              <strong>Phone:</strong> {profileData.phone || "Not set"}
            </p>
            <p>
              <strong>Location:</strong> {profileData.location || "Not set"}
            </p>
          </div>
        )}
      </div>

      {/* Tips section */}
      <div className="tips-section">
        <h3>How This Component Works</h3>
        <ul>
          <li>
            Uses <code>useAuth()</code> to get user and token
          </li>
          <li>
            Uses centralized <code>api.js</code> utility for authenticated requests
          </li>
          <li>
            Authorization header is automatically added by the request interceptor
          </li>
          <li>
            401 errors are automatically handled by response interceptor (auto-logout)
          </li>
          <li>Handles loading, error, and success states</li>
          <li>No manual token handling needed - the interceptor handles it!</li>
        </ul>
      </div>
    </div>
  );
}

export default UserProfileExample;
