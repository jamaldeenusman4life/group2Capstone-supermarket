import mongoose from "mongoose";
export const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [3, "Product name must be at least 3 charactera"],
    },
    description: {
      type: String,
      maxlength: [50, "Description is too long"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required.(NN)"],
      min: [0.01, "Price must be greater than zero"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "A product must be assigned to a category"],
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      default: null,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "stock cannot be negative"],
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: [0, "Threshold cannot be negative"],
    },
    expiryDate: {
      type: Date,
      validate: {
        validator: function (value) {
          if (!value) return true;
          return value > Date.now();
        },
        message:
          "The expiry date must be in future. we dont sell expired goods!",
      },
    },
    images: {
      type: [String],
      validate: {
        validator: function (array) {
          return array.length <= 5;
        },
        message: "You can only upload 5 images",
      },
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);
export default Product;
