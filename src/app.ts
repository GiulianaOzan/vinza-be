import { errors } from '@/error';
import { handleErrors } from '@/error/handler';
import express from 'express';

export default function () {
  const app = express();

  app.use(express.json());

  // Routes
  app.get('/', (req) => {
    console.log('ACA!!', req.query);
    throw errors.app.general.general_error;
  });

  // Global error handler (should be after routes)
  handleErrors(app);

  return app;
}
