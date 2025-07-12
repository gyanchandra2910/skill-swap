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

### Authentication Tests

#### Register a new user:
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

#### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Get profile (replace TOKEN with actual JWT):
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### User Search Tests

#### Search users by skill:
```bash
curl -X GET "http://localhost:5000/api/users/search?skill=Python&page=1&limit=5"
```

#### Search users by location:
```bash
curl -X GET "http://localhost:5000/api/users/search?location=New%20York"
```

### Swap Request Tests

#### Send a swap request:
```bash
curl -X POST http://localhost:5000/api/swaps/request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "toUserId": "60d0fe4f5311236168a109cb",
    "message": "I would love to learn Python from you in exchange for teaching React!"
  }'
```

#### Get all swap requests:
```bash
curl -X GET http://localhost:5000/api/swaps \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

#### Accept a swap request (replace SWAP_ID):
```bash
curl -X PUT http://localhost:5000/api/swaps/SWAP_ID/accept \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

#### Reject a swap request (replace SWAP_ID):
```bash
curl -X PUT http://localhost:5000/api/swaps/SWAP_ID/reject \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Feedback Tests

#### Submit feedback:
```bash
curl -X POST http://localhost:5000/api/feedback \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "toUserId": "60d0fe4f5311236168a109cb",
    "swapId": "60d0fe4f5311236168a109cc",
    "rating": 5,
    "comment": "Excellent teacher! Very patient and knowledgeable about Python."
  }'
```

#### Get feedback for a user:
```bash
curl -X GET http://localhost:5000/api/feedback/60d0fe4f5311236168a109cb
```

#### Update feedback (replace FEEDBACK_ID):
```bash
curl -X PUT http://localhost:5000/api/feedback/FEEDBACK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "rating": 4,
    "comment": "Good teacher, very helpful."
  }'
```

#### Delete feedback (replace FEEDBACK_ID):
```bash
curl -X DELETE http://localhost:5000/api/feedback/FEEDBACK_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Swap Request Endpoints

### Base URL
```
http://localhost:5000/api/swaps
```

### 1. Send Swap Request
**POST** `/request`

Send a skill swap request to another user.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Request Body:**
```json
{
  "toUserId": "60d0fe4f5311236168a109cb",
  "message": "I'd love to learn Python from you in exchange for teaching you React!"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Swap request sent successfully",
  "swapRequest": {
    "_id": "60d0fe4f5311236168a109cc",
    "fromUserId": "60d0fe4f5311236168a109ca",
    "toUserId": "60d0fe4f5311236168a109cb",
    "message": "I'd love to learn Python from you in exchange for teaching you React!",
    "status": "pending",
    "createdAt": "2021-06-21T17:20:00.000Z"
  }
}
```

### 2. Get Swap Requests
**GET** `/`

Get all swap requests for the authenticated user (both incoming and outgoing).

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "incoming": [
    {
      "_id": "60d0fe4f5311236168a109cc",
      "fromUserId": {
        "_id": "60d0fe4f5311236168a109ca",
        "name": "John Doe",
        "email": "john@example.com",
        "skillsOffered": ["JavaScript", "React"]
      },
      "toUserId": "60d0fe4f5311236168a109cb",
      "message": "I'd love to learn Python from you!",
      "status": "pending",
      "createdAt": "2021-06-21T17:20:00.000Z"
    }
  ],
  "outgoing": [
    {
      "_id": "60d0fe4f5311236168a109cd",
      "fromUserId": "60d0fe4f5311236168a109cb",
      "toUserId": {
        "_id": "60d0fe4f5311236168a109ce",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "skillsOffered": ["Machine Learning", "Data Science"]
      },
      "message": "Would you like to exchange skills?",
      "status": "pending",
      "createdAt": "2021-06-21T17:25:00.000Z"
    }
  ]
}
```

### 3. Accept Swap Request
**PUT** `/:id/accept`

Accept an incoming swap request.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Swap request accepted",
  "swapRequest": {
    "_id": "60d0fe4f5311236168a109cc",
    "fromUserId": "60d0fe4f5311236168a109ca",
    "toUserId": "60d0fe4f5311236168a109cb",
    "message": "I'd love to learn Python from you!",
    "status": "accepted",
    "updatedAt": "2021-06-21T17:30:00.000Z"
  }
}
```

### 4. Reject Swap Request
**PUT** `/:id/reject`

Reject an incoming swap request.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Swap request rejected",
  "swapRequest": {
    "_id": "60d0fe4f5311236168a109cc",
    "fromUserId": "60d0fe4f5311236168a109ca",
    "toUserId": "60d0fe4f5311236168a109cb",
    "message": "I'd love to learn Python from you!",
    "status": "rejected",
    "updatedAt": "2021-06-21T17:35:00.000Z"
  }
}
```

## Feedback Endpoints

### Base URL
```
http://localhost:5000/api/feedback
```

### 1. Submit Feedback
**POST** `/`

Submit feedback for a completed skill swap.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Request Body:**
```json
{
  "toUserId": "60d0fe4f5311236168a109cb",
  "swapId": "60d0fe4f5311236168a109cc",
  "rating": 5,
  "comment": "Excellent teacher! Very patient and knowledgeable about Python. Would definitely recommend!"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Feedback submitted successfully",
  "feedback": {
    "_id": "60d0fe4f5311236168a109cd",
    "fromUserId": "60d0fe4f5311236168a109ca",
    "toUserId": "60d0fe4f5311236168a109cb",
    "swapId": "60d0fe4f5311236168a109cc",
    "rating": 5,
    "comment": "Excellent teacher! Very patient and knowledgeable about Python. Would definitely recommend!",
    "createdAt": "2021-06-21T18:00:00.000Z"
  }
}
```

### 2. Get User Feedback
**GET** `/:userId`

Get all feedback/reviews for a specific user.

**Response (Success - 200):**
```json
{
  "success": true,
  "feedback": [
    {
      "_id": "60d0fe4f5311236168a109cd",
      "fromUserId": {
        "_id": "60d0fe4f5311236168a109ca",
        "name": "John Doe",
        "profilePhoto": "https://example.com/photo.jpg"
      },
      "toUserId": "60d0fe4f5311236168a109cb",
      "swapId": "60d0fe4f5311236168a109cc",
      "rating": 5,
      "comment": "Excellent teacher! Very patient and knowledgeable about Python.",
      "createdAt": "2021-06-21T18:00:00.000Z"
    }
  ],
  "averageRating": 4.8,
  "totalReviews": 12
}
```

### 3. Update Feedback
**PUT** `/:id`

Update your own feedback (only allowed by the feedback author).

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Request Body:**
```json
{
  "rating": 4,
  "comment": "Good teacher, very helpful with Python basics."
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Feedback updated successfully",
  "feedback": {
    "_id": "60d0fe4f5311236168a109cd",
    "fromUserId": "60d0fe4f5311236168a109ca",
    "toUserId": "60d0fe4f5311236168a109cb",
    "swapId": "60d0fe4f5311236168a109cc",
    "rating": 4,
    "comment": "Good teacher, very helpful with Python basics.",
    "updatedAt": "2021-06-21T18:30:00.000Z"
  }
}
```

### 4. Delete Feedback
**DELETE** `/:id`

Delete your own feedback (only allowed by the feedback author).

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Feedback deleted successfully"
}
```

## User Search Endpoints

### Base URL
```
http://localhost:5000/api/users
```

### 1. Search Users
**GET** `/search`

Search for users by skills, location, or name.

**Query Parameters:**
- `skill` (optional): Skill to search for
- `location` (optional): Location to filter by
- `name` (optional): Name to search for
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10)

**Example:**
```
GET /api/users/search?skill=Python&location=New York&page=1&limit=5
```

**Response (Success - 200):**
```json
{
  "success": true,
  "users": [
    {
      "_id": "60d0fe4f5311236168a109cb",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "location": "New York, NY",
      "skillsOffered": ["Python", "Machine Learning", "Data Science"],
      "skillsWanted": ["JavaScript", "React"],
      "availability": "available",
      "profilePhoto": "https://example.com/jane.jpg"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalUsers": 15,
    "limit": 5
  }
}
```

## Schema Definitions

### SwapRequest Schema
- **fromUserId**: ObjectId (required, references User)
- **toUserId**: ObjectId (required, references User)
- **message**: String (optional, max 500 characters)
- **status**: Enum ['pending', 'accepted', 'rejected'] (default: 'pending')
- **createdAt**: Date (auto-generated)
- **updatedAt**: Date (auto-generated)

### Feedback Schema
- **fromUserId**: ObjectId (required, references User who gives feedback)
- **toUserId**: ObjectId (required, references User who receives feedback)
- **swapId**: ObjectId (required, references SwapRequest)
- **rating**: Number (required, 1-5 stars)
- **comment**: String (optional, max 1000 characters)
- **createdAt**: Date (auto-generated)
- **updatedAt**: Date (auto-generated)

## Real-time Notifications

The application includes Socket.io integration for real-time notifications:

### Events Emitted to Users:
- `swapRequestReceived`: When a user receives a new swap request
- `swapRequestAccepted`: When a user's outgoing swap request is accepted
- `swapRequestRejected`: When a user's outgoing swap request is rejected
- `feedbackReceived`: When a user receives new feedback

### Client-side Integration:
Users are automatically joined to rooms based on their user ID, enabling targeted real-time notifications.
