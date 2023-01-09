const errorHandler = (errors) => {
  const error = new Error();
  error.statusCode = 402;
  error.data = errors.array() || [];
  return error;
};

module.exports = errorHandler;
