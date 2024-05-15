class HttpException extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.message = message;
  }

  static fromExpressValidatorErrors(errors) {
    const errorMessages = errors.map((error) => error.msg);
    const errorMessage = errorMessages.join(", ");
    return new HttpException(400, errorMessage);
  }
}

module.exports = HttpException;
