export const API_ERROR_NAME = "ApiError";

export const API_ERRORS = {
  badRequest: {
    errorName: "Bad Request",
    statusCode: 400,
  },
  unauthorized: {
    errorName: "Unauthorized",
    statusCode: 401,
  },
  forbidden: {
    errorName: "Forbidden",
    statusCode: 403,
  },
  notFound: {
    errorName: "Not Found",
    statusCode: 404,
  },
  conflict: {
    errorName: "Conflict",
    statusCode: 409,
  },
  internalServerError: {
    errorName: "Internal Server Error",
    statusCode: 500,
  },
};

export default class ApiError extends Error {
  name = API_ERROR_NAME;
  public errorName: string;
  public statusCode: number;

  constructor(message: string, code: keyof typeof API_ERRORS) {
    super(message);
    const { errorName, statusCode } = API_ERRORS[code];
    this.errorName = errorName;
    this.statusCode = statusCode;
  }
}
