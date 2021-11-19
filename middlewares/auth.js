const jsonwebtoken = require('jsonwebtoken');
const UnauthorizedError = require('../utils/httpErrors/UnauthorizedError');

module.exports = function auth(req, res, next) {
  try {
    const JWT_SECRET_TOKEN =
      process.env.NODE_ENV !== 'production'
        ? 'dev-key'
        : process.env.JWT_SECRET_TOKEN;
    const { jwt } = req.cookies;

    if (!jwt) {
      throw new UnauthorizedError('Не авторизован');
    }

    jsonwebtoken.verify(jwt, JWT_SECRET_TOKEN, (err, decoded) => {
      if (err) {
        throw new UnauthorizedError(err.message);
      }

      req.userId = decoded._id;
    });

    return next();
  } catch (e) {
    return next(e);
  }
};
