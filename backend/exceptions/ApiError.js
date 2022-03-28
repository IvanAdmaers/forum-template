class ApiError {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }

  static badRequest(msg = 'Some error') {
    return new ApiError(400, msg);
  }

  static unauthorized(msg = 'User unauthorized') {
    return new ApiError(401, msg);
  }

  static forbidden(msg = 'Action forbidden') {
    return new ApiError(403, msg);
  }

  static notFound(msg = 'Not found') {
    return new ApiError(404, msg);
  }

  static unprocessableEntity(msg = 'Some params are incorrect') {
    return new ApiError(422, msg);
  }

  static internal(msg = 'Something went wrong') {
    return new ApiError(500, msg);
  }
}

module.exports = ApiError;
