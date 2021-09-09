function handleError(err, req, res, next) {
  res.status(err.status || 500);

  res.json({
    code: err.status,
    message: err.message ? err.message : "Internal server error",
  });
}

module.exports = handleError;
