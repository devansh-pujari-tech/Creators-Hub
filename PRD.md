# Product Requirements Document (PRD)

## Project Name

Creators Hub - JWT Authentication and Protected Routing

## Purpose

Enable a full-stack authentication flow for Creators Hub where users can register, log in, create posts, edit their own posts, and securely access protected views.

## Goals

- Build a secure authentication system using JWT.
- Provide persistent login across browser refresh.
- Protect UI routes and backend API resources.
- Allow users to create, view, edit, and delete their own posts.
- Deliver clear developer documentation and a working end-to-end demo.

## Scope

### In scope

- User registration with validation
- User login and JWT issuance
- Persistent authentication state in frontend
- Protected React routes
- Secure backend routes with JWT validation
- CRUD operations for posts
- Role-based ownership enforcement for editing and deleting posts
- Error handling and toast notifications

### Out of scope

- Social media integration
- Real-time collaboration or WebSocket messaging
- Admin dashboards or multi-role management beyond basic ownership

## User Stories

1. As a visitor, I want to register an account so I can use the app.
2. As a user, I want to log in with email and password so I can access secure pages.
3. As a logged-in user, I want my session to persist after refreshing the page.
4. As an authenticated user, I want to create a post so I can publish content.
5. As a post owner, I want to edit my own post.
6. As a post owner, I want to delete my own post.
7. As a visitor, I want to be redirected to login when I try to access protected pages.

## Functional Requirements

- Registration form accepts name, email, password, and confirm password.
- Login form accepts email and password.
- Successful login returns a JWT and user payload.
- Token is stored securely in localStorage.
- Auth state is exposed through React Context.
- ProtectedRoute component blocks unauthorized users.
- Backend verifies JWT on protected endpoints.
- Posts endpoint supports create, read, update, and delete operations.
- Only the original author can update or delete their post.

## Non-functional Requirements

- Frontend built with React and Vite.
- Backend built with Express and MongoDB.
- Passwords hashed using bcrypt.
- API and client should handle validation errors gracefully.
- Application should be responsive and user-friendly.

## Acceptance Criteria

- User can register and see a confirmation or error message.
- User can log in and navigate to protected pages.
- Refreshing the browser keeps the user logged in.
- Unauthorized access to protected route redirects to login.
- Users can create and list posts.
- Users can only edit/delete their own posts.
- Backend rejects unauthorized API calls with 401 or 403.

## Success Metrics

- End-to-end user login and protected route flow works.
- No frontend console errors during authentication and routing.
- Backend securely validates JWT and protects endpoints.
- Post ownership checks prevent unauthorized changes.
