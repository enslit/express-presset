import express from 'express';
import jsonwebtoken from 'jsonwebtoken';
import UnauthorizedError from '../utils/httpErrors/UnauthorizedError';

const auth: express.RequestHandler = (req, res, next) => {
  try {
    const JWT_SECRET_TOKEN =
      process.env.NODE_ENV !== 'production'
        ? 'dev-key'
        : process.env.JWT_SECRET_TOKEN;

    if (!JWT_SECRET_TOKEN) {

    }

    const { jwt } = req.cookies;

    if (!jwt) {
      throw new UnauthorizedError('Не авторизован');
    }

    const verify: jsonwebtoken.VerifyCallback<jsonwebtoken.JwtPayload> = (err, decoded) => {
      if (err || !decoded) {
        throw new UnauthorizedError(err!.message);
      }

      req.userId = decoded._id;
    }

    jsonwebtoken.verify(jwt, JWT_SECRET_TOKEN!, verify);

    return next();
  } catch (e) {
    return next(e);
  }
};

export default auth