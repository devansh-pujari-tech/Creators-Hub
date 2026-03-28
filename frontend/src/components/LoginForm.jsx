import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toastService from "../services/toastService";
import "../styles/LoginForm.css";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    if (!email || !password) {
      const msg = "Email and password are required";
      setError(msg);
      toastService.warning(msg);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const msg = "Please enter a valid email address";
      setError(msg);
      toastService.warning(msg);
      return false;
    }

    if (password.length < 8) {
      const msg = "Password must be at least 8 characters long";
      setError(msg);
      toastService.warning(msg);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        toastService.success("Login successful! Welcome back!");
        navigate("/dashboard");
      } else {
        setError(result.message);
        toastService.error(result.message);
      }
    } catch (err) {
      const errorMessage = "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      toastService.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login to Your Account</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="signup-link">
          Don't have an account?{" "}
          <Link to="/register">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
