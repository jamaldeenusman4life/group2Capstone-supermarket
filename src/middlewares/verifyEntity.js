import mongoose from "mongoose";
export const verifyEntityExists = (model, fieldName) => {
  return async (req, res, next) => {
    try {
      const id = req.body[fieldName];
      if (!id) {
        return next();
      }
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          status: "error",
          message: `Invalid ${fieldName} provided`,
        });
      }

      const exists = await model.findById(id);
      if (!exists) {
        return res.status(404).json({
          status: "error",
          message: `${fieldName} does not exist`,
        });
      }

      next();
    } catch (error) {
      console.error(error.message);
      res.status(500).json({
        status: "error",
        message: "Database id verification failed",
      });
    }
  };
};
