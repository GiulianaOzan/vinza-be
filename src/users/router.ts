import { UsersController } from '@/users/controller';
import { usersService } from '@/users/service';
import { Router } from 'express';

const controller = new UsersController(usersService);
const router = Router();

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', controller.getAll);

export default router;
