export default class HttpError extends Error {
  private readonly status

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }

  get statusCode() {
    return this.status
  }
}

