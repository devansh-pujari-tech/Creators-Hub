# Creators Hub - Full-Stack MERN Application

A complete, production-ready social content platform built with React, Express, and MongoDB. Users can register, login, create posts, edit their own content, delete posts, and interact with a fully functional full-stack application with JWT authentication, authorization, complete CRUD operations, pagination, and comprehensive error handling.

## Features

✅ **User Authentication** - Registration and login with JWT tokens (7-day expiry)
✅ **Persistent Login** - Auth state persists across page refreshes
✅ **Protected Routes** - Frontend and backend route protection
✅ **Password Security** - bcryptjs hashing with salt
✅ **Authorization** - Users can only edit/delete their own posts
✅ **CRUD Operations** - Full Create, Read, Update, Delete functionality
✅ **Post Pagination** - Efficient data loading with configurable page limits
✅ **Toast Notifications** - Real-time user feedback for all operations
✅ **Error Handling** - Centralized backend middleware + frontend try-catch
✅ **Form Validation** - Both client-side and server-side validation
✅ **Responsive Design** - Beautiful, modern UI with gradient backgrounds
✅ **CORS Configuration** - Secure cross-origin requests
✅ **MongoDB Integration** - Persistent data storage with Mongoose ODM

## Tech Stack

### Frontend

- **React 18** - UI library with hooks
- **Vite** - Modern build tool
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **react-toastify** - Toast notifications
- **CSS3** - Modern styling with gradients and animations

### Backend

- **Express.js** - Web framework
- **Node.js** - Runtime environment
- **Mongoose** - MongoDB ODM
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing
- **validator** - Input validation
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration

### Database

- **MongoDB** - NoSQL database (local or MongoDB Atlas)

## Learning Lab

Authenticated users can open `/learning` to run examples for the requested topics:

- Gemini `gemini-2.5-flash` draft generation with prompt constraints and structured JSON output
- JavaScript event-loop ordering and hoisting/temporal-dead-zone behavior
- PostgreSQL primary keys, foreign keys, and an `INNER JOIN`

To start the SQL learning database, run `docker compose up -d`. Set a rotated Google AI Studio key in `backend/.env` as `GEMINI_API_KEY`; never commit that value. The backend uses `POSTGRES_URL` to query the PostgreSQL container while the existing application data remains in MongoDB.

## Project Architecture

```
┌─────────────────────┐
│   React Frontend    │
│  (Port 5173)        │
└──────────┬──────────┘
           │ HTTP/REST
           ▼
┌─────────────────────┐
│  Express Backend    │
│  (Port 3000)        │
└──────────┬──────────┘
           │ Mongoose
           ▼
┌─────────────────────┐
│     MongoDB         │
│  (Local/Atlas)      │
└─────────────────────┘
```

## Validation Rules

### Client-Side (React)

- **Name:** 3+ characters
- **Email:** Valid email format
- **Password:** 8+ characters
- **Confirm Password:** Must match password
- **Post Title:** 3+ characters
- **Post Content:** 10+ characters
- **Pagination:** Page and limit must be positive numbers, limit max 100

### Server-Side (Express)

- All fields required where specified
- Email format validated using validator.js
- Password minimum length enforced (8 characters)
- Password match verified
- Duplicate email check in database
- MongoDB ObjectId validation for post IDs
- Ownership verification for update/delete operations
- Mongoose schema validation

## Complete User Flow

```
1. Register Account
   └─> POST /api/users/register
       └─> User stored in MongoDB

2. Login
   └─> POST /api/users/login
       └─> JWT token generated (7-day expiry)
       └─> Token stored in localStorage

3. Access Protected Routes
   └─> Token attached to Authorization header
   └─> verifyToken middleware validates JWT

4. Create Post
   └─> POST /api/posts (authenticated)
       └─> Post persisted with author reference

5. View Posts
   └─> GET /api/posts (with pagination)
       └─> Returns paginated posts

6. Edit Own Post
   └─> PUT /api/posts/:postId (ownership verified)
       └─> Only author can edit

7. Delete Own Post
   └─> DELETE /api/posts/:postId (ownership verified)
       └─> Only author can delete

8. Logout
   └─> Clear localStorage
       └─> Redirect to login
```

## Environment Configuration

### Backend (.env)

```env
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/creators-hub
PORT=3000
JWT_SECRET=your-secure-jwt-secret-key-change-in-production
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api
```

**Note:** `.env` files are included locally but excluded from version control via `.gitignore`

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas connection string)

### Backend Setup

```bash
cd backend
npm install
# Create .env file with values from the Environment Configuration section
npm run dev
```

Backend runs on `http://localhost:3000`

### Frontend Setup

```bash
cd frontend
npm install
# Create .env file with values from the Environment Configuration section
npm run dev
```

Frontend runs on `http://localhost:5173`

### Quick Start

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend (in new terminal)
cd frontend
npm install
npm run dev

# Open browser to http://localhost:5173
```

## API Endpoints

### Authentication Routes

| Method | Endpoint              | Auth | Description              |
| ------ | --------------------- | ---- | ------------------------ |
| POST   | `/api/users/register` | No   | Register new user        |
| POST   | `/api/users/login`    | No   | Login user, get JWT      |
| GET    | `/api/users/profile`  | Yes  | Get current user profile |

### Post Routes

| Method | Endpoint                      | Auth | Description               |
| ------ | ----------------------------- | ---- | ------------------------- |
| POST   | `/api/posts`                  | Yes  | Create new post           |
| GET    | `/api/posts`                  | Yes  | Get all posts (paginated) |
| GET    | `/api/posts/:postId`          | Yes  | Get single post           |
| PUT    | `/api/posts/:postId`          | Yes  | Update own post           |
| DELETE | `/api/posts/:postId`          | Yes  | Delete own post           |
| GET    | `/api/posts/my-posts/:userId` | Yes  | Get user's own posts      |

### Error Response Format

```json
{
  "success": false,
  "message": "Error description"
}
```

**HTTP Status Codes:**

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate email)
- `500` - Internal Server Error

## Project Structure

```
creators-hub/
├── backend/
│   ├── config/
│   │   └── database.js           # MongoDB connection config
│   ├── middleware/
│   │   ├── auth.js               # JWT verification middleware
│   │   └── errorHandler.js       # Global error handling middleware
│   ├── models/
│   │   ├── User.js               # User schema with password hashing
│   │   └── Post.js               # Post schema with author reference
│   ├── routes/
│   │   ├── users.js              # Auth endpoints (register, login, profile)
│   │   └── posts.js              # CRUD endpoints for posts
│   ├── utils/
│   │   └── asyncHandler.js       # Error wrapper for async routes
│   ├── server.js                 # Express app setup
│   ├── package.json              # Node dependencies
│   ├── .env                      # Environment variables (local only)
│   ├── .env.example              # Template for .env (should exist)
│   └── node_modules/             # Dependencies (gitignored)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginForm.jsx        # Login page
│   │   │   ├── RegistrationForm.jsx # Register page
│   │   │   ├── Dashboard.jsx        # Main dashboard with posts
│   │   │   ├── CreatePost.jsx       # Create new post
│   │   │   ├── EditPost.jsx         # Edit existing post
│   │   │   ├── PostList.jsx         # Display posts with pagination
│   │   │   ├── Header.jsx           # Navigation header
│   │   │   ├── ProtectedRoute.jsx   # Route guard for authenticated users
│   │   │   └── PublicRoute.jsx      # Route guard for unauthenticated users
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global auth state (user, token, login/logout)
│   │   ├── services/
│   │   │   ├── api.js              # Axios instance with interceptors
│   │   │   └── toastService.js     # Toast notification service
│   │   ├── styles/
│   │   │   └── *.css               # Component CSS files
│   │   ├── App.jsx                 # Main app with routes
│   │   ├── main.jsx                # React DOM render
│   │   └── index.css               # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json                # Node dependencies
│   ├── .env                        # Environment variables (local only)
│   └── node_modules/               # Dependencies (gitignored)
│
├── .gitignore                      # Git ignore patterns
├── README.md                       # This file
├── SETUP.md                        # Detailed setup guide
└── .git/                           # Git repository
```

## Error Handling

### Backend Error Architecture

1. **Async Handler Wrapper** - Catches async/await errors
   - File: `backend/utils/asyncHandler.js`
   - Forwards errors to Express error handler

2. **Global Error Middleware** - Centralized error response format
   - File: `backend/middleware/errorHandler.js`
   - Parameter signature: `(err, req, res, next)`
   - Response format: `{ success: false, message: "..." }`
   - Logs errors to console for debugging

3. **Route-Level Validation** - Prevents errors before database queries
   - Input validation
   - Authorization checks (ownership verification)
   - HTTP status codes (400, 401, 403, 404, 409, 500)

### Frontend Error Handling

1. **Axios Interceptors** - Auto-attach JWT, handle 401 responses
   - File: `frontend/src/services/api.js`

2. **Try-Catch Blocks** - Wrapped in all components making API calls
   - Extract error message from `err.response?.data?.message`
   - Fallback to generic message if unavailable

3. **Toast Notifications** - Real-time user feedback
   - File: `frontend/src/services/toastService.js`
   - Types: success (3s), error (4s), warning (3s), info (3s)
   - Position: top-right of screen

## Key Features Explanation

### Authentication Flow

1. User registers → bcryptjs hashes password → stored in MongoDB
2. User logs in → password verified → JWT token generated (7-day expiry)
3. Token stored in browser localStorage
4. On every API request → token attached to Authorization header
5. Backend verifies token → extracts userId → allows request
6. Page refresh → localStorage persists login state

### Authorization (Edit/Delete)

1. User can only edit/delete posts they authored
2. Backend checks: `post.author.toString() === req.user.id`
3. Returns 403 Forbidden if user doesn't own the post
4. Frontend disables edit/delete buttons for other users' posts

### Pagination

- Query params: `?page=1&limit=10`
- Backend calculates: skip = (page - 1) \* limit
- Returns metadata: current page, total pages, has next/previous
- Frontend implements page navigation controls

## Testing the Application

### Test Complete Flow

1. **Register**

   ```
   Email: test@example.com
   Password: TestPass123 (min 8 chars)
   ```

2. **Login**
   - Use registered credentials
   - Verify token stored in localStorage

3. **Create Post**
   - Title: 3+ characters (required)
   - Content: 10+ characters (required)

4. **Edit Post**
   - Navigate to dashboard
   - Click edit button on your post
   - Form pre-fills with existing data
   - Save changes

5. **Delete Post**
   - Click delete button
   - Confirm deletion in modal
   - Post removed from database

6. **Pagination**
   - Create multiple posts (10+)
   - Navigate through pages
   - Verify data updates correctly

7. **Logout**
   - Click logout
   - localStorage cleared
   - Redirected to login
   - Protected routes blocked

## Troubleshooting

### Common Issues

| Issue                       | Solution                              |
| --------------------------- | ------------------------------------- |
| MongoDB connection error    | Ensure MongoDB is running             |
| CORS errors                 | Check CLIENT_URL in backend .env      |
| Module not found            | Run `npm install` in both folders     |
| Port already in use         | Kill process or change PORT in .env   |
| Email already registered    | Use different email for testing       |
| Token expired after logout  | Normal behavior - login again         |
| Posts not loading           | Check network tab, verify backend URL |
| Edit/delete buttons missing | Only show for post owner              |

### Debugging Tips

1. **Check Network Tab** - Browser DevTools → Network to see API responses
2. **Check Console Logs** - Both browser and server terminal
3. **Check localStorage** - DevTools → Application → localStorage to see token
4. **MongoDB Shell** - Access local MongoDB to verify data persistence
5. **Backend Logs** - Watch server terminal for error logs

## Security Best Practices Implemented

✅ **Password Security**

- Hashed with bcryptjs (10 salt rounds)
- Never returned in API responses
- Marked `select: false` in schema

✅ **Authentication**

- JWT tokens with 7-day expiry
- Tokens stored securely in localStorage
- Authorization header validation on every protected request

✅ **Authorization**

- Backend verifies post ownership before edit/delete
- Users can't modify other users' content
- 403 Forbidden response for unauthorized access

✅ **Validation**

- Client-side validation prevents invalid submissions
- Server-side validation ensures data integrity
- Email uniqueness enforced at database level

✅ **Response Security**

- Error messages don't reveal implementation details
- Sensitive data excluded from API responses
- No stack traces exposed to clients

✅ **CORS Protection**

- Only specified origin can access API (CLIENT_URL)
- Credentials included for authenticated requests

## Deployment Considerations

### Before Production

1. **Environment Variables**
   - Update JWT_SECRET to strong random key
   - Use production MongoDB connection (MongoDB Atlas)
   - Update CLIENT_URL to production domain
   - Set NODE_ENV=production on backend

2. **Security**
   - Add rate limiting
   - Implement request logging
   - Add HTTPS configuration
   - Consider auth middleware enhancements

3. **Testing**
   - Run full end-to-end workflow
   - Test all error scenarios
   - Load test with multiple users
   - Cross-browser testing

4. **Monitoring**
   - Set up error tracking (Sentry, etc.)
   - Monitor API response times
   - Track database performance
   - Set up alerts for failures

## Learning Outcomes

By completing this project, you've learned:

✅ Full-stack MERN application development
✅ React component development with hooks
✅ Form validation (client & server)
✅ RESTful API design
✅ Express.js backend development
✅ MongoDB database design
✅ JWT authentication & authorization
✅ Password security and hashing
✅ Centralized error handling
✅ Pagination implementation
✅ CORS configuration
✅ Responsive design
✅ Toast notifications for UX
✅ Protected routes pattern

## Support & Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [JWT Handbook](https://auth0.com/resources/ebooks/jwt-handbook)
- [Mongoose Documentation](https://mongoosejs.com)

## License

This project is available for educational purposes.

---

**Last Updated:** March 26, 2026
