const { isCelebrateError } = require('celebrate');

module.exports = (err, req, res, next) => {
  if (isCelebrateError(err)) {
    const bodyError = err.details.get('body');
    const paramsError = err.details.get('params');

    res.status(400).json({
      ...(bodyError ? { bodyError: bodyError.details } : {}),
      ...(paramsError ? { paramsError: paramsError.details } : {}),
    });
  } else {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
  next(err);
};
