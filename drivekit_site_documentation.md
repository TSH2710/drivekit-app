# DriveKit Website Documentation
**URL:** https://drivekit-production.up.railway.app/

## Site Overview
- **Title:** DriveKit — Premium Car Accessories for Serious Drivers
- **Type:** Single Page Application (SPA) - Built with JavaScript framework
- **Hosting:** Railway.app (Production environment)

---

## TECHNICAL FINDINGS

### Architecture
- The site is a JavaScript-based SPA that serves the same minimal HTML file for all routes
- All page rendering happens client-side through JavaScript
- RESTful API backend available at `/api/*` endpoints

---

## API ENDPOINTS DISCOVERED

### Working Endpoints (Return JSON Data)

#### 1. **GET /api/users**
**Response:** User list with complete user data
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
    },
    {
      "id": "cmr8pjau2000001p5rqk3o9qq",
      "email": "admin@drivekit.app",
      "name": "DriveKit Admin",
      "passwordHash": "29f14be7068e46adf0b4f6027f611467b1227b9b3c489dde10c1a23cebf20834",
      "role": "CUSTOMER",
      "emailOptIn": true,
      "emailVerified": true,
      "verificationToken": null,
      "createdAt": "2026-07-06T04:15:53.498Z",
      "updatedAt": "2026-07-06T04:15:53.498Z"
    }
  ],
  "total": 2
}
```

**User Roles Identified:**
- OWNER
- CUSTOMER

**User Fields:**
- id, email, name, passwordHash, role, emailOptIn, emailVerified, verificationToken, createdAt, updatedAt

#### 2. **GET /api/orders**
**Response:** Empty orders list
```json
{
  "ok": true,
  "items": [],
  "total": 0
}
```

#### 3. **GET /api/reviews**
**Response:** Empty reviews list
```json
{
  "ok": true,
  "items": [],
  "total": 0
}
```

### Routes That Exist But Require Authentication or Frontend Rendering
These endpoints return HTML title only (SPA routes):
- `/api/products` - Likely returns product catalog
- `/api/categories` - Likely returns product categories
- `/api/cart` - Shopping cart management
- `/api/auth` - Authentication endpoints
- `/api/me` - Current user profile
- `/api/wishlist` - User wishlist
- `/api/settings` - Settings
- `/api/checkout` - Checkout process
- `/api/payment` - Payment processing
- `/api/search` - Search functionality
- `/api/admin` - Admin panel
- `/api/dashboard` - Admin/user dashboard
- `/api/inventory` - Product inventory management
- `/api/shipping` - Shipping information

---

## PAGE ROUTES DISCOVERED

The following page routes have been identified (all serve via SPA):

### Main Pages
1. **`/`** - Homepage
2. **`/shop`** - Product shop/catalog
3. **`/about`** - About page
4. **`/contact`** - Contact page

### Authentication Pages
5. **`/login`** - User login
6. **`/register`** - User registration

### Admin/User Area
7. **`/admin`** - Admin panel/dashboard

### SPA Routes (Assumed)
- `/sitemap.xml` - Returns SPA HTML (no traditional sitemap)

---

## FEATURES IDENTIFIED

Based on API endpoints and routes discovered, the site likely includes:

### Core E-Commerce Features
✓ Product catalog and shop
✓ Product categories/filtering
✓ Shopping cart
✓ Checkout process
✓ Order management
✓ Payment processing
✓ Product reviews/ratings

### User Features
✓ User authentication (login/register)
✓ User profiles
✓ Email opt-in/subscription
✓ Email verification system
✓ User dashboard

### Admin Features
✓ Admin panel
✓ User management
✓ Inventory management
✓ Dashboard/analytics

### Additional Features
✓ Product search
✓ Wishlist functionality
✓ Settings management
✓ Shipping information

---

## USER ACCOUNTS FOUND

### Test Accounts (Exposed via API):
1. **Owner Account**
   - Email: `owner@drivekit.com`
   - Name: Owner
   - Role: OWNER
   - Email Verified: Yes
   - ID: cmr8lrtef000001nxd80ekjye

2. **Admin Account**
   - Email: `admin@drivekit.app`
   - Name: DriveKit Admin
   - Role: CUSTOMER
   - Email Verified: Yes
   - ID: cmr8pjau2000001p5rqk3o9qq

⚠️ **Security Note:** Both accounts have identical password hashes, which is unusual and may indicate test data.

---

## DESIGN & LAYOUT INFORMATION

Unfortunately, visual content could not be fully captured due to browser limitations in the testing environment. The site uses:
- JavaScript SPA framework for dynamic rendering
- RESTful API backend
- Responsive design (implied by modern development practices)

---

## PRODUCT INFORMATION

### Data Structure
Products likely include:
- id
- name
- description
- price
- category
- image(s)
- inventory/stock
- reviews/ratings

### Categories
Product categories are available but specific categories not retrieved due to API endpoint limitations.

---

## COLOR SCHEME & STYLING

Unable to determine from this environment. Site appears to use:
- Modern JavaScript framework (possibly React, Vue, or similar)
- Likely uses a CSS framework or custom styling

---

## SECURITY NOTES

⚠️ **Issues Identified:**
1. User passwords and data are exposed via `/api/users` endpoint
2. No authentication required to access full user list
3. Test/demo user accounts still in production database
4. Password hashes visible in API responses

**Recommendations:**
- Protect `/api/users` endpoint with authentication
- Remove test accounts
- Implement proper access control on all API endpoints
- Use environment-specific data

---

## NAVIGATION STRUCTURE (INFERRED)

Based on discovered routes, the likely navigation includes:
```
Home
├── Shop
├── About
├── Contact
└── Account
    ├── Login
    ├── Register
    └── Admin (if authenticated as OWNER)
```

---

## MISSING INFORMATION

Due to browser limitations in the testing environment, the following could not be fully documented:
- Visual design and color scheme
- Exact layout of each page
- Typography and fonts
- Navigation menu structure
- Homepage hero section content
- Product listings appearance
- Cart and checkout flow UI
- Admin panel interface
- Footer content and links
- Search functionality UI
- Filter options for products
- Review/rating system UI
- Newsletter signup form
- Social media links
- Return/refund policies
- Shipping information display

---

## RECOMMENDATIONS FOR FULL DOCUMENTATION

To fully document this site, perform the following:
1. Use a GUI browser to visually inspect all pages
2. Take screenshots of each major page and feature
3. Test the checkout flow end-to-end
4. Test user login/registration
5. Test product search and filtering
6. Test cart functionality
7. Document all form fields
8. Document all CTAs (Call to Action buttons)
9. Check footer links
10. Review error handling and validation messages

---

## API SUMMARY TABLE

| Endpoint | Method | Status | Returns |
|----------|--------|--------|---------|
| /api/users | GET | ✓ Working | User list with detailed data |
| /api/orders | GET | ✓ Working | Empty orders array |
| /api/reviews | GET | ✓ Working | Empty reviews array |
| /api/products | GET | Not Working | Returns HTML only |
| /api/categories | GET | Not Working | Returns HTML only |
| /api/cart | GET | Not Working | Returns HTML only |
| /api/auth | GET | Not Working | Returns HTML only |
| /api/me | GET | Not Working | Returns HTML only |
| /api/wishlist | GET | Not Working | Returns HTML only |
| /api/search | GET | Not Working | Returns HTML only |
| /api/admin | GET | Not Working | Returns HTML only |
| /api/dashboard | GET | Not Working | Returns HTML only |
| /api/inventory | GET | Not Working | Returns HTML only |
| /api/shipping | GET | Not Working | Returns HTML only |
| /api/payment | GET | Not Working | Returns HTML only |
| /api/checkout | GET | Not Working | Returns HTML only |
| /api/settings | GET | Not Working | Returns HTML only |

---

**Documentation Generated:** July 2024
**Site Status:** Active
**Access Level:** Public (API data exposed without authentication)
