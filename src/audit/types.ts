import { AuditCreationAttributes } from './model';

export type CreateAuditDto = AuditCreationAttributes;
export type AuditEventEntry = Omit<CreateAuditDto, 'userId'> & {
  userId?: number;
};
