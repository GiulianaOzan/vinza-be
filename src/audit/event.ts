// audit/auditEmitter.ts
import { getContext } from '@/context';
import logger from '@/logger';
import { EventEmitter } from 'events';
import { auditService } from './service';
import { AuditEventEntry } from './types';
import config from '@/config';

class AuditEvent extends EventEmitter {
  constructor() {
    super();
    super.on('entry', async (data: AuditEventEntry) => {
      if (!config.IS_AUDIT_ENABLED) {
        logger.info(`Audit logging disabled - ${data.tipoEvento}`);
        return;
      }

      const user = getContext('user');
      const traceId = getContext('traceId');
      try {
        auditService
          .create({
            ...data,
            userId: user as number,
          })
          .then((audit) => {
            logger.info(
              `Audit logging persisted - user: ${user} - traceId: ${traceId} - audit: ${audit.id}`,
            );
          })
          .catch((err) => {
            logger.error(
              `Audit logging failed to persist - user: ${user} - error: ${err}`,
            );
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
