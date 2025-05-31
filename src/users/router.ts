import { authMiddleware } from '@/auth/middleware';
import { requirePermissions } from '@/rbac/middleware';
import { Permissions } from '@/rbac/permissions';
import { UsersController } from '@/users/controller';
import { usersService } from '@/users/service';
import { Router } from 'express';

const controller = new UsersController(usersService);
const router = Router();

/**
 * @openapi
 * /users:
 *   security:
 *     - bearerAuth: []
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Success
 */
router.get(
  '',
  authMiddleware,
  requirePermissions([Permissions.USERS_READ]),
  controller.getAll,
);

/**
 * @openapi
 * /users/{id}:
 *   security:
 *     - bearerAuth: []
 *   get:
 *     summary: Get a user by id
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The id of the user
 */
router.get('/:id', authMiddleware, controller.getOne);

/**
 * @openapi
 * /users/me:
 *   security:
 *     - bearerAuth: []
 *   get:
 *     summary: Get the current user
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/me', authMiddleware, controller.getMe);

/**
 * @openapi
 * /users:
 *   security:
 *     - bearerAuth: []
 *   post:
 *     summary: Create a user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user
 *                 required: true
 *                 example: "John Doe"
 *               age:
 *                 type: number
 *                 description: The age of the user
 *                 required: true
 *                 example: 25
 *               email:
 *                 type: string
 *                 description: The email of the user
 *                 required: true
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 required: true
 *                 example: "password"
 *               roleId:
 *                 type: number
 *                 description: The role id of the user
 *                 required: true
 *                 example: 1
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('', authMiddleware, controller.create);

/**
 * @openapi
 * /users/{id}:
 *   security:
 *     - bearerAuth: []
 *   put:
 *     summary: Update a user
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The id of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user
 *                 example: "John Doe"
 *               age:
 *                 type: number
 *                 description: The age of the user
 *                 example: 25
 *               email:
 *                 type: string
 *                 description: The email of the user
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 example: "password"
 *               roleId:
 *                 type: number
 *                 description: The role id of the user
 *                 example: 1
 */
router.delete('/:id', authMiddleware, controller.delete);

export default router;
