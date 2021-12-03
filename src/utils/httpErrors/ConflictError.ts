import HttpError from './HttpError';

export default class ConflictError extends HttpError {
  constructor(message: string) {
    super(409, message);
  }
}

