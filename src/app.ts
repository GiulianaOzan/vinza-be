import express from 'express';
import { errorHandler } from '@/error/handler';

export default function () {
  const app = express();

  app.use(express.json());

  // Routes
  //   app.use('/api/items', itemRoutes);

  // Global error handler (should be after routes)
  app.use(errorHandler);

  return app;
}
