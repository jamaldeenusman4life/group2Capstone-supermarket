import mongoose from "mongoose";
export const validateObjectId = (req, res, next) => {
  const { id } = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log(id, "is not a valid id in our database");
    return res.status(400).json({
      success: false,
      message: "Invalid id",
    });
  }
  next();
};
