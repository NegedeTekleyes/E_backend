# API Routes for e-self Backend

Base URL: `http://localhost:5000`

## Auth Routes
-Protected endpoints (/auth/me, /auth/logout) require a JWT token from POST /auth/login.
-Include the token in the Authorization header:

 **POST /auth/register
Register a new user (instructor, student, or admin).
 Body: {
    {
  "email": "string",
  "password": "string",
  "name": "string",
  "phone": "string",
  "role": "ADMIN" | "INSTRUCTOR" | "STUDENT"
}
Response: {
    {
  "id": 1,
  "email": "user@example.com",
  "name": "User Name",
  "phone": "+25191234567809",
  "role": "INSTRUCTOR",
  "isVerified": false,
  "createdAt": "2025-04-07T12:00:00Z",
  "updatedAt": "2025-04-07T12:00:00Z"
}
Description: Creates a new user. After registration, the user must verify their email using GET /auth/verify.
}
POST /auth/login
Log in a user and get authentication tokens.
Body: {
    {
  "emailOrPhone": "string",
  "password": "string"
}
}
Response:{
    {
  "access_token": "jwt-string",
  "refresh_token": "jwt-string",
  
}
Description: Authenticates a user and returns tokens for protected routes. Use access_token in the Authorization header.
}

GET /auth/verify
Verify a user’s email with a token.

Query Params:
token: string (required)
Response:{
    {
  "message": "Email verified successfully"
}
}
Description: Verifies a user’s email using access-token after registering to login verify it first.

GET /auth/me
Get the current authenticated user’s details.

Headers: Authorization: Bearer <token>
Response:{
    {
  "id": 1,
  "email": "user@example.com",
  "name": "User Name",
  "phone": "1234567890",
  "role": "INSTRUCTOR",
  "isVerified": true
}
}
Description: Returns the logged-in user’s info, protected by JWT authentication.

POST /auth/logout
Log out the current user.

Headers: Authorization: Bearer <token>
Response:{
  "message": "Logged out successfully"
}
Description: Invalidates the user’s refresh token, ending their session. Requires JWT authentication.
 }

## How to Use
1.Register a User:
Send POST /auth/register with user details.
2.Check email for verification token.
Verify Email:
Use GET /auth/verify?token=<token> to activate the account.
3.Log In:
Send POST /auth/login to get tokens.
Store access_token in localStorage (e.g., localStorage.setItem('access_token', response.access_token)).
Access Protected Routes:
Include Authorization: Bearer <access_token> in headers for GET /auth/me and POST /auth/logout.
4.Log Out:
Call POST /auth/logout to end the session.
## sample example how can use it 
// Login
fetch('http://localhost:5000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ emailOrPhone: 'user@example.com', password: 'pass123' }),
})
  .then(res => res.json())
  .then(data => localStorage.setItem('access_token', data.access_token));

// Get Current User
fetch('http://localhost:5000/auth/me', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
})
  .then(res => res.json())
  .then(user => console.log(user));




- **POST /auth/register**
  - Body: `{ "email": string, "password": string 
   "phone": string,
   "name": string,
  - }`
  - Description Register a user.
  - Response: `{ "access_token": string, "refresh_token": string, "role": string }`
  - Description: Log in a user.
- **POST /auth/login**
  - Body: `{ "emailOrPhone": string, "password": string }`
  - Response: `{ "access_token": string, "refresh_token": string, "role": string }`
  - Description: Log in a user.

## User Routes
- **POST /users**
  - Headers: `Authorization: Bearer <token>`
  - Body: {
  "email": "string",
  "password": "string",
  "role": "ADMIN" | "INSTRUCTOR" | "STUDENT",
  "name": "string",
  "phone": "string"
}
  - Response: {
  "id": 1,
  "email": "nege@gmail.com",
  "role": "INSTRUCTOR",
  "name": "New User",
  "phone": "+251941416515",
  "createdAt": "2025-04-07T12:00:00Z",
  "updatedAt": "2025-04-07T12:00:00Z"
}
  - Description: Create a user (Admin only).
- **GET /users**
  -Headers: `Authorization: Bearer <token>`
  - Response: Array of users 
  - Description: Get all users (Admin only).
- **GET /users/:id**
  - Headers: `Authorization: Bearer <token>`
  - Response: User object
  - Description: Get a user by ID.
- **PATCH/user/:id
 - Headers: `Authorization: Bearer <token>`
  - Response: Array of updated users
  - Body:{
  "name": "Negede"
  
   }
     - Response: {
  "id": 1,
  "email": "nege@gmail.com",
  "role": "INSTRUCTOR",
  "name": "Negede",
  "phone": "+251941416515",
  "createdAt": "2025-04-07T12:00:00Z",
  "updatedAt": "2025-04-07T12:00:00Z"
}
- **DELETE/user/:id
 - Headers: `Authorization: Bearer <token>`
  - Response: Array of  users deleted
## How to Use
1.Log In:
Use POST /auth/login to get a token.
2.Create a User:
Send POST /users with an admin token.
3.View Users:
Use GET /users (admin) or GET /users/:id (self or admin).
4.Update/Delete:
Use PATCH /users/:id or DELETE /users/:id with appropriate permissions.


## Course Routes
- **POST /course**
  - Headers: `Authorization: Bearer <token>`
  - Body: See `create-course.dto.ts` (title, category, level, etc.)
  - Response: Course object with sections
  - Description: Create a course (Instructor only).




  -  ## To start the backend 
  - npm run start:dev