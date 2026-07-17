# Subscription Tracker API

A RESTful API for tracking subscriptions and sending automated renewal reminder emails. Built with Node.js, Express, MongoDB, and Upstash Workflow.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JSON Web Tokens (JWT)
- **Email:** Nodemailer (Gmail)
- **Workflow/Scheduling:** Upstash QStash & Workflow
- **Security:** Arcjet (rate limiting, bot detection)
- **Environment:** dotenv

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
│   └── error.middleware.js
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
│   └── send-email.js
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

# ARCJET
ARCJET_KEY="your_arcjet_key"
ARCJET_ENV="development"

# UPSTASH
QSTASH_TOKEN="your_qstash_token"

# SERVER
SERVER_URL=http://localhost:5500

# NODEMAILER
EMAIL_PASSWORD=your_gmail_app_password
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
| POST | `/api/v1/auth/sign-in` | Sign in and get token | No |
| POST | `/api/v1/auth/sign-out` | Sign out | No |

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/users` | Get all users | Yes |
| GET | `/api/v1/users/:id` | Get user by ID | Yes |

### Subscriptions

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/subscriptions` | Get all subscriptions | Yes |
| POST | `/api/v1/subscriptions` | Create a subscription | Yes |
| GET | `/api/v1/subscriptions/:id` | Get subscription by ID | Yes |
| PUT | `/api/v1/subscriptions/:id` | Update subscription | Yes |
| DELETE | `/api/v1/subscriptions/:id` | Delete subscription | Yes |
| GET | `/api/v1/subscriptions/user/:id` | Get user subscriptions | Yes |
| PUT | `/api/v1/subscriptions/:id/cancel` | Cancel subscription | Yes |
| GET | `/api/v1/subscriptions/upcoming-renewals` | Get upcoming renewals | Yes |

### Workflows

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/workflows/subscription/reminder` | Trigger reminder workflow | No |

---

## Authentication

All protected routes require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

Get a token by signing in via `POST /api/v1/auth/sign-in`.

---

## Subscription Model

```json
{
  "name": "Netflix Premium",
  "price": 15.99,
  "currency": "USD",
  "frequency": "monthly",
  "category": "entertainment",
  "startDate": "2026-07-01T00:00:00.000Z",
  "paymentMethod": "Credit Card"
}
```

| Field | Type | Options |
|-------|------|---------|
| name | String | 2–100 characters |
| price | Number | Min 0.01 |
| currency | String | USD, EUR, GBP |
| frequency | String | daily, weekly, monthly, yearly |
| category | String | sports, news, entertainment, lifestyle, technology, finance, politics, other |
| paymentMethod | String | Any string |
| status | String | active, cancelled, expired (default: active) |
| startDate | Date | Must be in the past |
| renewalDate | Date | Auto-calculated if not provided |

---

## Reminder Workflow

When a subscription is created in production, Upstash Workflow automatically:

1. Fetches the subscription from the database
2. Checks if the subscription is active and renewal date is in the future
3. Sleeps until each reminder date
4. Sends a reminder email at **7, 5, 2, and 1 days** before renewal

> **Note:** The workflow trigger is only active in production (`NODE_ENV=production`). In development, a public URL (e.g. via ngrok) is required for Upstash to reach your local server.

---

## Security

- **Rate limiting** — limits requests per IP via Arcjet token bucket
- **Bot detection** — blocks automated requests in production (DRY_RUN in development)
- **Password hashing** — bcrypt with salt rounds of 10
- **JWT authentication** — tokens expire after 1 day by default

---

## Scripts

```bash
npm run dev     # Start development server with nodemon
npm start       # Start production server
```

---

## License

MIT
