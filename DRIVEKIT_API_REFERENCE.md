# DriveKit API Reference Guide

## Base URL
```
https://drivekit-production.up.railway.app
```

---

## WORKING ENDPOINTS

### 1. System Health Check
```
GET /api/health
```

**Description:** Check API and database health status

**Response:**
```json
{
  "status": "ok",
  "db": "connected"
}
```

**Status Code:** 200 OK

---

### 2. Get All Users
```
GET /api/users
```

**Description:** Retrieve all registered users with full details

**Authentication:** None (Security Issue ⚠️)

**Response:**
```json
{
  "ok": true,
  "items": [
    {
      "id": "string (unique ID)",
      "email": "string",
      "name": "string",
      "passwordHash": "string (SHA-256)",
      "role": "OWNER | CUSTOMER",
      "emailOptIn": boolean,
      "emailVerified": boolean,
      "verificationToken": string | null,
      "createdAt": "ISO 8601 timestamp",
      "updatedAt": "ISO 8601 timestamp"
    }
  ],
  "total": number
}
```

**Query Parameters:**
- `limit` - Maximum number of results (e.g., `?limit=100`)

**Example Response:**
```json
{
  "ok": true,
  "items": [
    {
      "id": "cmr8lrtef000001nxd80ekjye",
      "email": "owner@drivekit.com",
      "name": "Owner",
      "passwordHash": "29f14be7068e46adf0b4f6027f611467b1227b9b3c489dde10c1a23cebf20834",
      "role": "OWNER",
      "emailOptIn": true,
      "emailVerified": true,
      "verificationToken": null,
      "createdAt": "2026-07-06T02:30:32.343Z",
      "updatedAt": "2026-07-06T02:30:32.343Z"
    }
  ],
  "total": 1
}
```

**Status Code:** 200 OK

---

### 3. Get All Orders
```
GET /api/orders
```

**Description:** Retrieve all orders in the system

**Authentication:** None (Should be protected)

**Response:**
```json
{
  "ok": true,
  "items": [],
  "total": 0
}
```

**Expected Response (with data):**
```json
{
  "ok": true,
  "items": [
    {
      "id": "string",
      "userId": "string",
      "orderNumber": "string (e.g., DK-44704)",
      "items": [],
      "totalPrice": number,
      "status": "pending | confirmed | shipped | delivered",
      "createdAt": "ISO 8601 timestamp",
      "updatedAt": "ISO 8601 timestamp"
    }
  ],
  "total": number
}
```

**Status Code:** 200 OK

---

### 4. Get All Reviews
```
GET /api/reviews
```

**Description:** Retrieve all product reviews

**Authentication:** None (Should be protected)

**Response:**
```json
{
  "ok": true,
  "items": [],
  "total": 0
}
```

**Expected Response (with data):**
```json
{
  "ok": true,
  "items": [
    {
      "id": "string",
      "productId": "string",
      "userId": "string",
      "rating": number (1-5),
      "title": "string",
      "content": "string",
      "createdAt": "ISO 8601 timestamp",
      "updatedAt": "ISO 8601 timestamp"
    }
  ],
  "total": number
}
```

**Status Code:** 200 OK

---

### 5. Get Email Logs
```
GET /api/email-logs
```

**Description:** Retrieve email sending history and logs

**Authentication:** None (Should be protected)

**Query Parameters:**
- `limit` - Maximum number of results (e.g., `?limit=100`)
- `offset` - Results offset for pagination
- `type` - Filter by email type
- `status` - Filter by send status

**Response:**
```json
{
  "ok": true,
  "items": [
    {
      "id": "string",
      "to": "string (email address)",
      "subject": "string",
      "type": "admin-test | order-confirmation | newsletter | password-reset",
      "status": "sent | pending | failed",
      "sentAt": "ISO 8601 timestamp",
      "campaignId": string | null
    }
  ],
  "total": number
}
```

**Example Response:**
```json
{
  "ok": true,
  "items": [
    {
      "id": "cmr8lu8mc000101nxr7qw6gke",
      "to": "tinksh10@gmail.com",
      "subject": "DriveKit — Test Email ✅",
      "type": "admin-test",
      "status": "sent",
      "sentAt": "2026-07-06T02:32:25.380Z",
      "campaignId": null
    },
    {
      "id": "cmrcytz0i001r01m7s4m5n7fh",
      "to": "owner@drivekit.com",
      "subject": "Order DK-44704 Confirmed — DriveKit",
      "type": "order-confirmation",
      "status": "sent",
      "sentAt": "2026-07-09T03:47:12.642Z",
      "campaignId": null
    }
  ],
  "total": 2
}
```

**Status Code:** 200 OK

---

## NON-WORKING ENDPOINTS (Return SPA HTML)

These endpoints exist but return HTML wrapper instead of JSON:

### Product Management Endpoints
- `GET /api/products` - Product list
- `GET /api/product` - Single product
- `GET /api/categories` - Product categories
- `GET /api/products/all` - All products
- `GET /api/products?limit=100` - Paginated products

### Cart & Checkout
- `GET /api/cart` - Shopping cart
- `GET /api/checkout` - Checkout process

### Authentication & User
- `GET /api/auth` - Auth endpoints
- `GET /api/me` - Current user info
- `GET /api/user` - User endpoints
- `GET /api/accounts` - User accounts

### Features
- `GET /api/search` - Search functionality
- `GET /api/wishlist` - User wishlist
- `GET /api/order` - Order endpoints

### Admin
- `GET /api/admin` - Admin panel
- `GET /api/dashboard` - Dashboard

### Management
- `GET /api/inventory` - Inventory management
- `GET /api/shipping` - Shipping info
- `GET /api/payment` - Payment processing
- `GET /api/settings` - Settings

### System
- `GET /api/status` - System status
- `GET /api/stats` - Statistics
- `GET /api/info` - API info
- `GET /api/config` - Configuration
- `GET /api/logs` - System logs

### Forms & Communication
- `GET /api/forms` - Form submissions
- `GET /api/newsletters` - Newsletter management
- `GET /api/subscribers` - Newsletter subscribers
- `GET /api/messages` - Messages
- `GET /api/contacts` - Contact management
- `GET /api/contact-forms` - Contact forms
- `GET /api/inquiries` - Inquiries
- `GET /api/submissions` - Form submissions
- `GET /api/emails` - Email management

### Analytics
- `GET /api/activities` - Activity logs
- `GET /api/events` - Event logs
- `GET /api/data` - Generic data

---

## PAGE ROUTES

These routes serve the SPA frontend:

| Route | Type | Purpose |
|-------|------|---------|
| `/` | GET | Homepage |
| `/shop` | GET | Product catalog |
| `/products` | GET | Products page |
| `/about` | GET | About page |
| `/contact` | GET | Contact page |
| `/login` | GET | Login page |
| `/register` | GET | Registration page |
| `/admin` | GET | Admin panel |
| `/admin/dashboard` | GET | Admin dashboard |
| `/cart` | GET | Shopping cart |

---

## REQUEST/RESPONSE FORMAT

### Standard Request Headers
```
Content-Type: application/json
Accept: application/json
```

### Standard Response Format
```json
{
  "ok": boolean,
  "items": [],
  "total": number
}
```

### Error Response (inferred)
```json
{
  "ok": false,
  "error": "error message",
  "code": "error code"
}
```

---

## DATA MODELS

### User Model
```typescript
interface User {
  id: string;                // Unique identifier
  email: string;            // Email address
  name: string;             // Display name
  passwordHash: string;     // SHA-256 hash
  role: "OWNER" | "CUSTOMER";  // User role
  emailOptIn: boolean;      // Newsletter subscription
  emailVerified: boolean;   // Email verification status
  verificationToken: string | null;  // Verification token
  createdAt: string;        // ISO 8601 timestamp
  updatedAt: string;        // ISO 8601 timestamp
}
```

### Email Log Model
```typescript
interface EmailLog {
  id: string;
  to: string;               // Recipient email
  subject: string;          // Email subject
  type: "admin-test" | "order-confirmation" | "newsletter" | "password-reset" | string;
  status: "sent" | "pending" | "failed";
  sentAt: string;          // ISO 8601 timestamp
  campaignId: string | null;
}
```

### Order Model (Expected)
```typescript
interface Order {
  id: string;
  userId: string;
  orderNumber: string;      // Format: DK-[5 digits]
  items: OrderItem[];
  totalPrice: number;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  createdAt: string;
  updatedAt: string;
}
```

### Review Model (Expected)
```typescript
interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;           // 1-5
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## AUTHENTICATION

### Current Status
- ⚠️ No authentication currently implemented on documented endpoints
- `/api/users` returns data without requiring authentication
- Email logs accessible without authentication

### Expected Authentication (When Implemented)
```
Authorization: Bearer <jwt_token>
```

### Recommended Implementation
- JWT-based authentication
- Session-based cookies
- Role-based access control (RBAC)

---

## RATE LIMITING

**Current Status:** Not documented / Not implemented on tested endpoints

**Recommendation:** Implement rate limiting for security

---

## CORS (Cross-Origin Resource Sharing)

**Current Status:** Not tested - requires browser context

---

## PAGINATION

### Supported Parameters
- `?limit=100` - Limit results to 100 items
- Offset-based pagination (likely)

### Example
```
GET /api/email-logs?limit=50&offset=0
```

---

## SORTING & FILTERING

**Status:** Not documented in current endpoints

**Expected Parameters (when implemented):**
- `?sort=createdAt`
- `?sort=-createdAt` (descending)
- `?filter[status]=sent`

---

## ERROR CODES

**Expected HTTP Status Codes:**
| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limited |
| 500 | Internal Server Error |

---

## USAGE EXAMPLES

### Get User List
```bash
curl -X GET "https://drivekit-production.up.railway.app/api/users" \
  -H "Accept: application/json"
```

### Get Email Logs with Limit
```bash
curl -X GET "https://drivekit-production.up.railway.app/api/email-logs?limit=100" \
  -H "Accept: application/json"
```

### Check API Health
```bash
curl -X GET "https://drivekit-production.up.railway.app/api/health" \
  -H "Accept: application/json"
```

### JavaScript/Fetch Example
```javascript
async function getUsers() {
  const response = await fetch('https://drivekit-production.up.railway.app/api/users');
  const data = await response.json();
  return data;
}

async function getEmailLogs() {
  const response = await fetch('https://drivekit-production.up.railway.app/api/email-logs?limit=100');
  const data = await response.json();
  return data;
}
```

---

## NOTES

- ⚠️ API currently lacks authentication on sensitive endpoints
- ⚠️ Password hashes are exposed in user data
- ⚠️ Test accounts remain in production database
- 📝 Many endpoints exist but return HTML (SPA routing)
- 🔄 Pagination supported on some endpoints
- 📧 Email logs show order confirmations and test emails

---

## TESTING TOOLS

### Recommended Tools for API Testing:
- **Postman** - API testing and documentation
- **Thunder Client** - VS Code API client
- **cURL** - Command-line requests
- **Insomnia** - REST client
- **API Tester** - Browser extension

### Security Testing:
- **Burp Suite** - Security testing
- **OWASP ZAP** - Vulnerability scanning
- **Postman Security** - API security checks

---

**Last Updated:** July 2024
**API Version:** 1.0 (inferred)
**Status:** Active with security vulnerabilities
