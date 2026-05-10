import Order from "../models/orderModel.js";
import Payment from "../models/paymentModel.js";
import Promotion from "../models/promotionModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Report from "../models/reportModel.js";

class ReportService {
  /**
   * Save a generated report to the database
   * @param {String} reportType - Type of report
   * @param {String} userId - User who generated the report
   * @param {Object} reportData - The generated report data
   * @param {Object} filters - Filters used to generate the report
   * @returns {Object} Saved report document
   */
  async saveReport(reportType, userId, reportData, filters = {}) {
    try {
      const report = await Report.create({
        reportType,
        generatedBy: userId,
        reportData,
        filters,
      });
      return report;
    } catch (error) {
      throw new Error(`Failed to save report: ${error.message}`);
    }
  }

  /**
   * Get saved reports
   * @param {String} reportType - Type of report to retrieve
   * @param {String} userId - Optional user ID to filter by
   * @param {Number} limit - Number of reports to return
   * @param {Number} skip - Number of reports to skip
   * @returns {Array} Array of saved reports
   */
  async getSavedReports(reportType, userId = null, limit = 20, skip = 0) {
    const query = { reportType, isArchived: false };

    if (userId) {
      query.generatedBy = userId;
    }

    const reports = await Report.find(query)
      .populate("generatedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    return reports;
  }

  /**
   * Get a single saved report by ID
   * @param {String} reportId - Report ID
   * @returns {Object} Report document
   */
  async getSavedReportById(reportId) {
    const report = await Report.findById(reportId).populate(
      "generatedBy",
      "name email",
    );

    if (!report) {
      throw new Error("Report not found");
    }

    return report;
  }

  /**
   * Archive a saved report
   * @param {String} reportId - Report ID
   * @returns {Object} Updated report document
   */
  async archiveReport(reportId) {
    const report = await Report.findByIdAndUpdate(
      reportId,
      { isArchived: true },
      { new: true },
    );

    if (!report) {
      throw new Error("Report not found");
    }

    return report;
  }

  /**
   * Delete a saved report
   * @param {String} reportId - Report ID
   * @returns {Object} Deleted report document
   */
  async deleteReport(reportId) {
    const report = await Report.findByIdAndDelete(reportId);

    if (!report) {
      throw new Error("Report not found");
    }

    return report;
  }

  /**
   * Get report statistics
   * @returns {Object} Statistics about saved reports
   */
  async getReportStatistics() {
    const stats = await Report.aggregate([
      { $match: { isArchived: false } },
      {
        $group: {
          _id: "$reportType",
          count: { $sum: 1 },
          lastGenerated: { $max: "$createdAt" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return stats;
  }

  /**
   * Generate a sales report
   * @param {String} startDate - Start date (ISO format)
   * @param {String} endDate - End date (ISO format)
   * @param {String} categoryId - Optional category filter
   * @param {String} userId - Optional user ID to save the report
   * @returns {Object} Sales report data
   */
  async generateSalesReport(
    startDate,
    endDate,
    categoryId = null,
    userId = null,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) {
      throw new Error("Invalid date format");
    }

    if (start > end) {
      throw new Error("Start date must be before end date");
    }

    // Build match stage
    const matchStage = {
      createdAt: { $gte: start, $lte: end },
      status: { $in: ["confirmed", "dispatched", "delivered"] },
    };

    // Get orders with sales data
    const salesData = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
          totalDiscount: { $sum: "$discountAmount" },
          averageOrderValue: { $avg: "$totalAmount" },
          minOrderValue: { $min: "$totalAmount" },
          maxOrderValue: { $max: "$totalAmount" },
        },
      },
    ]);

    // Get sales by status
    const salesByStatus = await Order.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    // Get top products
    const topProducts = await Order.aggregate([
      { $match: matchStage },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.quantity", "$items.price"] },
          },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
    ]);

    const reportData = {
      period: { startDate, endDate },
      summary: salesData[0] || {
        totalSales: 0,
        totalOrders: 0,
        totalDiscount: 0,
        averageOrderValue: 0,
      },
      byStatus: salesByStatus,
      topProducts,
    };

    // Save report if userId is provided
    if (userId) {
      await this.saveReport("sales", userId, reportData, {
        startDate,
        endDate,
        categoryId,
      });
    }

    return reportData;
  }

  /**
   * Generate a product performance report
   * @param {String} type - Report type (top-selling, low-stock, all)
   * @param {String} userId - Optional user ID to save the report
   * @returns {Object} Product report data
   */
  async generateProductReport(type = "all", userId = null) {
    let pipeline = [];

    if (type === "top-selling") {
      pipeline = [
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.product",
            totalQuantity: { $sum: "$items.quantity" },
            totalRevenue: {
              $sum: { $multiply: ["$items.quantity", "$items.price"] },
            },
            orderCount: { $sum: 1 },
          },
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 20 },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "productDetails",
          },
        },
      ];

      const topSellingProducts = await Order.aggregate(pipeline);
      const reportData = { type: "top-selling", products: topSellingProducts };

      if (userId) {
        await this.saveReport("products", userId, reportData, { type });
      }

      return reportData;
    } else if (type === "low-stock") {
      const lowStockProducts = await Product.find({
        $expr: { $lt: ["$quantity", "$lowStockThreshold"] },
      }).sort({ quantity: 1 });

      const reportData = { type: "low-stock", products: lowStockProducts };

      if (userId) {
        await this.saveReport("products", userId, reportData, { type });
      }

      return reportData;
    } else {
      // All products with sales data
      const allProducts = await Product.aggregate([
        {
          $lookup: {
            from: "orders",
            let: { productId: "$_id" },
            pipeline: [
              { $unwind: "$items" },
              { $match: { $expr: { $eq: ["$items.product", "$$productId"] } } },
              {
                $group: {
                  _id: null,
                  totalQuantity: { $sum: "$items.quantity" },
                  totalRevenue: {
                    $sum: { $multiply: ["$items.quantity", "$items.price"] },
                  },
                },
              },
            ],
            as: "salesData",
          },
        },
        {
          $addFields: {
            totalQuantitySold: {
              $arrayElemAt: ["$salesData.totalQuantity", 0],
            },
            totalRevenue: { $arrayElemAt: ["$salesData.totalRevenue", 0] },
          },
        },
      ]);

      const reportData = { type: "all", products: allProducts };

      if (userId) {
        await this.saveReport("products", userId, reportData, { type });
      }

      return reportData;
    }
  }

  /**
   * Generate a promotion effectiveness report
   * @param {String} userId - Optional user ID to save the report
   * @returns {Object} Promotion report data
   */
  async generatePromotionReport(userId = null) {
    const promotions = await Promotion.find().sort({ usageCount: -1 });

    const promotionStats = await Promise.all(
      promotions.map(async (promo) => {
        const ordersWithPromo = await Order.aggregate([
          { $match: { promotion: promo._id } },
          {
            $group: {
              _id: null,
              totalOrders: { $sum: 1 },
              totalDiscountGiven: { $sum: "$discountAmount" },
              averageDiscount: { $avg: "$discountAmount" },
            },
          },
        ]);

        return {
          promotionId: promo._id,
          code: promo.code,
          discountType: promo.discountType,
          discountValue: promo.discountValue,
          usageCount: promo.usageCount,
          usageLimit: promo.usageLimit,
          isActive: promo.isActive,
          expiryDate: promo.expiryDate,
          stats: ordersWithPromo[0] || {
            totalOrders: 0,
            totalDiscountGiven: 0,
            averageDiscount: 0,
          },
        };
      }),
    );

    const totalDiscountGiven = promotionStats.reduce(
      (sum, promo) => sum + (promo.stats.totalDiscountGiven || 0),
      0,
    );

    const reportData = {
      totalPromotions: promotions.length,
      activePromotions: promotions.filter((p) => p.isActive).length,
      totalDiscountGiven,
      promotions: promotionStats,
    };

    if (userId) {
      await this.saveReport("promotions", userId, reportData, {});
    }

    return reportData;
  }

  /**
   * Generate a customer activity report
   * @param {Number} limit - Number of top customers to return
   * @param {String} userId - Optional user ID to save the report
   * @returns {Object} Customer report data
   */
  async generateCustomerReport(limit = 20, userId = null) {
    // Get top customers by order count and total spent
    const topCustomers = await Order.aggregate([
      {
        $group: {
          _id: "$customer",
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" },
          averageOrderValue: { $avg: "$totalAmount" },
          lastOrderDate: { $max: "$createdAt" },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
    ]);

    // Get new customers (registered in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newCustomers = await User.find({
      role: "customer",
      createdAt: { $gte: thirtyDaysAgo },
    }).sort({ createdAt: -1 });

    // Get customer statistics
    const totalCustomers = await User.countDocuments({ role: "customer" });
    const activeCustomers = await Order.distinct("customer");

    // Get customers by registration month
    const customersByMonth = await User.aggregate([
      { $match: { role: "customer" } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
    ]);

    const reportData = {
      summary: {
        totalCustomers,
        activeCustomers: activeCustomers.length,
        newCustomersLast30Days: newCustomers.length,
      },
      topCustomers,
      newCustomers,
      customersByMonth,
    };

    if (userId) {
      await this.saveReport("customers", userId, reportData, { limit });
    }

    return reportData;
  }

  /**
   * Generate a payment report
   * @param {String} startDate - Start date (ISO format)
   * @param {String} endDate - End date (ISO format)
   * @param {String} userId - Optional user ID to save the report
   * @returns {Object} Payment report data
   */
  async generatePaymentReport(startDate, endDate, userId = null) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) {
      throw new Error("Invalid date format");
    }

    if (start > end) {
      throw new Error("Start date must be before end date");
    }

    const paymentStats = await Payment.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
          averageAmount: { $avg: "$amount" },
        },
      },
    ]);

    const paymentByMethod = await Payment.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: "success",
        },
      },
      {
        $group: {
          _id: "$method",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const reportData = {
      period: { startDate, endDate },
      byStatus: paymentStats,
      byMethod: paymentByMethod,
    };

    if (userId) {
      await this.saveReport("payments", userId, reportData, {
        startDate,
        endDate,
      });
    }

    return reportData;
  }
}

export default new ReportService();
