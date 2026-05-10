# Implementation Guide: Promotions, Notifications, and Reports

## Overview

This guide provides developers with instructions on how to integrate, test, and extend the Promotions, Notifications, and Reports modules in the supermarket application.

## Branch Information

**Branch Name:** `feature/promotions-notifications-reports`

**Base Branch:** `dev`

**Status:** Ready for integration

## Project Structure

```
src/
├── models/
│   ├── promotionModel.js          # Promotion schema and model
│   └── notificationModel.js       # Notification schema and model
├── services/
│   ├── promotionService.js        # Promotion business logic
│   ├── notificationService.js     # Notification business logic
│   └── reportService.js           # Report generation logic
├── controllers/
│   ├── promotionController.js     # Promotion HTTP handlers
│   ├── notificationController.js  # Notification HTTP handlers
│   └── reportController.js        # Report HTTP handlers
└── routes/
    ├── promotionRoute.js          # Promotion endpoints
    ├── notificationRoute.js       # Notification endpoints
    └── reportRoute.js             # Report endpoints

Documentation/
├── API_DOCUMENTATION.md           # Complete API reference
├── design_document.md             # Architecture and design decisions
└── IMPLEMENTATION_GUIDE.md        # This file
```

## Installation and Setup

### Prerequisites

- Node.js v16 or higher
- MongoDB instance running
- Existing authentication system (JWT-based)

### Steps

1. **Checkout the feature branch:**
   ```bash
   git checkout feature/promotions-notifications-reports
   ```

2. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

3. **Verify environment variables:**
   Ensure your `.env` file contains:
   ```
   MONGO_URI=mongodb://your-mongodb-url
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=7d
   PORT=5000
   ```

4. **Start the server:**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

## Module Details

### 1. Promotions Module

#### Features

- Create, read, update, and delete promotions
- Support for percentage and fixed discounts
- Usage limits and expiry dates
- Minimum order amount requirements
- Apply promotions to orders
- Track promotion usage

#### Key Files

- `promotionModel.js` - Mongoose schema with validation
- `promotionService.js` - Business logic for promotion operations
- `promotionController.js` - HTTP request handlers
- `promotionRoute.js` - API endpoints

#### Usage Example

```javascript
import promotionService from './src/services/promotionService.js';

// Create a promotion
const promotion = await promotionService.createPromotion({
  code: 'SUMMER20',
  discountType: 'percentage',
  discountValue: 20,
  minOrderAmount: 50,
  expiryDate: '2026-12-31T23:59:59Z',
  usageLimit: 100
});

// Apply promotion to an order
const updatedOrder = await promotionService.applyPromotion('SUMMER20', orderId);
```

#### API Endpoints

| Method | Endpoint | Access |
| :----- | :------- | :----- |
| `POST` | `/api/promotions` | Admin |
| `GET` | `/api/promotions` | Admin |
| `GET` | `/api/promotions/:id` | Admin |
| `PUT` | `/api/promotions/:id` | Admin |
| `DELETE` | `/api/promotions/:id` | Admin |
| `POST` | `/api/promotions/apply` | Authenticated |
| `GET` | `/api/promotions/active` | Public |

---

### 2. Notifications Module

#### Features

- Create notifications for users
- Retrieve notifications with pagination
- Mark notifications as read/unread
- Delete notifications
- Bulk notification creation
- Unread notification count
- Notification types: order, delivery, restock, promotion

#### Key Files

- `notificationModel.js` - Mongoose schema
- `notificationService.js` - Business logic for notifications
- `notificationController.js` - HTTP request handlers
- `notificationRoute.js` - API endpoints

#### Usage Example

```javascript
import notificationService from './src/services/notificationService.js';

// Create a notification
const notification = await notificationService.createNotification(
  userId,
  'Order Confirmed',
  'Your order has been confirmed and will be dispatched soon',
  'order',
  orderId
);

// Get unread notifications
const unreadNotifications = await notificationService.getUnreadNotifications(userId);

// Mark as read
const updated = await notificationService.markNotificationAsRead(notificationId, userId);
```

#### API Endpoints

| Method | Endpoint | Access |
| :----- | :------- | :----- |
| `GET` | `/api/notifications` | Authenticated |
| `GET` | `/api/notifications/unread` | Authenticated |
| `GET` | `/api/notifications/unread/count` | Authenticated |
| `PUT` | `/api/notifications/:id/read` | Authenticated |
| `PUT` | `/api/notifications/mark-all/read` | Authenticated |
| `DELETE` | `/api/notifications/:id` | Authenticated |
| `DELETE` | `/api/notifications` | Authenticated |

---

### 3. Reports Module

#### Features

- Sales reports (by date range, product, category)
- Product performance reports (top-selling, low-stock)
- Promotion effectiveness reports
- Customer activity reports
- Payment reports

#### Key Files

- `reportService.js` - Report generation logic using MongoDB aggregation
- `reportController.js` - HTTP request handlers
- `reportRoute.js` - API endpoints

#### Usage Example

```javascript
import reportService from './src/services/reportService.js';

// Generate sales report
const salesReport = await reportService.generateSalesReport(
  '2026-05-01',
  '2026-05-31'
);

// Generate product report
const productReport = await reportService.generateProductReport('top-selling');

// Generate customer report
const customerReport = await reportService.generateCustomerReport(20);
```

#### API Endpoints

| Method | Endpoint | Access |
| :----- | :------- | :----- |
| `GET` | `/api/reports/sales` | Admin |
| `GET` | `/api/reports/products` | Admin |
| `GET` | `/api/reports/promotions` | Admin |
| `GET` | `/api/reports/customers` | Admin |
| `GET` | `/api/reports/payments` | Admin |

---

## Integration with Existing Modules

### Order Processing

When an order is created or updated, integrate with the Promotions module:

```javascript
// In orderService.js
import promotionService from './promotionService.js';

// When applying a promotion to an order
const order = await promotionService.applyPromotion(promotionCode, orderId);
```

### Event-Driven Notifications

Create notifications when events occur:

```javascript
// In orderService.js (when order status changes)
import notificationService from './notificationService.js';

await notificationService.createNotification(
  order.customer,
  'Order Status Updated',
  `Your order status has changed to: ${newStatus}`,
  'order',
  order._id
);
```

### Admin Dashboard Integration

Reports can be fetched and displayed on an admin dashboard:

```javascript
// In a frontend component or admin service
const salesReport = await fetch('/api/reports/sales?startDate=2026-05-01&endDate=2026-05-31')
  .then(res => res.json());

console.log(salesReport.data.report);
```

## Testing

### Unit Testing

Create test files for services:

```javascript
// test/promotionService.test.js
import promotionService from '../src/services/promotionService.js';

describe('PromotionService', () => {
  it('should create a promotion', async () => {
    const promotion = await promotionService.createPromotion({
      code: 'TEST10',
      discountType: 'percentage',
      discountValue: 10,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });
    
    expect(promotion.code).toBe('TEST10');
  });
});
```

### API Testing with cURL

```bash
# Create a promotion
curl -X POST http://localhost:5000/api/promotions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "code": "TEST20",
    "discountType": "percentage",
    "discountValue": 20,
    "expiryDate": "2026-12-31T23:59:59Z"
  }'

# Get notifications
curl -X GET http://localhost:5000/api/notifications \
  -H "Authorization: Bearer YOUR_TOKEN"

# Generate sales report
curl -X GET "http://localhost:5000/api/reports/sales?startDate=2026-05-01&endDate=2026-05-31" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Postman Collection

A Postman collection can be created with all endpoints for easy testing. Export the collection from Postman and share with the team.

## Error Handling

All modules follow consistent error handling patterns:

```javascript
try {
  const result = await promotionService.createPromotion(data);
  res.status(201).json({ status: 'success', data: { promotion: result } });
} catch (error) {
  res.status(400).json({ status: 'error', message: error.message });
}
```

## Performance Considerations

### Database Indexing

Indexes are already created in the models:

- `Promotion`: Indexed on `code`, `isActive`, and `expiryDate`
- `Notification`: Indexed on `user` and `isRead`, and `user` with `createdAt`

### Query Optimization

Reports use MongoDB aggregation pipelines for efficient data retrieval:

```javascript
// Example: Sales report aggregation
const salesData = await Order.aggregate([
  { $match: matchStage },
  { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } }
]);
```

## Future Enhancements

1. **WebSocket Notifications:** Real-time notification delivery using Socket.io
2. **Email Notifications:** Send email notifications for important events
3. **Scheduled Reports:** Automatic report generation and email delivery
4. **Advanced Filtering:** More granular filtering options for reports
5. **Export Functionality:** Export reports to CSV, PDF, or Excel
6. **Notification Preferences:** Allow users to customize notification types
7. **Promotion Analytics:** Track promotion performance metrics

## Troubleshooting

### Issue: Promotion code not found

**Solution:** Ensure the promotion code is uppercase and matches exactly. The service converts codes to uppercase automatically.

### Issue: Notification not appearing

**Solution:** Verify that the user ID is valid and the notification was created with the correct user reference.

### Issue: Report returns empty data

**Solution:** Check the date range and ensure there are orders in the database within that period.

### Issue: Authentication errors on protected routes

**Solution:** Ensure the JWT token is included in the Authorization header with the format: `Bearer <token>`

## Deployment Checklist

- [ ] All tests pass
- [ ] Environment variables are configured
- [ ] Database indexes are created
- [ ] Authentication middleware is properly configured
- [ ] CORS settings are appropriate for production
- [ ] Error handling is comprehensive
- [ ] API documentation is up-to-date
- [ ] Code is reviewed and approved
- [ ] Branch is merged into `dev` or `main`
- [ ] Deployment pipeline is triggered

## Support and Contribution

For issues, questions, or contributions:

1. Create an issue on the GitHub repository
2. Follow the existing code style and conventions
3. Write tests for new features
4. Update documentation accordingly
5. Submit a pull request with a clear description

## References

- [API Documentation](./API_DOCUMENTATION.md)
- [Design Document](./design_document.md)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)

---

**Last Updated:** May 9, 2026

**Version:** 1.0.0

**Status:** Production Ready
