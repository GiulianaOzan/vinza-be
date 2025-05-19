import config from '@/config';
import { setupDocs } from '@/docs';
import { handleErrors } from '@/error/handler';
import userRouter from '@/users/router';
import express, { Router } from 'express';

function initializeRouter() {
  const router = Router();

  // Append routes created at /<module>/router.ts
  router.use('/users', userRouter);
  return router;
}

export default function () {
  const app = express();

  app.use(express.json());

  app.use(`/api/${config.API_VERSION}`, initializeRouter());

  setupDocs(app);

  // Global error handler (should be after routes)
  handleErrors(app);

  return app;
}
