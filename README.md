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

git clone https://github.com/jamaldeenusman4life/group2Capstone-supermarket.git
cd group2Capstone-supermarket

### 2 — Install dependencies

npm install

### 3 — Create and configure `.env`

Copy the example file and populate your configuration values:

cp .env.example .env

Update `.env` with your environment values, for example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=30d
PAYSTACK_SECRET=your_paystack_secret
```

### 4 — Start the server

```
npm run dev
```

If the server starts successfully, you should see:

```
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

---

## 🔐 Authentication

This API uses JWT Bearer token authentication.

After registering or logging in copy the token from the response and add it to your request headers: Bearer your_token_here

### Roles

| Role     | Permissions                                  |
| -------- | -------------------------------------------- |
| admin    | Full access to everything                    |
| cashier  | View products, process and view orders       |
| customer | Browse products, place orders, make payments |
| rider    | View and update assigned deliveries          |

---

## 📋 API Endpoints

### 🔐 Auth

| Method | Endpoint           | Description         | Access  |
| ------ | ------------------ | ------------------- | ------- |
| POST   | /api/auth/register | Register a new user | Public  |
| POST   | /api/auth/login    | Login user          | Public  |
| GET    | /api/auth/me       | Get logged in user  | Private |

### 📂 Categories

| Method | Endpoint            | Description         | Access |
| ------ | ------------------- | ------------------- | ------ |
| GET    | /api/categories     | Get all categories  | Public |
| GET    | /api/categories/:id | Get single category | Public |
| POST   | /api/categories     | Create category     | Admin  |
| PUT    | /api/categories/:id | Update category     | Admin  |
| DELETE | /api/categories/:id | Delete category     | Admin  |

### 📦 Products

| Method | Endpoint                          | Description            | Access |
| ------ | --------------------------------- | ---------------------- | ------ |
| GET    | /api/products                     | Get all products       | Public |
| GET    | /api/products/:id                 | Get single product     | Public |
| POST   | /api/products                     | Create product         | Admin  |
| PUT    | /api/products/:id                 | Update product         | Admin  |
| DELETE | /api/products/:id                 | Delete product         | Admin  |
| GET    | /api/products/inventory/low-stock | Get low stock products | Admin  |
| GET    | /api/products/inventory/expiring  | Get expiring products  | Admin  |
| PUT    | /api/products/inventory/:id/stock | Update stock           | Admin  |

### 🛒 Orders

| Method | Endpoint               | Description         | Access         |
| ------ | ---------------------- | ------------------- | -------------- |
| POST   | /api/orders            | Create order        | Customer       |
| GET    | /api/orders            | Get all orders      | Admin, Cashier |
| GET    | /api/orders/my-orders  | Get my orders       | Customer       |
| GET    | /api/orders/:id        | Get single order    | Admin, Cashier |
| PUT    | /api/orders/:id/status | Update order status | Admin, Cashier |
| PUT    | /api/orders/:id/cancel | Cancel order        | Customer       |

### 💳 Payments

| Method | Endpoint                        | Description          | Access          |
| ------ | ------------------------------- | -------------------- | --------------- |
| POST   | /api/payments/initiate          | Initiate payment     | Customer        |
| GET    | /api/payments/verify/:reference | Verify payment       | Private         |
| GET    | /api/payments/order/:orderId    | Get payment by order | Customer, Admin |
| GET    | /api/payments                   | Get all payments     | Admin           |

### 🚚 Delivery

| Method | Endpoint                     | Description            | Access          |
| ------ | ---------------------------- | ---------------------- | --------------- |
| GET    | /api/delivery                | Get all deliveries     | Admin           |
| POST   | /api/delivery                | Create delivery        | Admin           |
| GET    | /api/delivery/my-deliveries  | Get rider deliveries   | Rider           |
| GET    | /api/delivery/order/:orderId | Get delivery by order  | Customer, Admin |
| PUT    | /api/delivery/:id/assign     | Assign rider           | Admin           |
| PUT    | /api/delivery/:id/status     | Update delivery status | Rider, Admin    |

### 👤 Customers

| Method | Endpoint           | Description       | Access          |
| ------ | ------------------ | ----------------- | --------------- |
| GET    | /api/customers     | Get all customers | Admin           |
| GET    | /api/customers/:id | Get customer      | Customer, Admin |
| PUT    | /api/customers/:id | Update customer   | Customer        |

### 🏭 Suppliers

| Method | Endpoint                                  | Description                  | Access |
| ------ | ----------------------------------------- | ---------------------------- | ------ |
| GET    | /api/suppliers                            | Get all suppliers            | Admin  |
| POST   | /api/suppliers                            | Create supplier              | Admin  |
| GET    | /api/suppliers/:id                        | Get supplier                 | Admin  |
| PUT    | /api/suppliers/:id                        | Update supplier              | Admin  |
| DELETE | /api/suppliers/:id                        | Delete supplier              | Admin  |
| GET    | /api/suppliers/purchase-orders/all        | Get all purchase orders      | Admin  |
| POST   | /api/suppliers/purchase-orders            | Create purchase order        | Admin  |
| PUT    | /api/suppliers/purchase-orders/:id/status | Update purchase order status | Admin  |

### 🎯 Promotions

| Method | Endpoint               | Description           | Access   |
| ------ | ---------------------- | --------------------- | -------- |
| GET    | /api/promotions        | Get all promotions    | Public   |
| GET    | /api/promotions/active | Get active promotions | Public   |
| POST   | /api/promotions        | Create promotion      | Admin    |
| GET    | /api/promotions/:id    | Get promotion         | Private  |
| PUT    | /api/promotions/:id    | Update promotion      | Admin    |
| DELETE | /api/promotions/:id    | Delete promotion      | Admin    |
| POST   | /api/promotions/apply  | Apply promotion       | Customer |

### 🔔 Notifications

| Method | Endpoint                        | Description              | Access  |
| ------ | ------------------------------- | ------------------------ | ------- |
| GET    | /api/notifications              | Get notifications        | Private |
| GET    | /api/notifications/unread       | Get unread notifications | Private |
| GET    | /api/notifications/unread/count | Get unread count         | Private |
| PUT    | /api/notifications/read-all     | Mark all as read         | Private |
| PUT    | /api/notifications/:id/read     | Mark as read             | Private |
| DELETE | /api/notifications/:id          | Delete notification      | Private |

### 📊 Reports

| Method | Endpoint                | Description      | Access |
| ------ | ----------------------- | ---------------- | ------ |
| GET    | /api/reports/sales      | Sales report     | Admin  |
| GET    | /api/reports/products   | Product report   | Admin  |
| GET    | /api/reports/revenue    | Revenue report   | Admin  |
| GET    | /api/reports/customers  | Customer report  | Admin  |
| GET    | /api/reports/promotions | Promotion report | Admin  |

---

## 📧 Email Notifications

The system automatically sends emails for the following events:

| Event               | Recipient  | Description                              |
| ------------------- | ---------- | ---------------------------------------- |
| User Registration   | New user   | Welcome email with account details       |
| Order Placed        | Customer   | Order confirmation with order details    |
| Order Status Update | Customer   | Notification of status change            |
| Low Stock Alert     | All admins | Alert when product drops below threshold |

---

## 🔗 API Documentation

Import our Postman collection to test all endpoints:

[Download Postman Collection]
https://documenter.getpostman.com/view/52434386/2sBXwjuYHu

---

## 🌿 Branch Strategy

```
main ← final submission
└── dev ← everyone merges here
├── feature/auth
├── feature/products-inventory
├── feature/orders-payments
├── feature/delivery-customers-suppliers
└── feature/promotions-notifications-reports
```

## 📌 Notes

- This README describes the backend API only.
- The current project uses Express 5 and Mongoose.
- Keep this document updated as new endpoints are added.
