import 'dotenv/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('No database_url implemented in .env');
}

export const db = drizzle(process.env.DATABASE_URL!, { schema });

export type DrizzleDatabase = NodePgDatabase<typeof schema>;
