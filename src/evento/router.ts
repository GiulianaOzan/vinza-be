import { Router } from 'express';
import { EventoController } from './controller';
import { eventoService } from './service';
import logger from '@/logger';

const controller = new EventoController(eventoService);
const router = Router();

/**
 * @openapi
 * /eventos:
 *   get:
 *     summary: Get all eventos
 *     tags:
 *       - Eventos
 *     responses:
 *       200:
 *         description: Success
 */
router.get('', controller.getAll);

/**
 * @openapi
 * /eventos/{id}:
 *   get:
 *     summary: Get an evento by id
 *     tags:
 *       - Eventos
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The id of the evento
 *     responses:
 *       200:
 *         description: Evento found successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get('/:id', controller.getOne);

/**
 * @openapi
 * /eventos:
 *   post:
 *     summary: Create an evento
 *     tags:
 *       - Eventos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del evento
 *                 required: true
 *                 example: "Charla de tecnología"
 *               descripcion:
 *                 type: string
 *                 description: Descripción del evento
 *                 required: true
 *                 example: "Evento sobre nuevas tecnologías."
 *               cupo:
 *                 type: string
 *                 description: Cupo del evento
 *                 required: true
 *                 example: "50"
 *               sucursalId:
 *                 type: number
 *                 description: ID de la sucursal a la que pertenece
 *                 required: true
 *                 example: 1
 *     responses:
 *       201:
 *         description: Evento created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('', controller.create);

/**
 * @openapi
 * /eventos/{id}:
 *   put:
 *     summary: Update an evento
 *     tags:
 *       - Eventos
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The id of the evento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del evento
 *                 example: "Charla de tecnología"
 *               descripcion:
 *                 type: string
 *                 description: Descripción del evento
 *                 example: "Evento sobre nuevas tecnologías."
 *               cupo:
 *                 type: string
 *                 description: Cupo del evento
 *                 example: "50"
 *               sucursalId:
 *                 type: number
 *                 description: ID de la sucursal a la que pertenece
 *                 example: 1
 *     responses:
 *       200:
 *         description: Evento updated successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.put('/:id', controller.update);

/**
 * @openapi
 * /eventos/{id}:
 *   delete:
 *     summary: Delete an evento
 *     tags:
 *       - Eventos
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The id of the evento
 *     responses:
 *       200:
 *         description: Evento deleted successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', controller.delete);

logger.debug('Evento router initialized');

export default router;
