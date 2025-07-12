# Skill Swap API Documentation

## Authentication Endpoints

### Base URL
```
http://localhost:5000/api/auth
```

### 1. User Registration
**POST** `/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "location": "New York, NY",
  "skillsOffered": ["JavaScript", "React", "Node.js"],
  "skillsWanted": ["Python", "Machine Learning"],
  "availability": "available"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d0fe4f5311236168a109ca",
    "name": "John Doe",
    "email": "john@example.com",
    "location": "New York, NY",
    "skillsOffered": ["JavaScript", "React", "Node.js"],
    "skillsWanted": ["Python", "Machine Learning"],
    "availability": "available",
    "isPublic": true,
    "role": "user",
    "createdAt": "2021-06-21T17:16:47.000Z",
    "updatedAt": "2021-06-21T17:16:47.000Z"
  }
}
```

### 2. User Login
**POST** `/login`

Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d0fe4f5311236168a109ca",
    "name": "John Doe",
    "email": "john@example.com",
    "location": "New York, NY",
    "skillsOffered": ["JavaScript", "React", "Node.js"],
    "skillsWanted": ["Python", "Machine Learning"],
    "availability": "available",
    "isPublic": true,
    "role": "user"
  }
}
```

### 3. Get Current User Profile
**GET** `/me`

Get the current authenticated user's profile.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "user": {
    "_id": "60d0fe4f5311236168a109ca",
    "name": "John Doe",
    "email": "john@example.com",
    "location": "New York, NY",
    "skillsOffered": ["JavaScript", "React", "Node.js"],
    "skillsWanted": ["Python", "Machine Learning"],
    "availability": "available",
    "isPublic": true,
    "role": "user"
  }
}
```

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Name is required", "Password must be at least 6 characters"]
}
```

### Authentication Error (401)
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Server error during registration"
}
```

## User Schema Fields

- **name**: String (required, max 50 characters)
- **email**: String (required, unique, validated email format)
- **password**: String (required, min 6 characters, automatically hashed)
- **location**: String (optional, max 100 characters)
- **profilePhoto**: String (optional, URL to photo)
- **skillsOffered**: Array of Strings (skills user can teach)
- **skillsWanted**: Array of Strings (skills user wants to learn)
- **availability**: Enum ['available', 'busy', 'unavailable'] (default: 'available')
- **isPublic**: Boolean (default: true, whether profile is visible to others)
- **role**: Enum ['user', 'admin'] (default: 'user')

## Testing with curl

### Register a new user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "skillsOffered": ["JavaScript", "React"],
    "skillsWanted": ["Python"]
  }'
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get profile (replace TOKEN with actual JWT):
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```
