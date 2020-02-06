import { NextFunction } from "express";

export interface ErrorWithStatusCode extends Error {
  statusCode: number;
}

export interface ErrorsValidation extends Error {
  errors: ErrorValidation[];
}

export interface ErrorValidation {
  kind: string;
  path: string;
}

export type ErrorRequestHandler = (
  err: ErrorWithStatusCode,
  req: Request,
  res: Response,
  next: NextFunction
) => void;
