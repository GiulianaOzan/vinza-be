import './db';

import config from '@/config';
import { setupDocs } from '@/docs';
import { handleErrors } from '@/error/handler';
import cors from 'cors';
import express, { Router } from 'express';
import helmet from 'helmet';
import { injectLogger, logRequests } from './logger';
import { reqTracer } from './tracer';
import rolesRouter from './rbac/router';
import { sequelize } from './db';
import userRouter from './users/router';
import authRouter from './auth/router';

function initializeRouter() {
  const router = Router();

  // Append routes created at /<module>/router.ts
  router.use('/users', userRouter);
  router.use('/auth', authRouter);
  router.use('/rbac', rolesRouter);
  return router;
}

export default async function () {
  await sequelize.sync({ alter: true, logging: false });
  const app = express();
  app.use(helmet());
  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Don't touch the order of these middlewares
  app.use(reqTracer);
  app.use(injectLogger);
  app.use(logRequests);

  app.use(`/api/${config.API_VERSION}`, initializeRouter());

  setupDocs(app);

  // Global error handler (should be after routes)
  handleErrors(app);

  return app;
}
