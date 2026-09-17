# API Documentation

Base URL (development): `http://localhost:5000/api`

All authenticated endpoints require an `Authorization: Bearer <accessToken>` header.
Refresh tokens are stored in an `httpOnly` cookie named `refreshToken`.

---

## 🔐 Authentication

### POST `/auth/signup`
Create a new user account. Returns a 6-digit verification code (simulated email).

**Auth required:** No

**Request body (JSON)**
```json
{ "name": "Virang Baldaniya", "email": "v@example.com", "password": "password123" }
```

**Success `201`**
```json
{
  "message": "Account created! Please verify your email.",
  "userId": "<mongoId>",
  "email": "v@example.com",
  "devVerificationCode": "482910"
}
```

**Errors**
| Code | Reason |
|------|--------|
| 400  | Missing field / password < 8 chars |
| 409  | Email already registered |

---

### POST `/auth/verify-email`
Submit the 6-digit code to verify a user's email. Returns access token + sets refresh cookie.

**Auth required:** No

**Request body (JSON)**
```json
{ "email": "v@example.com", "code": "482910" }
```

**Success `200`**
```json
{
  "user": { "id": "...", "name": "Virang", "email": "v@example.com", "isVerified": true },
  "accessToken": "<jwt>"
}
```

**Errors**
| Code | Reason |
|------|--------|
| 400  | Code expired or incorrect |
| 404  | User not found |

---

### POST `/auth/resend-verification`
Resend a new 6-digit verification code.

**Auth required:** No

**Request body (JSON)**
```json
{ "email": "v@example.com" }
```

**Success `200`**
```json
{ "message": "A new verification code has been sent.", "devVerificationCode": "773421" }
```

---

### POST `/auth/login`
Authenticate and receive tokens.

**Auth required:** No

**Request body (JSON)**
```json
{ "email": "v@example.com", "password": "password123" }
```

**Success `200`**
```json
{
  "user": { "id": "...", "name": "Virang", "email": "v@example.com", "isVerified": true },
  "accessToken": "<jwt — expires 15 min>"
}
```
Sets `refreshToken` httpOnly cookie (expires 7 days).

**Errors**
| Code | Reason |
|------|--------|
| 401  | Invalid credentials |
| 403  | Email not verified (`needsVerification: true` in body) |

---

### POST `/auth/refresh`
Rotate the refresh token and receive a new access token. **Old refresh token is invalidated.**

**Auth required:** httpOnly `refreshToken` cookie

**Request body:** None

**Success `200`**
```json
{
  "user": { "id": "...", "name": "Virang", "email": "v@example.com" },
  "accessToken": "<new jwt>"
}
```
Sets new `refreshToken` httpOnly cookie.

**Errors**
| Code | Reason |
|------|--------|
| 401  | Token missing, expired, or already rotated |

---

### POST `/auth/logout`
Invalidate the refresh token (server-side) and clear the cookie.

**Auth required:** httpOnly `refreshToken` cookie

**Success `200`**
```json
{ "message": "Logged out." }
```

---

### POST `/auth/forgot-password`
Generate a password-reset token (simulated email). Always returns 200 to prevent email enumeration.

**Auth required:** No

**Request body (JSON)**
```json
{ "email": "v@example.com" }
```

**Success `200`**
```json
{
  "message": "If that email exists, a reset link has been prepared.",
  "devResetToken": "<hex-token>"
}
```

---

### POST `/auth/reset-password`
Reset the user's password using the token.

**Auth required:** No

**Request body (JSON)**
```json
{ "token": "<hex-token>", "password": "newPassword123" }
```

**Success `200`**
```json
{ "message": "Password reset successfully. You can now log in." }
```

**Errors**
| Code | Reason |
|------|--------|
| 400  | Token invalid/expired or password < 8 chars |

---

## 🏢 Spaces

All space endpoints require `Authorization: Bearer <accessToken>`.

### GET `/spaces`
Fetch all spaces belonging to the authenticated owner.

**Success `200`** — Array of Space objects
```json
[
  {
    "_id": "...",
    "name": "YouTube",
    "slug": "youtube",
    "owner": "...",
    "createdAt": "2026-09-17T..."
  }
]
```

---

### POST `/spaces`
Create a new space with an auto-generated unique slug.

**Request body (JSON)**
```json
{ "name": "YouTube" }
```

**Success `201`**
```json
{ "_id": "...", "name": "YouTube", "slug": "youtube", "owner": "..." }
```

**Errors**
| Code | Reason |
|------|--------|
| 400  | Name is required |

---

### DELETE `/spaces/:id`
Delete a space and all its associated testimonials.

**Success `200`**
```json
{ "message": "Space deleted." }
```

**Errors**
| Code | Reason |
|------|--------|
| 404  | Space not found or not owned by the user |

---

## 📝 Testimonials (Owner)

All testimonial moderation endpoints require `Authorization: Bearer <accessToken>`.

### GET `/testimonials`
List all testimonials across the owner's spaces. Supports query parameters for filtering.

**Query params**
| Param    | Type   | Example    | Description                  |
|----------|--------|------------|------------------------------|
| `status` | string | `Approved` | Filter by status (`Pending`, `Approved`, `Archived`) |
| `rating` | number | `5`        | Filter by star rating (1–5)  |
| `search` | string | `great`    | Search `clientName` or `reviewText` |

**Success `200`** — Array of Testimonial objects
```json
[
  {
    "_id": "...",
    "space": { "name": "YouTube", "slug": "youtube" },
    "clientName": "Virang Baldaniya",
    "email": "v@example.com",
    "companyRole": "Developer at Parul University",
    "rating": 5,
    "reviewText": "Absolutely amazing!",
    "status": "Pending",
    "isFeatured": false,
    "isLiked": false,
    "avatar": "/uploads/abc123",
    "createdAt": "2026-09-17T..."
  }
]
```

---

### PATCH `/testimonials/:id/:action`
Moderate a testimonial. `:action` can be `approve`, `reject`, `feature`, or `like`.

| Action    | Effect |
|-----------|--------|
| `approve` | Sets `status = "Approved"` |
| `reject`  | Sets `status = "Archived"` |
| `feature` | Toggles `isFeatured` |
| `like`    | Toggles `isLiked` |

**Success `200`** — Updated Testimonial object

**Errors**
| Code | Reason |
|------|--------|
| 404  | Testimonial not found or not owned by user |

---

### GET `/analytics`
Get rating analytics for the authenticated owner's spaces.

**Success `200`**
```json
{
  "total": 12,
  "average": "4.6",
  "distribution": [
    { "rating": 1, "count": 0 },
    { "rating": 2, "count": 1 },
    { "rating": 3, "count": 1 },
    { "rating": 4, "count": 3 },
    { "rating": 5, "count": 7 }
  ]
}
```

---

## 🌐 Public Endpoints (No Authentication Required)

### POST `/public/spaces/:slug/testimonials`
Submit a new testimonial (with optional avatar image upload).

**Content-Type:** `multipart/form-data`

**Form fields**
| Field         | Type     | Required | Description                  |
|---------------|----------|----------|------------------------------|
| `clientName`  | string   | ✅        | Reviewer's full name         |
| `email`       | string   | ✅        | Reviewer's email             |
| `companyRole` | string   | ✅        | e.g. "Developer at Acme"     |
| `rating`      | number   | ✅        | 1–5 star rating              |
| `reviewText`  | string   | ✅        | The testimonial text         |
| `avatar`      | file     | ❌        | Image file (JPEG/PNG)        |

**Success `201`**
```json
{
  "message": "Thanks! Your review is pending approval.",
  "testimonial": { "_id": "...", "status": "Pending", ... }
}
```

**Errors**
| Code | Reason |
|------|--------|
| 404  | Space slug not found |

---

### GET `/public/spaces/:slug/wall`
Fetch all **Approved** testimonials for a space (used by Wall of Love).

**Success `200`**
```json
[
  {
    "_id": "...",
    "clientName": "Virang Baldaniya",
    "companyRole": "Developer at Parul University",
    "rating": 5,
    "reviewText": "Amazing product!",
    "isFeatured": true,
    "isLiked": true,
    "createdAt": "2026-09-17T..."
  }
]
```

---

## 📁 Media

### GET `/uploads/:filename`
Serve an uploaded avatar image.

**Auth required:** No

---

## 🔁 Token Flow Diagram

```
Signup
  │
  ▼ POST /auth/signup → { devVerificationCode }
  │
  ▼ POST /auth/verify-email → { accessToken } + refresh cookie
  │
  ▼ Access expires (15 min)
  │
  ▼ POST /auth/refresh → { new accessToken } + NEW refresh cookie (old invalidated)
  │
  ▼ POST /auth/logout → clears cookie, invalidates DB hash
```

---

## 🗄️ Data Models

### User
```json
{
  "name": "string",
  "email": "string (unique)",
  "password": "string (bcrypt hash, select: false)",
  "isVerified": "boolean",
  "emailVerificationCode": "string (select: false)",
  "verificationExpires": "Date",
  "refreshTokenHash": "string (sha256, select: false)",
  "tokenVersion": "number",
  "resetTokenHash": "string (sha256, select: false)",
  "resetTokenExpires": "Date"
}
```

### Space
```json
{
  "name": "string",
  "slug": "string (unique)",
  "owner": "ObjectId → User"
}
```

### Testimonial
```json
{
  "space": "ObjectId → Space",
  "clientName": "string",
  "email": "string",
  "companyRole": "string",
  "rating": "number (1–5)",
  "reviewText": "string",
  "avatar": "string (file path)",
  "status": "Pending | Approved | Archived",
  "isFeatured": "boolean",
  "isLiked": "boolean"
}
```
