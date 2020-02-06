import { NextFunction, Response, Request } from "express";
import { ErrorWithStatusCode } from "./type";

// Handle Express Request Errors
export const requestErrorHandler = (
  err: ErrorWithStatusCode,
  _: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err.name === "RequestError" && err.statusCode !== 500) {
    res.status(err.statusCode).json({
      error: { message: err.message || "Unhandled mongoose error" }
    });
  } else next(err);
};

// Handle Unandled Errors
export const errorHandler = (
  err: ErrorWithStatusCode,
  _: Request,
  res: Response
): void => {
  console.error(err);
  if (err.statusCode !== 500) {
    res.status(err.statusCode).json({
      error: { message: err.message }
    });
  } else {
    res.status(500).json({
      error: { name: err.name, message: err.message, stack: err.stack }
    });
  }
};
