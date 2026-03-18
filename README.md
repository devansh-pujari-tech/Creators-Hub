# User Registration System

A complete, production-ready user registration system built with React, Express, and MongoDB.

## Features

✅ **User Registration Form** - Beautiful, responsive registration interface
✅ **Client-Side Validation** - Real-time input validation with clear error messages
✅ **Server-Side Validation** - Double validation for security
✅ **Password Hashing** - Secure bcryptjs password encryption with salt
✅ **Duplicate Prevention** - Email uniqueness enforcement
✅ **Loading States** - Visual feedback during API calls
✅ **Success/Error Messages** - Clear user communication
✅ **CORS Configuration** - Secure cross-origin requests
✅ **MongoDB Integration** - Persistent data storage with Mongoose ODM

## Tech Stack

### Frontend

- **React 18** - UI library with hooks
- **Vite** - Modern build tool
- **CSS3** - Modern styling with gradients and animations

### Backend

- **Express.js** - Web framework
- **Node.js** - Runtime environment
- **Mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **validator** - Input validation
- **CORS** - Cross-origin resource sharing

### Database

- **MongoDB** - NoSQL database

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

### Client-Side

- Name: 3+ characters
- Email: Valid email format
- Password: 8+ characters
- Confirm Password: Must match password

### Server-Side

- All fields required
- Email format validated
- Password minimum length enforced
- Password match verified
- Duplicate email check
- Mongoose schema validation

## API Endpoint

### POST /api/users/register

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response Examples:**

- `400` - Missing fields, validation error
- `409` - Email already registered
- `500` - Server error

## Installation & Setup

See [SETUP.md](./SETUP.md) for detailed installation and testing instructions.

### Quick Start

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

## File Structure

```
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   └── User.js              # User schema
│   ├── routes/
│   │   └── users.js             # API endpoints
│   ├── server.js                # Express server
│   ├── package.json
│   ├── .env
│   └── node_modules/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── RegistrationForm.jsx
│   │   ├── styles/
│   │   │   └── RegistrationForm.css
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── node_modules/
│
├── SETUP.md                     # Setup & testing guide
└── README.md                    # This file
```

## Key Features Explained

### 1. Form State Management

Uses React `useState` hook to manage form inputs and display states:

- Form data (name, email, password, confirmPassword)
- Validation errors per field
- Loading state during API call
- Success message after registration
- Error message for failures

### 2. Real-Time Validation

- Errors clear as user types
- Prevents invalid form submission
- Clear, contextual error messages
- Field highlighting on error

### 3. Password Security

- Passwords hashed with bcryptjs (10 salt rounds)
- Salted and hashed in database (never stored as plain text)
- Never returned in API responses
- MongoDB field marked `select: false`

### 4. API Integration

- Relative URL paths (no hardcoded URLs)
- Proper HTTP method (POST)
- Content-Type header
- Proper error handling

### 5. Responsive Design

- Works on desktop, tablet, mobile
- Gradient background
- Card-based layout
- Touch-friendly buttons

## Security Best Practices

✅ Password hashing with bcryptjs
✅ Server-side validation
✅ CORS protection
✅ Email uniqueness enforcement
✅ No sensitive data in error messages
✅ Secure password field (select: false)
✅ Input sanitization

## Environment Variables

**Backend (.env):**

```
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/creators-hub
PORT=3000
```

**Frontend:** Uses relative API paths

## Potential Enhancements

- Email verification
- Password strength meter
- Rate limiting
- JWT authentication
- Login functionality
- Profile management
- OAuth integration
- Two-factor authentication

## Troubleshooting

Refer to [SETUP.md](./SETUP.md) for detailed troubleshooting guide.

## Common Issues

| Issue                    | Solution                           |
| ------------------------ | ---------------------------------- |
| MongoDB connection error | Ensure MongoDB is running          |
| CORS errors              | Check CLIENT_URL in .env           |
| Module not found         | Run `npm install`                  |
| Port already in use      | Kill process or change PORT        |
| Email already registered | Use different email or delete user |

## Learning Outcomes

By completing this project, you've learned:

✅ React component development with hooks
✅ Form validation (client & server)
✅ RESTful API design
✅ Express.js backend development
✅ MongoDB database design
✅ Password security and hashing
✅ CORS configuration
✅ HTTP error handling
✅ Responsive design
✅ Git and version control

## License

This project is open source and available under the MIT License.

## Support

For questions or issues:

1. Check [SETUP.md](./SETUP.md) troubleshooting section
2. Review console logs (F12 in browser)
3. Check backend console for API errors
4. Verify MongoDB connection

---

**Version:** 1.0.0
**Created:** 2024
**Last Updated:** 2024
