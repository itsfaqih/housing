import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import envServer from "../../env";
import * as schema from "@/schemas/index";

export const pgPool = new Pool({
  host: envServer.DB_HOST,
  port: envServer.DB_PORT,
  user: envServer.DB_USERNAME,
  password: envServer.DB_PASSWORD,
  database: envServer.DB_DATABASE,
});

pgPool.connect();

export const db = drizzle(pgPool, { schema });
