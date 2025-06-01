import { Request, Response } from 'express';
import { AuditService } from './service';

export class AuditController {
  constructor(private readonly auditService: AuditService) {
    this.findAll = this.findAll.bind(this);
  }

  async findAll(req: Request, res: Response) {
    this.auditService
      .findAll()
      .then((r) => res.json(r))
      .catch((err) => res.json(err));
  }
}
