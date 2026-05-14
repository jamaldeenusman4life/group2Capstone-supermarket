import reportService from "../services/reportService.js";

/**
 * Generate a sales report
 */
export const generateSalesReport = async (req, res) => {
  try {
    const { startDate, endDate, categoryId, save } = req.query;
    const userId = req.user?.id;

    if (!startDate || !endDate) {
      return res.status(400).json({
        status: "error",
        message: "Start date and end date are required",
      });
    }

    const report = await reportService.generateSalesReport(
      startDate,
      endDate,
      categoryId,
      save === "true" && userId ? userId : null
    );

    res.status(200).json({
      status: "success",
      data: { report },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

/**
 * Generate a product performance report
 */
export const generateProductReport = async (req, res) => {
  try {
    const { type, save } = req.query;
    const reportType = type || "all";
    const userId = req.user?.id;

    const report = await reportService.generateProductReport(
      reportType,
      save === "true" && userId ? userId : null
    );

    res.status(200).json({
      status: "success",
      data: { report },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

/**
 * Generate a promotion effectiveness report
 */
export const generatePromotionReport = async (req, res) => {
  try {
    const { save } = req.query;
    const userId = req.user?.id;

    const report = await reportService.generatePromotionReport(
      save === "true" && userId ? userId : null
    );

    res.status(200).json({
      status: "success",
      data: { report },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

/**
 * Generate a customer activity report
 */
export const generateCustomerReport = async (req, res) => {
  try {
    const { limit, save } = req.query;
    const reportLimit = parseInt(limit) || 20;
    const userId = req.user?.id;

    const report = await reportService.generateCustomerReport(
      reportLimit,
      save === "true" && userId ? userId : null
    );

    res.status(200).json({
      status: "success",
      data: { report },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

/**
 * Generate a payment report
 */
export const generatePaymentReport = async (req, res) => {
  try {
    const { startDate, endDate, save } = req.query;
    const userId = req.user?.id;

    if (!startDate || !endDate) {
      return res.status(400).json({
        status: "error",
        message: "Start date and end date are required",
      });
    }

    const report = await reportService.generatePaymentReport(
      startDate,
      endDate,
      save === "true" && userId ? userId : null
    );

    res.status(200).json({
      status: "success",
      data: { report },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

/**
 * Get saved reports
 */
export const getSavedReports = async (req, res) => {
  try {
    const { type, limit, skip } = req.query;
    const userId = req.user?.id;

    if (!type) {
      return res.status(400).json({
        status: "error",
        message: "Report type is required",
      });
    }

    const reportLimit = parseInt(limit) || 20;
    const reportSkip = parseInt(skip) || 0;

    const reports = await reportService.getSavedReports(
      type,
      userId,
      reportLimit,
      reportSkip
    );

    res.status(200).json({
      status: "success",
      data: { reports },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

/**
 * Get a single saved report by ID
 */
export const getSavedReportById = async (req, res) => {
  try {
    const report = await reportService.getSavedReportById(req.params.id);

    res.status(200).json({
      status: "success",
      data: { report },
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

/**
 * Archive a saved report
 */
export const archiveReport = async (req, res) => {
  try {
    const report = await reportService.archiveReport(req.params.id);

    res.status(200).json({
      status: "success",
      message: "Report archived successfully",
      data: { report },
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

/**
 * Delete a saved report
 */
export const deleteReport = async (req, res) => {
  try {
    await reportService.deleteReport(req.params.id);

    res.status(200).json({
      status: "success",
      message: "Report deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

/**
 * Get report statistics
 */
export const getReportStatistics = async (req, res) => {
  try {
    const stats = await reportService.getReportStatistics();

    res.status(200).json({
      status: "success",
      data: { stats },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};