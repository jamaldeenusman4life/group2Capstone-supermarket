import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reportType: {
      type: String,
      enum: ["sales", "products", "promotions", "customers", "payments"],
      required: [true, "Report type is required"],
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User who generated the report is required"],
    },
    filters: {
      type: Object, // Stores the filters used to generate the report (e.g., { startDate: "...", endDate: "..." })
      default: {},
    },
    reportData: {
      type: Object, // Stores the actual generated report data
      required: [true, "Report data is required"],
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Index for efficient querying
reportSchema.index({ reportType: 1, generatedBy: 1, createdAt: -1 });

export default mongoose.model("Report", reportSchema);
