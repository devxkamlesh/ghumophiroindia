# API Documentation

Base URL: `http://localhost:4000/api/v1`

## Authentication

All protected routes require Bearer token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Auth Endpoints

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "+919876543210",
  "country": "India"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### Get Session
```http
GET /auth/session
```

### Get Profile (Protected)
```http
GET /auth/profile
Authorization: Bearer <token>
```

---

## Tours Endpoints

### Get All Tours
```http
GET /tours?page=1&limit=10&category=heritage&featured=true&sortBy=price&sortOrder=asc
```

Query Parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `category` - city | heritage | desert | custom
- `difficulty` - easy | moderate | challenging
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `minDuration` - Minimum duration (days)
- `maxDuration` - Maximum duration (days)
- `featured` - true | false
- `search` - Search in title/description
- `sortBy` - price | duration | rating | createdAt
- `sortOrder` - asc | desc

### Get Featured Tours
```http
GET /tours/featured
```

### Get Tour by ID
```http
GET /tours/:id
```

### Get Tour by Slug
```http
GET /tours/slug/:slug
```

### Create Tour (Admin)
```http
POST /tours
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Royal Rajasthan Tour",
  "slug": "royal-rajasthan-tour",
  "description": "Experience the grandeur of Rajasthan",
  "duration": 8,
  "price": 95000,
  "maxGroupSize": 12,
  "difficulty": "moderate",
  "category": "heritage",
  "images": ["https://..."],
  "highlights": ["Visit forts", "Camel safari"],
  "included": ["Accommodation", "Meals"],
  "excluded": ["Flights", "Tips"],
  "itinerary": [
    {
      "day": 1,
      "title": "Arrival",
      "description": "Welcome to Jaipur",
      "activities": ["Airport pickup", "Hotel check-in"]
    }
  ],
  "destinations": ["Jaipur", "Jodhpur"],
  "isFeatured": true
}
```

---

## Bookings Endpoints

### Create Booking
```http
POST /bookings
Content-Type: application/json

{
  "tourId": 1,
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+919876543210",
  "customerCountry": "India",
  "numberOfTravelers": 2,
  "startDate": "2026-06-01T00:00:00Z",
  "specialRequests": "Vegetarian meals"
}
```

### Get My Bookings (Protected)
```http
GET /bookings/my-bookings
Authorization: Bearer <token>
```

### Get All Bookings (Admin)
```http
GET /bookings?page=1&status=confirmed&paymentStatus=paid
Authorization: Bearer <admin_token>
```

### Update Booking Status (Admin)
```http
PATCH /bookings/:id/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "confirmed"
}
```

### Update Payment Status (Admin)
```http
PATCH /bookings/:id/payment
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "paymentStatus": "paid"
}
```

---

## Destinations Endpoints

### Get All Destinations
```http
GET /destinations
```

### Get Popular Destinations
```http
GET /destinations/popular
```

### Get Destination by ID
```http
GET /destinations/:id
```

---

## Inquiries Endpoints

### Submit Inquiry
```http
POST /inquiries
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "country": "India",
  "tourInterest": "Rajasthan Tour",
  "message": "I'm interested in booking a tour"
}
```

### Get All Inquiries (Admin)
```http
GET /inquiries?page=1
Authorization: Bearer <admin_token>
```

### Update Inquiry Status (Admin)
```http
PATCH /inquiries/:id/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "contacted"
}
```

---

## Custom Tours Endpoints

### Submit Custom Tour Request
```http
POST /custom-tours
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "country": "India",
  "numberOfTravelers": 4,
  "duration": 10,
  "budget": "₹100,000 - ₹150,000",
  "destinations": ["Jaipur", "Udaipur", "Jaisalmer"],
  "interests": ["Heritage", "Desert Safari"],
  "startDate": "2026-07-01T00:00:00Z",
  "additionalInfo": "Looking for luxury accommodations"
}
```

### Get All Custom Tour Requests (Admin)
```http
GET /custom-tours?page=1
Authorization: Bearer <admin_token>
```

### Update Request Status (Admin)
```http
PATCH /custom-tours/:id/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "quoted"
}
```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "errors": {
    "field": ["Validation error"]
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Too Many Requests
- `500` - Internal Server Error
