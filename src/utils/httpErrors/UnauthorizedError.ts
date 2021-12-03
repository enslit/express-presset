import HttpError from './HttpError';

export default class UnauthorizedError extends HttpError {
  constructor(message = 'Не авторизован') {
    super(401, message);
  }
}

