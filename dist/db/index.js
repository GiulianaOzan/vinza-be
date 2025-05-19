"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const node_postgres_1 = require("drizzle-orm/node-postgres");
if (!process.env.DATABASE_URL) {
    throw new Error('No database_url implemented in .env');
}
const db = (0, node_postgres_1.drizzle)(process.env.DATABASE_URL);
