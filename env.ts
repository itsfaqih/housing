import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export default createEnv({
  /*
   * Specify what prefix the client-side variables must have.
   * This is enforced both on type-level and at runtime.
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  server: {
    APP_SECRET_KEY: z.string().nonempty(),
    DB_HOST: z.string().nonempty(),
    DB_PORT: z.coerce.number(),
    DB_DATABASE: z.string().nonempty(),
    DB_USERNAME: z.string().nonempty(),
    DB_PASSWORD: z.string().nonempty(),
  },
  /**
   * What object holds the environment variables at runtime.
   * Often `process.env` or `import.meta.env`
   */
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    APP_SECRET_KEY: process.env.APP_SECRET_KEY,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
  },
});
