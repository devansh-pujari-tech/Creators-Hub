import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/UserProfileExample.css";

/**
 * UserProfileExample Component - Shows how to make authenticated API calls
 * 
 * This component demonstrates:
 * 1. Using getAuthHeader() to get Authorization header
 * 2. Using token from context for API authentication
 * 3. Handling loading and error states
 * 4. Making authenticated API calls with useEffect
 * 
 * This is an EXAMPLE component. Copy this pattern for your own components.
 */
function UserProfileExample() {
  const { user, getAuthHeader, token } = useAuth();
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
        // ✓ Using getAuthHeader() helper to get Authorization header
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/users/profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeader(), // Includes Authorization: Bearer {token}
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Session expired. Please login again.");
          }
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token, getAuthHeader]); // Re-fetch if token changes

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
            Uses <code>useAuth()</code> to get user, token, and getAuthHeader
          </li>
          <li>
            Automatically refetches when token changes using useEffect dependency
          </li>
          <li>
            Uses <code>getAuthHeader()</code> to add Authorization header to API
            call
          </li>
          <li>Handles loading, error, and success states</li>
          <li>No props needed - everything from context!</li>
        </ul>
      </div>
    </div>
  );
}

export default UserProfileExample;
