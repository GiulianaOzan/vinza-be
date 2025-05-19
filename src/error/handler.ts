import { errors } from '@/error';
import { IError } from '@/error/types';
import { NextFunction, Response, Request, Express } from 'express';

export interface AppError extends Error {
  status?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createGeneralError(err: any): IError {
  const baseError = errors.app.general.general_error;

  return {
    status: err?.status ?? baseError.status,
    key: err?.key ?? baseError.key,
    message: err?.message ?? baseError.message,
    message_eng: err?.message_eng ?? baseError.message_eng,
  };
}

function handleUnhandledError(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!err) next();

  if (err.error && err.status) {
    res.status(err.status).json(err);
    return;
  }

  const generalError = createGeneralError(err);
  res.status(generalError.status).json(generalError);
}

function handleNotFoundError(
  _req: Request,
  _res: Response,
  next: NextFunction,
) {
  next(errors.app.general.not_found);
}

export function handleErrors(app: Express) {
  // Dont even dare to change this order
  app.use(handleNotFoundError);
  app.use(handleUnhandledError);
}
