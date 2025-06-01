import { Request, Response } from 'express';
import { AuditService } from './service';

export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  async findAll(req: Request, res: Response) {
    this.auditService
      .findAll()
      .then((r) => res.json(r))
      .catch((err) => res.json(err));
  }
}
