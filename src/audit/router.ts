import { Router } from 'express';
import { AuditController } from './controller';
import { auditService } from './service';
import { authMiddleware } from '@/auth/middleware';
import { requirePermissions } from '@/rbac/middleware';
import { Permissions } from '@/rbac/permissions';
import logger from '@/logger';

const router = Router();

const auditController = new AuditController(auditService);

/**
 * @swagger
 * /audits:
 *   get:
 *     summary: Get all audits
 *     description: Returns a list of all audits
 *     responses:
 *       '200':
 *         description: A list of audits
 */
router.get(
  '',
  authMiddleware,
  requirePermissions([Permissions.SUDO]),
  auditController.findAll,
);

logger.debug('Audit router initialized');

export default router;
