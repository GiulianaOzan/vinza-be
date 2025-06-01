// audit/auditEmitter.ts
import { getContext } from '@/context';
import logger from '@/logger';
import { EventEmitter } from 'events';
import { auditService } from './service';
import { AuditEventEntry } from './types';

class AuditEvent extends EventEmitter {
  constructor() {
    super();
    super.on('entry', async (data: AuditEventEntry) => {
      const user = getContext('user');
      try {
        await auditService.create({
          ...data,
          userId: user,
        });
      } catch (err) {
        logger.info(
          `Audit logging failed to persist - user: ${user} - error: ${err}`,
        );
      }
    });
  }

  public emitEntry(data: AuditEventEntry) {
    this.emit('entry', data);
  }
}

export const auditEmitter = new AuditEvent();
