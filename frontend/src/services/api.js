import axios from "axios";

// Create Axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Read JWT token from localStorage
    const token = localStorage.getItem("token");

    // Attach token to Authorization header if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  },
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    // Return response data for successful requests
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Clear authentication data from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Dispatch custom event to notify AuthContext
      window.dispatchEvent(new Event("authTokenExpired"));

      // Redirect to login page
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

// Export API helper methods
export const postAPI = {
  // Create a new post
  createPost: (title, content) => api.post("/posts", { title, content }),

  // Get all posts with pagination
  getAllPosts: (page = 1, limit = 10) =>
    api.get("/posts", {
      params: { page, limit },
    }),

  // Get user's own posts
  getUserPosts: (userId, page = 1, limit = 10) =>
    api.get(`/posts/my-posts/${userId}`, {
      params: { page, limit },
    }),

  // Get a single post by ID
  getPostById: (postId) => api.get(`/posts/${postId}`),

  // Update a post
  updatePost: (postId, title, content) =>
    api.put(`/posts/${postId}`, { title, content }),

  // Delete a post
  deletePost: (postId) => api.delete(`/posts/${postId}`),
};

export default api;
