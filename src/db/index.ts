import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

if (!process.env.DATABASE_URL) {
  throw new Error('No database_url implemented in .env');
}

export const db = drizzle(process.env.DATABASE_URL!);
