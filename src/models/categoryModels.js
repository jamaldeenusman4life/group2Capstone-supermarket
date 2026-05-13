import mongoose from "mongoose";
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Describe the category"],
      maxlength: 50,
    },
  },
  { timestamps: true },
);
const Category = mongoose.model("Category", categorySchema);
export default Category;
