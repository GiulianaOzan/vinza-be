import { Audit } from './model';
import { CreateAuditDto } from './types';

export class AuditService {
  public async create(audit: CreateAuditDto) {
    return Audit.create(audit);
  }

  public async findAll() {
    return Audit.findAll();
  }

  public async findOne(id: number) {
    return Audit.findByPk(id);
  }
}

export const auditService = new AuditService();
