export const verifyEntityExists = (model, fieldName) => {
  return async (req, res, next) => {
    try {
      console.log("verifying id passed in");
      const id = req.body[fieldName];
      const exists = await model.findById(id);
      if (!exists) {
        return res.status(404).json({
          success: false,
          message: "Invalid id passed in",
        });
      }
      console.log("Id passed in is valid");
      next();
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        success: false,
        message: "database id verification failed",
      });
    }
  };
};
