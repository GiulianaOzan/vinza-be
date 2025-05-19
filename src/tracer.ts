import { v4 as uuidv4 } from 'uuid';
import type { Request, Response, NextFunction } from 'express';
import logger from '@/logger';

declare global {
  // eslint-disable-next-line  @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      /*
      Dont touch!!!


      This will extend the request type definition. 
      This trace_id is used for debuggin purpouses
    
      */
      trace_id: string;
    }
  }
}

export function reqTracer(req: Request, _res: Response, next: NextFunction) {
  req.trace_id = uuidv4();
  logger.info(`[trace_id=${req.trace_id}] [${req.method} ${req.originalUrl}]`);

  next();
}
