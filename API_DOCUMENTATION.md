# API Documentation

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
```json
{
  "user": {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

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
```json
{
  "user": {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Logout
```http
POST /api/v1/auth/logout
```

**Response:** `200 OK`
```json
{
  "message": "Logged out successfully"
}
```

### Get Session
```http
GET /api/v1/auth/session
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Forgot Password
```http
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Response:** `200 OK`
```json
{
  "message": "Password reset email sent"
}
```

---

## Tours Endpoints

### Get All Tours
```http
GET /api/tours?destination=Delhi&difficulty=easy&minPrice=1000&maxPrice=5000&page=1&limit=10
```

**Query Parameters:**
- `destination` (optional): Filter by destination name
- `difficulty` (optional): `easy`, `moderate`, `challenging`
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:** `200 OK`
```json
{
  "tours": [
    {
      "id": "1",
      "title": "Golden Triangle Tour",
      "slug": "golden-triangle-tour",
      "description": "Visit Delhi, Agra, and Jaipur",
      "duration": 7,
      "price": 1500,
      "maxGroupSize": 15,
      "difficulty": "easy",
      "category": "heritage",
      "images": ["url1", "url2"],
      "highlights": ["Taj Mahal", "Red Fort"],
      "rating": 4.8,
      "reviewCount": 120
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

### Get Tour by ID
```http
GET /api/tours/1
```

**Response:** `200 OK`
```json
{
  "id": "1",
  "title": "Golden Triangle Tour",
  "slug": "golden-triangle-tour",
  "description": "Visit Delhi, Agra, and Jaipur",
  "longDescription": "Detailed description...",
  "duration": 7,
  "price": 1500,
  "maxGroupSize": 15,
  "difficulty": "easy",
  "category": "heritage",
  "images": ["url1", "url2"],
  "highlights": ["Taj Mahal", "Red Fort"],
  "included": ["Accommodation", "Meals"],
  "excluded": ["Flights", "Personal expenses"],
  "itinerary": [
    {
      "day": 1,
      "title": "Arrival in Delhi",
      "description": "Welcome to Delhi",
      "activities": ["Airport pickup", "Hotel check-in"]
    }
  ],
  "destinations": ["Delhi", "Agra", "Jaipur"],
  "rating": 4.8,
  "reviewCount": 120,
  "isActive": true,
  "isFeatured": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Get Featured Tours
```http
GET /api/tours/featured?limit=6
```

**Response:** `200 OK`
```json
[
  {
    "id": "1",
    "title": "Golden Triangle Tour",
    "price": 1500,
    "rating": 4.8,
    ...
  }
]
```

### Search Tours
```http
GET /api/tours/search?q=rajasthan&limit=10
```

**Response:** `200 OK`
```json
[
  {
    "id": "2",
    "title": "Rajasthan Heritage Tour",
    ...
  }
]
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

**Response:** `201 Created`

### Update Tour (Admin Only)
```http
PATCH /api/tours/1
Authorization: Required (Admin)
Content-Type: application/json

{
  "price": 2500,
  "maxGroupSize": 15
}
```

**Response:** `200 OK`

### Delete Tour (Admin Only)
```http
DELETE /api/tours/1
Authorization: Required (Admin)
```

**Response:** `200 OK`
```json
{
  "message": "Tour deleted successfully",
  "tour": {...}
}
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

**Response:** `200 OK`
```json
{
  "bookings": [
    {
      "id": "1",
      "tourId": "1",
      "userId": "1",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+919876543210",
      "country": "India",
      "numberOfTravelers": 2,
      "startDate": "2024-06-01T00:00:00Z",
      "endDate": "2024-06-08T00:00:00Z",
      "totalPrice": 3000,
      "status": "pending",
      "paymentStatus": "pending",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

### Get Booking by ID
```http
GET /api/bookings/1
Authorization: Required (User or Admin)
```

**Response:** `200 OK`

### Get User Bookings
```http
GET /api/bookings/user/1?page=1&limit=10
Authorization: Required (User or Admin)
```

**Response:** `200 OK`
```json
{
  "bookings": [...],
  "total": 5,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
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

**Response:** `201 Created`

### Update Booking (Admin Only)
```http
PATCH /api/bookings/1
Authorization: Required (Admin)
Content-Type: application/json

{
  "status": "confirmed",
  "paymentStatus": "paid"
}
```

**Response:** `200 OK`

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

**Response:** `200 OK`
```json
{
  "inquiries": [
    {
      "id": "1",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "+919876543210",
      "country": "USA",
      "tourInterest": "Golden Triangle",
      "message": "I'm interested in booking...",
      "status": "new",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 10,
  "totalPages": 2
}
```

### Get Inquiry by ID (Admin Only)
```http
GET /api/inquiries/1
Authorization: Required (Admin)
```

**Response:** `200 OK`

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
  "message": "I'm interested in booking a tour for 4 people"
}
```

**Response:** `201 Created`

### Update Inquiry (Admin Only)
```http
PATCH /api/inquiries/1
Authorization: Required (Admin)
Content-Type: application/json

{
  "status": "contacted"
}
```

**Response:** `200 OK`

---

## Custom Tour Requests Endpoints

### Get All Custom Tour Requests (Admin Only)
```http
GET /api/custom-tour?page=1&limit=10
Authorization: Required (Admin)
```

**Response:** `200 OK`
```json
{
  "requests": [
    {
      "id": "1",
      "name": "Mike Johnson",
      "email": "mike@example.com",
      "phone": "+919876543210",
      "country": "UK",
      "numberOfTravelers": 4,
      "duration": 10,
      "budget": "$5000-$7000",
      "destinations": ["Kerala", "Goa"],
      "interests": ["Beach", "Culture"],
      "startDate": "2024-07-01T00:00:00Z",
      "additionalInfo": "Looking for luxury accommodations",
      "status": "pending",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 8,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

### Get Custom Tour Request by ID (Admin Only)
```http
GET /api/custom-tour/1
Authorization: Required (Admin)
```

**Response:** `200 OK`

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

**Response:** `201 Created`

### Update Custom Tour Request Status (Admin Only)
```http
PATCH /api/custom-tour/1
Authorization: Required (Admin)
Content-Type: application/json

{
  "status": "in_progress"
}
```

**Valid statuses:** `pending`, `in_progress`, `completed`, `cancelled`

**Response:** `200 OK`

---

## Dashboard Endpoints (Admin Only)

### Get Dashboard Stats
```http
GET /api/dashboard/stats
Authorization: Required (Admin)
```

**Response:** `200 OK`
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

**Response:** `200 OK`
```json
{
  "bookings": [...],
  "inquiries": [...],
  "customTours": [...]
}
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

All protected endpoints require a valid JWT session cookie. The cookie is automatically set when you login via `/api/v1/auth/login`.

### Admin-Only Endpoints
- `POST /api/tours`
- `PATCH /api/tours/:id`
- `DELETE /api/tours/:id`
- `GET /api/bookings`
- `PATCH /api/bookings/:id`
- `GET /api/inquiries`
- `GET /api/inquiries/:id`
- `PATCH /api/inquiries/:id`
- `GET /api/custom-tour`
- `GET /api/custom-tour/:id`
- `PATCH /api/custom-tour/:id`
- `GET /api/dashboard/stats`
- `GET /api/dashboard/recent`

### User or Admin Endpoints
- `GET /api/bookings/:id` (user can only access their own)
- `GET /api/bookings/user/:userId` (user can only access their own)

### Public Endpoints
- All auth endpoints
- `GET /api/tours`
- `GET /api/tours/:id`
- `GET /api/tours/featured`
- `GET /api/tours/search`
- `POST /api/bookings`
- `POST /api/inquiries`
- `POST /api/custom-tour`

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting in production.

## CORS

CORS is configured to allow requests from the same origin. Update for production deployment.

---

**Last Updated:** March 18, 2026  
**API Version:** 1.0.0
