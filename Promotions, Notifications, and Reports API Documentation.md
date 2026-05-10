# Promotions, Notifications, and Reports API Documentation

## Overview

This document provides comprehensive API documentation for the Promotions, Notifications, and Reports modules integrated into the supermarket system. All endpoints follow RESTful conventions and return JSON responses.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

All responses follow a consistent format:

**Success Response:**
```json
{
  "status": "success",
  "message": "Optional message",
  "data": {
    "key": "value"
  }
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Error description"
}
```

---

## Promotions Module

### 1. Create a Promotion

**Endpoint:** `POST /promotions`

**Access:** Admin only

**Request Body:**
```json
{
  "code": "SUMMER20",
  "discountType": "percentage",
  "discountValue": 20,
  "minOrderAmount": 50,
  "expiryDate": "2026-12-31T23:59:59Z",
  "usageLimit": 100
}
```

**Parameters:**
| Parameter | Type | Required | Description |
| :-------- | :--- | :------- | :---------- |
| `code` | String | Yes | Unique promotion code (will be converted to uppercase) |
| `discountType` | String | Yes | Either `"percentage"` or `"fixed"` |
| `discountValue` | Number | Yes | Discount amount (0-100 for percentage, any positive number for fixed) |
| `minOrderAmount` | Number | No | Minimum order amount to apply promotion (default: 0) |
| `expiryDate` | Date | Yes | Promotion expiry date (ISO format) |
| `usageLimit` | Number | No | Maximum number of times the promotion can be used |

**Response:**
```json
{
  "status": "success",
  "message": "Promotion created successfully",
  "data": {
    "promotion": {
      "_id": "60d5ec49c1234567890abcde",
      "code": "SUMMER20",
      "discountType": "percentage",
      "discountValue": 20,
      "minOrderAmount": 50,
      "expiryDate": "2026-12-31T23:59:59.000Z",
      "isActive": true,
      "usageLimit": 100,
      "usageCount": 0,
      "createdAt": "2026-05-09T18:30:00.000Z",
      "updatedAt": "2026-05-09T18:30:00.000Z"
    }
  }
}
```

---

### 2. Get All Promotions

**Endpoint:** `GET /promotions`

**Access:** Admin only

**Query Parameters:**
| Parameter | Type | Description |
| :-------- | :--- | :---------- |
| `isActive` | Boolean | Filter by active status (true/false) |
| `code` | String | Search by promotion code (partial match) |

**Response:**
```json
{
  "status": "success",
  "data": {
    "promotions": [
      {
        "_id": "60d5ec49c1234567890abcde",
        "code": "SUMMER20",
        "discountType": "percentage",
        "discountValue": 20,
        "minOrderAmount": 50,
        "expiryDate": "2026-12-31T23:59:59.000Z",
        "isActive": true,
        "usageLimit": 100,
        "usageCount": 15,
        "createdAt": "2026-05-09T18:30:00.000Z",
        "updatedAt": "2026-05-09T18:30:00.000Z"
      }
    ]
  }
}
```

---

### 3. Get a Single Promotion

**Endpoint:** `GET /promotions/:id`

**Access:** Admin only

**Response:**
```json
{
  "status": "success",
  "data": {
    "promotion": {
      "_id": "60d5ec49c1234567890abcde",
      "code": "SUMMER20",
      "discountType": "percentage",
      "discountValue": 20,
      "minOrderAmount": 50,
      "expiryDate": "2026-12-31T23:59:59.000Z",
      "isActive": true,
      "usageLimit": 100,
      "usageCount": 15,
      "createdAt": "2026-05-09T18:30:00.000Z",
      "updatedAt": "2026-05-09T18:30:00.000Z"
    }
  }
}
```

---

### 4. Update a Promotion

**Endpoint:** `PUT /promotions/:id`

**Access:** Admin only

**Request Body:** (Any of the following fields)
```json
{
  "discountValue": 25,
  "isActive": false,
  "usageLimit": 150
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Promotion updated successfully",
  "data": {
    "promotion": {
      "_id": "60d5ec49c1234567890abcde",
      "code": "SUMMER20",
      "discountType": "percentage",
      "discountValue": 25,
      "minOrderAmount": 50,
      "expiryDate": "2026-12-31T23:59:59.000Z",
      "isActive": false,
      "usageLimit": 150,
      "usageCount": 15,
      "createdAt": "2026-05-09T18:30:00.000Z",
      "updatedAt": "2026-05-09T18:35:00.000Z"
    }
  }
}
```

---

### 5. Delete a Promotion

**Endpoint:** `DELETE /promotions/:id`

**Access:** Admin only

**Response:**
```json
{
  "status": "success",
  "message": "Promotion deleted successfully"
}
```

---

### 6. Apply a Promotion to an Order

**Endpoint:** `POST /promotions/apply`

**Access:** Authenticated users

**Request Body:**
```json
{
  "code": "SUMMER20",
  "orderId": "60d5ec49c1234567890abcde"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Promotion applied successfully",
  "data": {
    "order": {
      "_id": "60d5ec49c1234567890abcde",
      "customer": "60d5ec49c1234567890abcde",
      "items": [
        {
          "product": "60d5ec49c1234567890abcde",
          "quantity": 2,
          "price": 50
        }
      ],
      "totalAmount": 100,
      "status": "pending",
      "promotion": "60d5ec49c1234567890abcde",
      "discountAmount": 20,
      "createdAt": "2026-05-09T18:30:00.000Z",
      "updatedAt": "2026-05-09T18:35:00.000Z"
    }
  }
}
```

---

### 7. Get Active Promotions

**Endpoint:** `GET /promotions/active`

**Access:** Public (no authentication required)

**Response:**
```json
{
  "status": "success",
  "data": {
    "promotions": [
      {
        "_id": "60d5ec49c1234567890abcde",
        "code": "SUMMER20",
        "discountType": "percentage",
        "discountValue": 20,
        "minOrderAmount": 50,
        "expiryDate": "2026-12-31T23:59:59.000Z",
        "isActive": true,
        "usageLimit": 100,
        "usageCount": 15,
        "createdAt": "2026-05-09T18:30:00.000Z",
        "updatedAt": "2026-05-09T18:30:00.000Z"
      }
    ]
  }
}
```

---

## Notifications Module

### 1. Get All Notifications

**Endpoint:** `GET /notifications`

**Access:** Authenticated users

**Query Parameters:**
| Parameter | Type | Description |
| :-------- | :--- | :---------- |
| `limit` | Number | Number of notifications to return (default: 20) |
| `skip` | Number | Number of notifications to skip for pagination (default: 0) |

**Response:**
```json
{
  "status": "success",
  "data": {
    "notifications": [
      {
        "_id": "60d5ec49c1234567890abcde",
        "user": "60d5ec49c1234567890abcde",
        "title": "Order Confirmed",
        "message": "Your order #12345 has been confirmed",
        "type": "order",
        "isRead": false,
        "relatedId": "60d5ec49c1234567890abcde",
        "createdAt": "2026-05-09T18:30:00.000Z"
      }
    ]
  }
}
```

---

### 2. Get Unread Notifications

**Endpoint:** `GET /notifications/unread`

**Access:** Authenticated users

**Response:**
```json
{
  "status": "success",
  "data": {
    "notifications": [
      {
        "_id": "60d5ec49c1234567890abcde",
        "user": "60d5ec49c1234567890abcde",
        "title": "Order Confirmed",
        "message": "Your order #12345 has been confirmed",
        "type": "order",
        "isRead": false,
        "relatedId": "60d5ec49c1234567890abcde",
        "createdAt": "2026-05-09T18:30:00.000Z"
      }
    ]
  }
}
```

---

### 3. Get Unread Notification Count

**Endpoint:** `GET /notifications/unread/count`

**Access:** Authenticated users

**Response:**
```json
{
  "status": "success",
  "data": {
    "unreadCount": 5
  }
}
```

---

### 4. Mark Notification as Read

**Endpoint:** `PUT /notifications/:id/read`

**Access:** Authenticated users

**Response:**
```json
{
  "status": "success",
  "message": "Notification marked as read",
  "data": {
    "notification": {
      "_id": "60d5ec49c1234567890abcde",
      "user": "60d5ec49c1234567890abcde",
      "title": "Order Confirmed",
      "message": "Your order #12345 has been confirmed",
      "type": "order",
      "isRead": true,
      "relatedId": "60d5ec49c1234567890abcde",
      "createdAt": "2026-05-09T18:30:00.000Z"
    }
  }
}
```

---

### 5. Mark All Notifications as Read

**Endpoint:** `PUT /notifications/mark-all/read`

**Access:** Authenticated users

**Response:**
```json
{
  "status": "success",
  "message": "All notifications marked as read",
  "data": {
    "result": {
      "acknowledged": true,
      "modifiedCount": 5,
      "upsertedId": null,
      "upsertedCount": 0,
      "matchedCount": 5
    }
  }
}
```

---

### 6. Delete a Notification

**Endpoint:** `DELETE /notifications/:id`

**Access:** Authenticated users

**Response:**
```json
{
  "status": "success",
  "message": "Notification deleted successfully"
}
```

---

### 7. Delete All Notifications

**Endpoint:** `DELETE /notifications`

**Access:** Authenticated users

**Response:**
```json
{
  "status": "success",
  "message": "All notifications deleted successfully",
  "data": {
    "result": {
      "acknowledged": true,
      "deletedCount": 5
    }
  }
}
```

---

## Reports Module

### 1. Generate Sales Report

**Endpoint:** `GET /reports/sales`

**Access:** Admin only

**Query Parameters:**
| Parameter | Type | Required | Description |
| :-------- | :--- | :------- | :---------- |
| `startDate` | Date | Yes | Start date (ISO format) |
| `endDate` | Date | Yes | End date (ISO format) |
| `categoryId` | String | No | Filter by product category |

**Response:**
```json
{
  "status": "success",
  "data": {
    "report": {
      "period": {
        "startDate": "2026-05-01T00:00:00.000Z",
        "endDate": "2026-05-31T23:59:59.000Z"
      },
      "summary": {
        "totalSales": 5000,
        "totalOrders": 25,
        "totalDiscount": 500,
        "averageOrderValue": 200,
        "minOrderValue": 50,
        "maxOrderValue": 800
      },
      "byStatus": [
        {
          "_id": "delivered",
          "count": 20,
          "total": 4500
        },
        {
          "_id": "pending",
          "count": 5,
          "total": 500
        }
      ],
      "topProducts": [
        {
          "_id": "60d5ec49c1234567890abcde",
          "totalQuantity": 150,
          "totalRevenue": 1500,
          "productDetails": [
            {
              "_id": "60d5ec49c1234567890abcde",
              "name": "Product Name",
              "price": 10
            }
          ]
        }
      ]
    }
  }
}
```

---

### 2. Generate Product Performance Report

**Endpoint:** `GET /reports/products`

**Access:** Admin only

**Query Parameters:**
| Parameter | Type | Description |
| :-------- | :--- | :---------- |
| `type` | String | Report type: `top-selling`, `low-stock`, or `all` (default: `all`) |

**Response:**
```json
{
  "status": "success",
  "data": {
    "report": {
      "type": "top-selling",
      "products": [
        {
          "_id": "60d5ec49c1234567890abcde",
          "totalQuantity": 150,
          "totalRevenue": 1500,
          "orderCount": 30,
          "productDetails": [
            {
              "_id": "60d5ec49c1234567890abcde",
              "name": "Product Name",
              "price": 10,
              "quantity": 500
            }
          ]
        }
      ]
    }
  }
}
```

---

### 3. Generate Promotion Report

**Endpoint:** `GET /reports/promotions`

**Access:** Admin only

**Response:**
```json
{
  "status": "success",
  "data": {
    "report": {
      "totalPromotions": 10,
      "activePromotions": 7,
      "totalDiscountGiven": 5000,
      "promotions": [
        {
          "promotionId": "60d5ec49c1234567890abcde",
          "code": "SUMMER20",
          "discountType": "percentage",
          "discountValue": 20,
          "usageCount": 150,
          "usageLimit": 500,
          "isActive": true,
          "expiryDate": "2026-12-31T23:59:59.000Z",
          "stats": {
            "totalOrders": 150,
            "totalDiscountGiven": 2000,
            "averageDiscount": 13.33
          }
        }
      ]
    }
  }
}
```

---

### 4. Generate Customer Report

**Endpoint:** `GET /reports/customers`

**Access:** Admin only

**Query Parameters:**
| Parameter | Type | Description |
| :-------- | :--- | :---------- |
| `limit` | Number | Number of top customers to return (default: 20) |

**Response:**
```json
{
  "status": "success",
  "data": {
    "report": {
      "summary": {
        "totalCustomers": 500,
        "activeCustomers": 350,
        "newCustomersLast30Days": 45
      },
      "topCustomers": [
        {
          "_id": "60d5ec49c1234567890abcde",
          "totalOrders": 25,
          "totalSpent": 5000,
          "averageOrderValue": 200,
          "lastOrderDate": "2026-05-09T18:30:00.000Z",
          "customerDetails": [
            {
              "_id": "60d5ec49c1234567890abcde",
              "name": "John Doe",
              "email": "john@example.com"
            }
          ]
        }
      ],
      "newCustomers": [
        {
          "_id": "60d5ec49c1234567890abcde",
          "name": "Jane Smith",
          "email": "jane@example.com",
          "createdAt": "2026-05-08T10:30:00.000Z"
        }
      ],
      "customersByMonth": [
        {
          "_id": {
            "year": 2026,
            "month": 5
          },
          "count": 45
        }
      ]
    }
  }
}
```

---

### 5. Generate Payment Report

**Endpoint:** `GET /reports/payments`

**Access:** Admin only

**Query Parameters:**
| Parameter | Type | Required | Description |
| :-------- | :--- | :------- | :---------- |
| `startDate` | Date | Yes | Start date (ISO format) |
| `endDate` | Date | Yes | End date (ISO format) |

**Response:**
```json
{
  "status": "success",
  "data": {
    "report": {
      "period": {
        "startDate": "2026-05-01T00:00:00.000Z",
        "endDate": "2026-05-31T23:59:59.000Z"
      },
      "byStatus": [
        {
          "_id": "success",
          "count": 200,
          "totalAmount": 50000,
          "averageAmount": 250
        },
        {
          "_id": "pending",
          "count": 10,
          "totalAmount": 2500,
          "averageAmount": 250
        },
        {
          "_id": "failed",
          "count": 5,
          "totalAmount": 1250,
          "averageAmount": 250
        }
      ],
      "byMethod": [
        {
          "_id": "card",
          "count": 150,
          "totalAmount": 37500
        },
        {
          "_id": "transfer",
          "count": 40,
          "totalAmount": 10000
        },
        {
          "_id": "cash",
          "count": 10,
          "totalAmount": 2500
        }
      ]
    }
  }
}
```

---

## Error Handling

The API returns appropriate HTTP status codes:

| Status Code | Description |
| :---------- | :---------- |
| `200` | OK - Request successful |
| `201` | Created - Resource successfully created |
| `400` | Bad Request - Invalid input or validation error |
| `401` | Unauthorized - Missing or invalid authentication |
| `403` | Forbidden - Insufficient permissions |
| `404` | Not Found - Resource not found |
| `500` | Internal Server Error - Server error |

**Error Response Example:**
```json
{
  "status": "error",
  "message": "Promotion code already exists"
}
```

---

## Integration Notes

### Notification Triggers

Notifications are automatically created when the following events occur:

- **Order Events:** When an order status changes (pending → confirmed → dispatched → delivered)
- **Delivery Events:** When a delivery status changes
- **Restock Events:** When product stock falls below the low stock threshold
- **Promotion Events:** When a new promotion is created or activated

### Promotion Application

When applying a promotion to an order:

1. The promotion code is validated (existence, active status, expiry date, usage limit)
2. The order is checked against the minimum order amount requirement
3. The discount is calculated based on the discount type (percentage or fixed)
4. The order is updated with the promotion ID and discount amount
5. The promotion usage count is incremented

---

## Testing

### Sample cURL Commands

**Create a Promotion:**
```bash
curl -X POST http://localhost:5000/api/promotions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "code": "SUMMER20",
    "discountType": "percentage",
    "discountValue": 20,
    "minOrderAmount": 50,
    "expiryDate": "2026-12-31T23:59:59Z",
    "usageLimit": 100
  }'
```

**Get All Notifications:**
```bash
curl -X GET http://localhost:5000/api/notifications \
  -H "Authorization: Bearer <token>"
```

**Generate Sales Report:**
```bash
curl -X GET "http://localhost:5000/api/reports/sales?startDate=2026-05-01&endDate=2026-05-31" \
  -H "Authorization: Bearer <token>"
```

---

## Conclusion

This API documentation provides a complete reference for the Promotions, Notifications, and Reports modules. For additional support or questions, please refer to the project README or contact the development team.
