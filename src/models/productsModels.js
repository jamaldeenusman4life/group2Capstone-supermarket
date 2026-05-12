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
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category.id",
      required: [true, "A product must be assigned to a category"],
    },
    supplier_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "supplier.id",
      required: [true, " A product must be assigned to supplier"],
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
      Validate: {
        validator: function (value) {
          if (!value) return true;
          return value > Date.now();
        },
        message:
          "The expiry date must be in future. we dont sell expired goods!",
      },
    },
    images: {
      type: ["String"],
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
  },
  { timestamps: true },
);
productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    ((this.name = this.name.charAt(0).toUpperCase() + this.name), slice(1));
  }
  if (this.quantity === 0) {
    this.isAvailable = false;
  } else {
    this.isAvailable = true;
  }
  next();
});
const product = mongoose.model("Product", productSchema);
export default product;
