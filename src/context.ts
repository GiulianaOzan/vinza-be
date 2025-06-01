import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// context/request-context.ts
import { createNamespace, getNamespace } from 'cls-hooked';
import config from './config';
import { errors } from './error';
import { JwtAuthPayload } from './auth/types';

const NAMESPACE_NAME = 'app.context';

type ctx = {
  user: number;
  traceId: string;
};

export const context =
  getNamespace<ctx>(NAMESPACE_NAME) || createNamespace<ctx>(NAMESPACE_NAME);

export function setContext(key: keyof ctx, value: ctx[keyof ctx]) {
  context.set(key, value);
}

export function getContext(key: keyof ctx) {
  return context.get(key);
}

export function contextMiddleware(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  // Why not use the authMiddleware? Because the audit does not require the user
  // to be authenticated to log some data.
  context.run(() => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(
        token,
        config.JWT_SECRET,
      ) as unknown as JwtAuthPayload;
      if (!decoded) {
        throw errors.app.auth.unauthorized;
      }

      setContext('user', decoded.user);
    }

    if (req.trace_id) {
      setContext('traceId', req.trace_id);
    }

    next();
  });
}
