# Design Document: Promotions, Notifications, and Reports Modules

## 1. Introduction

This document outlines the design for the Promotions, Notifications, and Reports modules to be integrated into the existing `group2Capstone-supermarket` project. The project utilizes Node.js with Express for the API, Mongoose for MongoDB object modeling, and JWT for authentication. The database schema, as defined in `erd.dbml`, already includes `promotions` and `notifications` tables, providing a solid foundation for these features.

## 2. Promotions Module Design

The Promotions module will enable the creation, management, and application of promotional codes within the supermarket system. Promotions can offer discounts on orders, influencing the `totalAmount` and `discountAmount` fields in the `orders` collection.

### 2.1. Data Model

The `promotions` collection schema is already defined in `erd.dbml` [1]:

```dbml
Table promotions {
  id ObjectId [pk]
  code string [not null, unique]
  discountType string [note: 'percentage, fixed']
  discountValue number [not null]
  minOrderAmount number [default: 0]
  expiryDate datetime
  isActive boolean [default: true]
  usageLimit number
  usageCount number [default: 0]
  createdAt datetime
  updatedAt datetime
}
```

**`promotionModel.js`:** A Mongoose schema and model will be created based on this definition.

### 2.2. API Endpoints

All promotion management endpoints will require authentication and authorization (e.g., `admin` role).

| Method | Endpoint                 | Description                               | Access Control |
| :----- | :----------------------- | :---------------------------------------- | :------------- |
| `POST` | `/api/promotions`        | Create a new promotion                    | Admin          |
| `GET`  | `/api/promotions`        | Get all promotions (with optional filters) | Admin          |
| `GET`  | `/api/promotions/:id`    | Get a single promotion by ID              | Admin          |
| `PUT`  | `/api/promotions/:id`    | Update an existing promotion              | Admin          |
| `DELETE`| `/api/promotions/:id`    | Delete a promotion                        | Admin          |
| `POST` | `/api/promotions/apply`  | Apply a promotion code to an order        | Authenticated User |

### 2.3. Service Layer (`promotionService.js`)

*   **`createPromotion(promotionData)`:** Validates input, ensures unique `code`, and creates a new promotion.
*   **`getAllPromotions(filters)`:** Retrieves promotions, supporting filtering by `isActive`, `expiryDate`, etc.
*   **`getPromotionById(id)`:** Retrieves a single promotion.
*   **`updatePromotion(id, updateData)`:** Updates promotion details, including validation for `expiryDate` and `usageLimit`.
*   **`deletePromotion(id)`:** Deletes a promotion.
*   **`applyPromotion(code, orderId)`:** Validates the promotion code (existence, expiry, usage limit, `minOrderAmount`), calculates discount, and updates the `Order` with `promotion_id` and `discountAmount`.

### 2.4. Controller Layer (`promotionController.js`)

*   Handles incoming HTTP requests for promotion-related operations.
*   Calls appropriate methods in `promotionService.js`.
*   Formats responses (success/error) consistently with existing API patterns.

### 2.5. Integration with Orders

*   The `Order` model already has `promotion` and `discountAmount` fields [2].
*   When applying a promotion, the `orderService` will interact with `promotionService` to validate and apply the discount.

## 3. Notifications Module Design

The Notifications module will provide a mechanism to inform users about important events within the system, such as order status updates, delivery changes, low stock alerts, and new promotions.

### 3.1. Data Model

The `notifications` collection schema is already defined in `erd.dbml` [1]:

```dbml
Table notifications {
  id ObjectId [pk]
  user_id ObjectId [ref: > users.id]
  title string [not null]
  message string [not null]
  type string [note: 'order, delivery, restock, promotion']
  isRead boolean [default: false]
  createdAt datetime
}
```

**`notificationModel.js`:** A Mongoose schema and model will be created based on this definition.

### 3.2. API Endpoints

All notification endpoints will require user authentication.

| Method | Endpoint                     | Description                               | Access Control |
| :----- | :--------------------------- | :---------------------------------------- | :------------- |
| `GET`  | `/api/notifications`         | Get all notifications for the authenticated user | Authenticated User |
| `GET`  | `/api/notifications/unread`  | Get unread notifications for the authenticated user | Authenticated User |
| `PUT`  | `/api/notifications/:id/read`| Mark a notification as read               | Authenticated User |

### 3.3. Service Layer (`notificationService.js`)

*   **`createNotification(userId, title, message, type)`:** Creates a new notification for a specific user.
*   **`getNotifications(userId, isRead)`:** Retrieves notifications for a user, with an option to filter by read status.
*   **`markNotificationAsRead(notificationId, userId)`:** Marks a specific notification as read, ensuring the notification belongs to the user.

### 3.4. Controller Layer (`notificationController.js`)

*   Handles incoming HTTP requests for notification-related operations.
*   Calls appropriate methods in `notificationService.js`.
*   Formats responses consistently.

### 3.5. Integration with Other Modules

Notifications will be triggered by events in other modules:

*   **Orders:** When an order status changes (e.g., `pending` to `confirmed`, `dispatched`, `delivered`, `cancelled`).
*   **Deliveries:** When a delivery status changes (e.g., `assigned`, `pickedup`, `ontheway`, `delivered`).
*   **Products:** When product stock falls below `lowStockThreshold` (for admin/supplier) or a new product is added.
*   **Promotions:** When a new promotion is created (for all users or specific roles).

## 4. Reports Module Design

The Reports module will provide aggregated insights into various aspects of the supermarket operations, such as sales performance, product popularity, and promotion effectiveness. Reports will primarily be read-only views of existing data.

### 4.1. Data Model

No dedicated data model for reports. Reports will be generated by aggregating data from existing collections (`orders`, `products`, `promotions`, `users`, etc.).

### 4.2. API Endpoints

All report endpoints will require authentication and authorization (e.g., `admin` role).

| Method | Endpoint                     | Description                               | Access Control |
| :----- | :--------------------------- | :---------------------------------------- | :------------- |
| `GET`  | `/api/reports/sales`         | Generate a sales report (e.g., by date range, product category) | Admin          |
| `GET`  | `/api/reports/products`      | Generate a product performance report (e.g., top-selling, low-stock) | Admin          |
| `GET`  | `/api/reports/promotions`    | Generate a promotion usage report (e.g., most used, effective discounts) | Admin          |
| `GET`  | `/api/reports/customers`     | Generate a customer activity report (e.g., top customers, new registrations) | Admin          |

### 4.3. Service Layer (`reportService.js`)

*   **`generateSalesReport(startDate, endDate, categoryId)`:** Aggregates order data to provide total sales, average order value, sales by product/category, etc.
*   **`generateProductReport(type)`:** Aggregates product data to identify top-selling products, products with low stock, etc.
*   **`generatePromotionReport()`:** Aggregates promotion usage data to show which promotions are most effective, total discounts given, etc.
*   **`generateCustomerReport()`:** Aggregates user and order data to identify active customers, new customer registrations, etc.

### 4.4. Controller Layer (`reportController.js`)

*   Handles incoming HTTP requests for report generation.
*   Parses query parameters (e.g., `startDate`, `endDate`, `type`).
*   Calls appropriate methods in `reportService.js`.
*   Formats aggregated data into a structured JSON response.

## 5. References

[1] `erd.dbml` - Database schema definition file in the project repository.
[2] `orderModel.js` - Mongoose schema for the Order model, located at `/home/ubuntu/supermarket_project/src/models/orderModel.js`.
