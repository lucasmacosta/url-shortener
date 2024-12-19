import { ErrorRequestHandler } from "express";
import Container from "typedi";
import { UniqueConstraintError, ForeignKeyConstraintError } from "sequelize";

import ApiError, { API_ERRORS } from "../lib/api-error";
import { LOGGER } from "../lib/logger";

const logger = Container.get(LOGGER);

const { internalServerError, conflict } = API_ERRORS;

const errorHandler: ErrorRequestHandler = (error, _, res, __) => {
  if (
    error instanceof UniqueConstraintError ||
    error instanceof ForeignKeyConstraintError
  ) {
    const message =
      error instanceof UniqueConstraintError
        ? "Unique constraint error"
        : "Foreign key constraint error";
    res
      .status(conflict.statusCode)
      .json({ error: conflict.errorName, message });

    return;
  }

  if (error instanceof ApiError) {
    res
      .status(error.statusCode)
      .json({ error: error.errorName, message: error.message });

    return;
  }

  logger.error(error);

  res.status(internalServerError.statusCode).json({
    error: internalServerError.errorName,
    message: "Unexpected error",
  });
};

export default errorHandler;
