# 🛒 Supermarket Management System API

A RESTful API for a supermarket management system built with Node.js, Express, MongoDB, and JWT authentication.

---

## 📌 Project Overview

This repository contains the backend API for managing:
- Users and authentication
- Products and categories
- Orders and payments
- Delivery and customer records
- Suppliers, promotions, notifications, and reports

The application is structured using controllers, services, routes, models, middlewares, and validation logic.

---

## 🚀 Getting Started

### 1 — Clone the repository

```bash
git clone https://github.com/jamaldeenusman4life/group2Capstone-supermarket.git
cd group2Capstone-supermarket
```

### 2 — Install dependencies

```bash
npm install
```

### 3 — Create and configure `.env`

Copy the example file and populate your configuration values:

```bash
cp .env.example .env
```

Update `.env` with your environment values, for example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=30d
PAYSTACK_SECRET=your_paystack_secret
```

### 4 — Start the server

```bash
npm run dev
```

If the server starts successfully, you should see:

```bash
MongoDB Connected
Server running on http://localhost:5000
```

---

## 📁 Folder Structure

```text
project-root/
├── docs/
│   ├── erd.dbml
│   └── erd.png
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── validations/
│   └── utils/
├── app.js
├── server.js
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## 🔧 Main Files

- `server.js` — starts the Express server and loads environment variables
- `app.js` — configures middleware and registers all API routes
- `src/config/database.js` — MongoDB connection logic
- `src/routes/` — API route definitions
- `src/controllers/` — request handlers for each resource
- `src/services/` — business logic and data operations
- `src/models/` — Mongoose schemas and models
- `src/validations/` — Joi validation schemas
- `src/middlewares/` — authentication and request validation

---

## 🔐 Environment Variables

The project expects the following variables in `.env`:

- `PORT` — server port (example: `5000`)
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — JWT signing secret
- `JWT_EXPIRES_IN` — JWT expiration (example: `30d`)
- `PAYSTACK_SECRET` — Paystack secret key for payment integration

---

## 🧩 API Route Groups

The API includes the following route groups:

- `/api/auth`
- `/api/products`
- `/api/categories`
- `/api/orders`
- `/api/payments`
- `/api/deliveries`
- `/api/customers`
- `/api/suppliers`
- `/api/promotions`
- `/api/notifications`
- `/api/reports`

---

## 🔐 Example Authentication Endpoints

| Method | Endpoint | Description | Access |
| ------ | -------- | ----------- | ------ |
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login and receive a token | Public |
| GET | `/api/auth/me` | Get authenticated user profile | Private |

---

## 📌 Notes

- This README describes the backend API only.
- The current project uses Express 5 and Mongoose.
- Keep this document updated as new endpoints are added.

---

## 📚 Future Improvements

- Add a Postman collection or OpenAPI documentation
- Add automated tests for controllers and services
- Document role-based access controls and permissions
