# Low-Level Design (LLD)

## Component and Module Details

### Frontend Components

#### `AuthContext.jsx`

- Provides `AuthProvider` and `useAuth()` hook.
- Stores state: `user`, `token`, `loading`, `isAuthenticated`.
- Exposes methods: `login`, `logout`, `register`, `getAuthHeader()`.
- Persists auth state to `localStorage` and restores on load.

#### `ProtectedRoute.jsx`

- Reads `isAuthenticated` from context.
- If authenticated, renders child route.
- Otherwise, navigates to `/login`.

#### `LoginForm.jsx`

- Captures email and password.
- Calls `login(credentials)` from `useAuth()`.
- Shows error toast when login fails.

#### `RegistrationForm.jsx`

- Captures name, email, password, confirm password.
- Performs client validation.
- Calls register API via AuthContext or service.

#### `Dashboard.jsx`

- Displays user-specific data.
- Shows create/edit post UI or post list.

#### `PostList.jsx`

- Calls post API to fetch posts.
- Displays list of posts with edit/delete actions for owner.

### Backend Modules

#### `server.js`

- Loads environment variables.
- Connects to MongoDB.
- Uses middleware: express.json, cors, error handler.
- Mounts routes under `/api/users` and `/api/posts`.

#### `middleware/auth.js`

- Reads `Authorization` header from request.
- Verifies JWT using `jsonwebtoken` and `JWT_SECRET`.
- Attaches `req.user` on success.
- Returns 401 for invalid or missing tokens.

#### `middleware/errorHandler.js`

- Catches thrown errors.
- Sends structured JSON responses with status code.
- Handles Mongoose validation errors, duplicate keys, and generic errors.

#### `routes/users.js`

- `POST /register` validates inputs and creates a user.
- `POST /login` validates credentials and issues JWT.
- Uses bcrypt to verify passwords.
- Returns token and user profile.

#### `routes/posts.js`

- `GET /` returns public or paginated post list.
- `POST /` creates a new post for authenticated user.
- `PUT /:postId` updates a post if owner matches `req.user.id`.
- `DELETE /:postId` removes a post if owner matches.
- All mutating routes use `auth` middleware.

### Data Models

#### `User` schema

- Fields: `name`, `email`, `password`.
- `email` is unique.
- `password` hashed and never returned by default.
- Validation: required fields, length constraints, email format.

#### `Post` schema

- Fields: `title`, `content`, `author`, `createdAt`, `updatedAt`.
- `author` references `User`.
- Validation: title and content required.

## API Contracts

### Auth APIs

`POST /api/users/register`

- Request body: `{ name, email, password, confirmPassword }`
- Responses:
  - `201 Created` with user summary
  - `400 Bad Request` for validation errors
  - `409 Conflict` if email already exists

`POST /api/users/login`

- Request body: `{ email, password }`
- Responses:
  - `200 OK` with `{ token, user }`
  - `401 Unauthorized` for invalid credentials

### Post APIs

`GET /api/posts`

- Returns array of posts.

`POST /api/posts`

- Requires Authorization header: `Bearer <token>`.
- Request body: `{ title, content }`
- Success: `201 Created` with new post.

`PUT /api/posts/:postId`

- Requires auth.
- Only post creator can update.
- Request body: `{ title, content }`
- Success: `200 OK` with updated post.

`DELETE /api/posts/:postId`

- Requires auth.
- Only post creator can delete.
- Success: `200 OK` with deletion message.

## Error Handling

### Frontend

- Show toast notifications for API errors.
- Validate forms before submission.
- Redirect unauthorized users to login.

### Backend

- Return JSON error body with `message`.
- Use 401 for missing/invalid token.
- Use 403 for forbidden operations.
- Use 404 for missing resource IDs.
- Use 500 for server or unexpected errors.

## State Management

- AuthContext stores global authentication state.
- Components consume auth state via `useAuth()`.
- `localStorage` persists JWT and user info.
- Logout clears context and storage.

## Deployment Notes

- Frontend environment variable: `VITE_API_URL`.
- Backend environment variables: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`.
- In production, use HTTPS and secure cookie/storage best practices.
