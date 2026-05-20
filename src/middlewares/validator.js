import mongoose from "mongoose";

const formatJoiErrors = (error) => {
  return error.details.map((detail) => detail.message);
};

export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
    });

    if (error) {
      const errors = formatJoiErrors(error);
      return res.status(400).json({
        status: "error",
        errors,
      });
    }

    req.body = value;
    next();
  };
};

export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      allowUnknown: false,
    });

    if (error) {
      const errors = formatJoiErrors(error);
      return res.status(400).json({
        status: "error",
        errors,
      });
    }

    req.params = value;
    next();
  };
};

export const validateObjectId = (paramName = "id") => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid ID",
      });
    }
    next();
  };
};

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
