# High-Level Design (HHD)

## Overview

Creators Hub is a full-stack MERN-style application with a React frontend and an Express backend. The system centers on JWT-based authentication, protected frontend routes, and secure CRUD post operations.

## Architecture

### Frontend

- React with Vite for development and build.
- React Router for client-side navigation.
- React Context API for global authentication state.
- Axios for API requests.
- Toast notifications for user feedback.

### Backend

- Express server exposes RESTful API endpoints.
- MongoDB stores users and posts.
- JWT tokens authenticate and authorize requests.
- Middleware handles authentication and error management.

### Data Flow

1. User registers or logs in on the React app.
2. Frontend sends credentials to backend API.
3. Backend validates input, authenticates, and returns JWT + user data.
4. Frontend stores token locally and updates AuthContext.
5. Protected pages request data with Authorization header.
6. Backend verifies token and responds to authorized requests.

## System Components

### 1. Authentication Layer

- `frontend/src/context/AuthContext.jsx` maintains `user`, `token`, and `isAuthenticated`.
- `backend/middleware/auth.js` validates JWT token from request headers.

### 2. Routing Layer

- `frontend/src/components/ProtectedRoute.jsx` only renders child routes when authenticated.
- React Router defines public and protected routes in `App.jsx`.

### 3. API Layer

- `backend/routes/users.js` handles `/api/users/register` and `/api/users/login`.
- `backend/routes/posts.js` handles post CRUD operations with authorization checks.

### 4. Data Layer

- `backend/models/User.js` defines user schema and validation rules.
- `backend/models/Post.js` defines post schema with author reference.

## Major Flows

### Authentication Flow

- Login/register -> backend issues JWT -> frontend stores JWT -> AuthProvider enables secure actions.

### Protected Route Flow

- AuthProvider checks `isAuthenticated`.
- `ProtectedRoute` redirects unauthorized users to `/login`.
- Authenticated users access secure pages.

### CRUD Flow

- Authenticated user submits post form.
- Frontend sends request to backend with JWT.
- Backend checks token, author ownership, then performs DB operation.

## Security Considerations

- JWT stored in localStorage for persistence.
- Passwords hashed with bcrypt.
- Backend denies unauthenticated requests with 401.
- Ownership-check middleware denies unauthorized updates with 403.

## Deployment Considerations

- Backend and frontend run separately for development.
- Environment variables configure API URL and MongoDB connection.
- Production deployment should use secure JWT secrets and HTTPS
