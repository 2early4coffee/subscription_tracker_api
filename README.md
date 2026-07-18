# Subscription Tracker API

A production-ready RESTful API for tracking subscriptions and sending automated renewal reminder emails. Built with Node.js, Express, MongoDB, and Upstash Workflow.

---

## Tech Stack

- **Runtime:** Node.js v22+
- **Framework:** Express.js
- **Database:** MongoDB Atlas (via Mongoose)
- **Authentication:** JWT (Access + Refresh Tokens)
- **Email:** Nodemailer (Gmail)
- **Workflow/Scheduling:** Upstash QStash & Workflow
- **Security:** Arcjet (rate limiting, bot detection), Helmet, CORS
- **Validation:** Zod
- **Logging:** Morgan
- **Environment:** dotenv
- **Deployment:** Railway

---

## Project Structure

```
subscription_tracker/
├── config/
│   ├── arcjet.js
│   ├── env.js
│   ├── nodemailer.js
│   └── upstash.js
├── controllers/
│   ├── auth.controller.js
│   ├── subscription.controller.js
│   ├── user.controller.js
│   └── workflow.controller.js
├── database/
│   └── mongodb.js
├── middlewares/
│   ├── arcjet.middleware.js
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── validate.middleware.js
├── models/
│   ├── subscription.model.js
│   └── user.model.js
├── routes/
│   ├── auth.routes.js
│   ├── subscription.routes.js
│   ├── user.routes.js
│   └── workflow.routes.js
├── utils/
│   ├── email-template.js
│   ├── send-email.js
│   └── validation.js
├── app.js
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Upstash account (QStash)
- Gmail account with App Password enabled
- Arcjet account

### Installation

```bash
git clone https://github.com/2early4coffee/subscription_tracker_api.git
cd subscription_tracker
npm install
```

### Environment Variables

Create a `.env.development.local` file in the root directory:

```env
# PORT
PORT=5500

# ENVIRONMENT
NODE_ENV=development

# DATABASE
DB_URI="your_mongodb_connection_string"

# JWT
JWT_SECRET="your_jwt_secret"
JWT_EXPIRES_IN="1d"
JWT_REFRESH_SECRET="your_jwt_refresh_secret"
JWT_REFRESH_EXPIRES_IN="7d"

# ARCJET
ARCJET_KEY="your_arcjet_key"
ARCJET_ENV="development"

# UPSTASH
QSTASH_TOKEN="your_qstash_token"

# SERVER
SERVER_URL=http://localhost:5500

# NODEMAILER
EMAIL_PASSWORD=your_gmail_app_password

# ALLOWED ORIGINS
ALLOWED_ORIGINS=http://localhost:3000

# ALLOWED IPS (comma separated)
ALLOWED_IPS=127.0.0.1
```

Create a `.env.production.local` file for production:

```env
# ENVIRONMENT
NODE_ENV=production

# UPSTASH
QSTASH_TOKEN="your_qstash_token"
QSTASH_CURRENT_SIGNING_KEY="your_signing_key"
QSTASH_NEXT_SIGNING_KEY="your_next_signing_key"
```

### Running the App

```bash
# Development
npm run dev

# Production
npm start
```

---

## API Endpoints

### Auth

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/sign-up` | Register a new user | No |
| POST | `/api/v1/auth/sign-in` | Sign in and get tokens | No |
| POST | `/api/v1/auth/sign-out` | Sign out and invalidate refresh token | No |
| POST | `/api/v1/auth/refresh-token` | Get new access and refresh tokens | No |
| POST | `/api/v1/auth/forgot-password` | Send password reset email | No |
| POST | `/api/v1/auth/reset-password/:token` | Reset password with token | No |

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/users` | Get all users | Yes |
| GET | `/api/v1/users/:id` | Get user by ID | Yes |

### Subscriptions

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/subscriptions` | Get all subscriptions (paginated) | Yes |
| POST | `/api/v1/subscriptions` | Create a subscription | Yes |
| GET | `/api/v1/subscriptions/upcoming-renewals` | Get subscriptions renewing in 30 days | Yes |
| GET | `/api/v1/subscriptions/user/:id` | Get subscriptions by user | Yes |
| GET | `/api/v1/subscriptions/:id` | Get subscription by ID | Yes |
| PUT | `/api/v1/subscriptions/:id` | Update subscription | Yes |
| PUT | `/api/v1/subscriptions/:id/cancel` | Cancel subscription | Yes |
| DELETE | `/api/v1/subscriptions/:id` | Delete subscription | Yes |

### Workflows

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/workflows/subscription/reminder` | Trigger reminder workflow | No |

---

## Authentication

All protected routes require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <your_access_token>
```

### Token Flow

1. Sign up or sign in to receive `accessToken` (1 day) and `refreshToken` (7 days)
2. Use `accessToken` for all protected requests
3. When `accessToken` expires, call `/auth/refresh-token` with your `refreshToken` to get new tokens
4. On sign out, `refreshToken` is invalidated in the database

---

## Request Validation

All request bodies are validated with Zod. Invalid requests return a `400` with clear error messages:

```json
{
    "success": false,
    "error": "Name must be at least 2 characters, Please provide a valid email address, Password must be at least 6 characters"
}
```

### Validation Rules

| Field | Rules |
|-------|-------|
| name | Min 2, Max 50 characters |
| email | Valid email format |
| password | Min 6 characters |
| price | Number, min 0.01 |
| currency | USD, EUR, or GBP |
| frequency | daily, weekly, monthly, or yearly |
| category | sports, news, entertainment, lifestyle, technology, finance, politics, or other |

---

## Subscription Model

```json
{
    "name": "Netflix Premium",
    "price": 15.99,
    "currency": "USD",
    "frequency": "monthly",
    "category": "entertainment",
    "startDate": "2026-06-17T00:00:00.000Z",
    "paymentMethod": "Credit Card"
}
```

| Field | Type | Options |
|-------|------|---------|
| name | String | 2–100 characters |
| price | Number | Min 0.01 |
| currency | String | USD, EUR, GBP (default: USD) |
| frequency | String | daily, weekly, monthly, yearly |
| category | String | sports, news, entertainment, lifestyle, technology, finance, politics, other |
| paymentMethod | String | Any string |
| status | String | active, cancelled, expired (default: active) |
| startDate | Date | Must be in the past |
| renewalDate | Date | Auto-calculated from startDate + frequency |

### Pagination

Add `page` and `limit` query parameters to paginated endpoints:

```
GET /api/v1/subscriptions?page=1&limit=10
```

Response includes a `meta` object:

```json
{
    "success": true,
    "data": [...],
    "meta": {
        "total": 25,
        "page": 1,
        "limit": 10,
        "totalPages": 3
    }
}
```

---

## Reminder Workflow

When a subscription is created in production, Upstash Workflow automatically:

1. Fetches the subscription from the database
2. Checks if the subscription is active and renewal date is in the future
3. Sleeps until each reminder date
4. Sends a reminder email at **7, 5, 2, and 1 days** before renewal

> **Note:** The workflow trigger is only active when `NODE_ENV=production`. A publicly accessible server URL is required for Upstash to reach your server.

### Reminder Email

Each reminder email includes:
- Subscription name and plan
- Renewal date
- Price and billing frequency
- Payment method
- Link to manage subscription
- Link to contact support

---

## Security

| Feature | Details |
|---------|---------|
| Rate limiting | Token bucket — 5 requests per 10 seconds per IP via Arcjet |
| Bot detection | LIVE in production, DRY_RUN in development |
| IP whitelisting | `ALLOWED_IPS` env variable bypasses Arcjet for trusted IPs |
| Security headers | 15 headers set automatically via Helmet |
| CORS | Configurable via `ALLOWED_ORIGINS` env variable |
| Password hashing | bcrypt with 10 salt rounds |
| Access tokens | JWT, expires in 1 day |
| Refresh tokens | JWT, expires in 7 days, stored and rotated in database |
| Sensitive fields | Password, refresh token, reset token never returned in responses |

---

## Password Reset Flow

1. `POST /api/v1/auth/forgot-password` with `{ "email": "..." }`
2. Check inbox for reset email with a link (expires in 15 minutes)
3. Click the link or `POST /api/v1/auth/reset-password/:token` with `{ "password": "..." }`
4. Sign in again with new password

---

## Error Handling

All errors return a consistent format:

```json
{
    "success": false,
    "error": "Error message here"
}
```

| Status Code | Meaning |
|-------------|---------|
| 400 | Validation error or bad request |
| 401 | Unauthorized — invalid or expired token |
| 403 | Forbidden — bot detected or access denied |
| 404 | Resource not found |
| 409 | Conflict — duplicate resource |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

## Deployment

Hosted on **Railway** at:
```
https://subscriptiontrackerapi-production.up.railway.app
```

### Deploying Updates

```bash
git add .
git commit -m "your commit message"
git push origin main
```

Railway auto-deploys on every push to `main`.

### Environment Variables (Railway)

| Variable | Description |
|----------|-------------|
| PORT | Server port (5500) |
| NODE_ENV | Environment (production) |
| DB_URI | MongoDB Atlas connection string |
| JWT_SECRET | JWT signing secret |
| JWT_EXPIRES_IN | Access token expiry (1d) |
| JWT_REFRESH_SECRET | Refresh token signing secret |
| JWT_REFRESH_EXPIRES_IN | Refresh token expiry (7d) |
| ARCJET_KEY | Arcjet API key |
| ARCJET_ENV | Arcjet environment |
| QSTASH_TOKEN | Upstash QStash token |
| QSTASH_CURRENT_SIGNING_KEY | Upstash signing key |
| QSTASH_NEXT_SIGNING_KEY | Upstash next signing key |
| SERVER_URL | Public server URL |
| EMAIL_PASSWORD | Gmail app password |
| ALLOWED_ORIGINS | Comma-separated allowed CORS origins |
| ALLOWED_IPS | Comma-separated whitelisted IPs |

---

## Monitoring

- **Railway** — crash notifications and deployment logs
- **UptimeRobot** — uptime monitoring, pings every 5 minutes, email alerts on downtime

---

## Scripts

```bash
npm run dev     # Start development server with nodemon
npm start       # Start production server
```

---

## License

MIT
