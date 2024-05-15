const globalErrorHandler = (error, req, res, _next) => {
  console.error(`Err in ${req.url}`, error);
  return res.status(error.status || 500).json({
    error: {
      success: false,
      message: error.message || "An expected error occurred",
    },
  });
};

module.exports = globalErrorHandler;
