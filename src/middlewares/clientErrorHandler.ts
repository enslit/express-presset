import { CelebrateError, isCelebrateError } from 'celebrate';
import express from 'express';
import HttpError from '../utils/httpErrors/HttpError';

const clientErrorHandler: express.ErrorRequestHandler = (
  err: HttpError | CelebrateError | Error,
  req,
  res,
  next
) => {
  if (isCelebrateError(err)) {
    const bodyError = err.details.get('body');
    const paramsError = err.details.get('params');

    res.status(400).json({
      ...(bodyError ? { bodyError: bodyError.details } : {}),
      ...(paramsError ? { paramsError: paramsError.details } : {}),
    });
  } else {
    res.status(
      err instanceof HttpError ? err.statusCode : 500
    ).json({ message: err.message });
  }
  next(err);
}

export default clientErrorHandler