# API Reference

Complete API documentation for Ghumo Firo India.

**Base URL:** `http://localhost:3000/api`  
**Version:** v1  
**Authentication:** JWT Session Cookies

---

## Authentication Endpoints

### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response:** `201 Created`

### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK` + Sets session cookie

### Logout
```http
POST /api/v1/auth/logout
```

**Response:** `200 OK`

### Get Session
```http
GET /api/v1/auth/session
```

**Response:** `200 OK` with user data

### Forgot Password
```http
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Response:** `200 OK`

---

## Tours Endpoints

### Get All Tours
```http
GET /api/tours?destination=Delhi&difficulty=easy&minPrice=1000&maxPrice=5000&page=1&limit=10
```

**Query Parameters:**
- `destination` (optional): Filter by destination
- `difficulty` (optional): `easy`, `moderate`, `challenging`
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

### Get Tour by ID
```http
GET /api/tours/:id
```

### Get Featured Tours
```http
GET /api/tours/featured?limit=6
```

### Search Tours
```http
GET /api/tours/search?q=rajasthan&limit=10
```

### Create Tour (Admin Only)
```http
POST /api/tours
Authorization: Required (Admin)
Content-Type: application/json

{
  "title": "New Tour",
  "description": "Tour description",
  "price": 2000,
  "duration": 5,
  "maxGroupSize": 12,
  "difficulty": "moderate",
  "images": ["url1", "url2"],
  "highlights": ["Highlight 1"],
  "included": ["Item 1"],
  "excluded": ["Item 2"],
  "itinerary": [
    {
      "day": 1,
      "title": "Day 1",
      "description": "Description"
    }
  ]
}
```

### Update Tour (Admin Only)
```http
PATCH /api/tours/:id
Authorization: Required (Admin)
Content-Type: application/json

{
  "price": 2500,
  "maxGroupSize": 15
}
```

### Delete Tour (Admin Only)
```http
DELETE /api/tours/:id
Authorization: Required (Admin)
```

---

## Bookings Endpoints

### Get All Bookings (Admin Only)
```http
GET /api/bookings?status=pending&page=1&limit=10
Authorization: Required (Admin)
```

**Query Parameters:**
- `status` (optional): `pending`, `confirmed`, `cancelled`, `completed`
- `tourId` (optional): Filter by tour ID
- `userId` (optional): Filter by user ID
- `startDate` (optional): Filter by start date
- `endDate` (optional): Filter by end date
- `page` (optional): Page number
- `limit` (optional): Items per page

### Get Booking by ID
```http
GET /api/bookings/:id
Authorization: Required (User or Admin)
```

### Get User Bookings
```http
GET /api/bookings/user/:userId?page=1&limit=10
Authorization: Required (User or Admin)
```

### Create Booking
```http
POST /api/bookings
Content-Type: application/json

{
  "tourId": "1",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "country": "India",
  "numberOfTravelers": 2,
  "startDate": "2024-06-01",
  "endDate": "2024-06-08",
  "totalPrice": 3000,
  "specialRequests": "Vegetarian meals"
}
```

### Update Booking (Admin Only)
```http
PATCH /api/bookings/:id
Authorization: Required (Admin)
Content-Type: application/json

{
  "status": "confirmed",
  "paymentStatus": "paid"
}
```

---

## Inquiries Endpoints

### Get All Inquiries (Admin Only)
```http
GET /api/inquiries?status=new&page=1&limit=10
Authorization: Required (Admin)
```

**Query Parameters:**
- `status` (optional): `new`, `contacted`, `converted`, `closed`
- `page` (optional): Page number
- `limit` (optional): Items per page

### Get Inquiry by ID (Admin Only)
```http
GET /api/inquiries/:id
Authorization: Required (Admin)
```

### Create Inquiry
```http
POST /api/inquiries
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+919876543210",
  "country": "USA",
  "tourInterest": "Golden Triangle",
  "message": "I'm interested in booking a tour"
}
```

### Update Inquiry (Admin Only)
```http
PATCH /api/inquiries/:id
Authorization: Required (Admin)
Content-Type: application/json

{
  "status": "contacted"
}
```

---

## Custom Tour Requests Endpoints

### Get All Custom Tour Requests (Admin Only)
```http
GET /api/custom-tour?page=1&limit=10
Authorization: Required (Admin)
```

### Get Custom Tour Request by ID (Admin Only)
```http
GET /api/custom-tour/:id
Authorization: Required (Admin)
```

### Create Custom Tour Request
```http
POST /api/custom-tour
Content-Type: application/json

{
  "name": "Mike Johnson",
  "email": "mike@example.com",
  "phone": "+919876543210",
  "country": "UK",
  "numberOfTravelers": 4,
  "duration": 10,
  "budget": "$5000-$7000",
  "destinations": ["Kerala", "Goa"],
  "interests": ["Beach", "Culture"],
  "startDate": "2024-07-01",
  "additionalInfo": "Looking for luxury accommodations"
}
```

### Update Custom Tour Request Status (Admin Only)
```http
PATCH /api/custom-tour/:id
Authorization: Required (Admin)
Content-Type: application/json

{
  "status": "in_progress"
}
```

Valid statuses: `pending`, `in_progress`, `completed`, `cancelled`

---

## Dashboard Endpoints (Admin Only)

### Get Dashboard Stats
```http
GET /api/dashboard/stats
Authorization: Required (Admin)
```

**Response:**
```json
{
  "bookings": {
    "total": 150,
    "pending": 25,
    "confirmed": 80,
    "cancelled": 10,
    "completed": 35
  },
  "inquiries": {
    "new": 12
  },
  "customTours": {
    "pending": 5
  }
}
```

### Get Recent Items
```http
GET /api/dashboard/recent?limit=5
Authorization: Required (Admin)
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Authentication

Protected endpoints require a valid JWT session cookie set via `/api/v1/auth/login`.

### Admin-Only Endpoints
- Tour management (POST, PATCH, DELETE)
- All bookings, inquiries, custom tour requests
- Dashboard endpoints

### User or Admin Endpoints
- Get own bookings
- Get booking by ID (own or admin)

### Public Endpoints
- All auth endpoints
- GET tours
- POST bookings, inquiries, custom tour requests

---

**Last Updated:** April 1, 2026
