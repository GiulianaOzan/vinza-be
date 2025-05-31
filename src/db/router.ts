import { reset } from 'drizzle-seed';
import { Router } from 'express';
import { db } from '.';
import * as schema from './schema';
import { seedDatabase } from './seed';

const router = Router();

/**
 * @openapi
 * /db/seed:
 *   post:
 *     summary: Seed the database
 *     tags:
 *       - DB
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal server error
 */
router.post('/seed', (req, res) => {
  reset(db, schema).then(() =>
    seedDatabase().then(() => {
      res.json({ message: 'Seed successful' });
    }),
  );
});

export default router;
