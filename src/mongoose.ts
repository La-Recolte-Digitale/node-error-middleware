import { NextFunction, Response, Request } from "express";
import { ErrorWithStatusCode, ErrorsValidation } from "./type";

// Handle other errors from mongoose
export const mongooseErrorHandler = (
  err: ErrorWithStatusCode,
  _: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err.name === "CastError" || err.name === "ValidationError") {
    res.status(400).json({
      error: { message: err.message || "Mongoose error" }
    });
  } else next(err);
};

// Handle validation errors from mongoose
export const unprocessableEntityHandler = (
  err: ErrorWithStatusCode,
  _: Request,
  res: Response,
  next: NextFunction
): void => {
  if (
    err.name === "UnprocessableEntityError" ||
    err.name === "UnprocessableEntity"
  ) {
    res.status(err.statusCode).json({
      error: { message: err.message }
    });
  } else next(err);
};

// Handle validation errors from mongoose
export const entityNotFoundHandler = (
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err.name === "NotFound") {
    res.status(404).json({
      error: { message: err.message }
    });
  } else next(err);
};

// Handle validation errors from mongoose
export const validationErrorHandler = (
  err: ErrorsValidation,
  _: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err.name === "ValidationError") {
    console.error(err.errors, Object.entries(err.errors));
    const message = Object.values(err.errors)
      .map(error =>
        error.kind === "required"
          ? `${error.path} is required`
          : `${error.path} is invalid`
      )
      .join("\n");
    res.status(400).json({
      error: { message: message }
    });
  } else next(err);
};

// Handle validation errors from mongoose
export const duplicateKeyErrorHandler = (
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err.name === "DuplicatedKeyError") {
    res.status(400).json({
      error: { message: err.message }
    });
  } else next(err);
};
