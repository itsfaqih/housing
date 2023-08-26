import type { Config } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

export default {
  schema: "./src/schemas/*",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    host: process.env.DB_HOST ?? "localhost",
    port: parseInt(process.env.DB_PORT ?? "5432"),
    database: process.env.DB_DATABASE ?? "",
    user: process.env.DB_USERNAME ?? "",
    password: process.env.DB_PASSWORD ?? "",
  },
} satisfies Config;
