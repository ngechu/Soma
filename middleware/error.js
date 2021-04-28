const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (error, req, res, next) => {
  const errorMsg = { ...error };
  errorMsg.message = error.message;

  //Mongoose bad object id
  if (error.name === "CastError") {
    const message = ` Bootcamp not found with id of ${error.value}`;
    error = new ErrorResponse(message, 404);
  }
  //Mongoose duplicate object error
  if (error.code === 11000) {
    console.log(error);
    const message = ` Bootcamp with email ${error.keyValue.email} already exists`;
    error = new ErrorResponse(message, 400);
  }
  //Mongoose validation errorHandler
  if (error.name === "ValidationError") {
    const message = Object.values(error.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || "Server error" });
};

module.exports = errorHandler;
