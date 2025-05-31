import type { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

declare module 'express' {
  interface Request {
    /*
    Dont touch!!!

    This will extend the request type definition. 
    This trace_id is used for debuggin purpouses
    */
    trace_id: string;
  }
}

export function reqTracer(req: Request, _res: Response, next: NextFunction) {
  req.trace_id = uuidv4();

  next();
}
