import { z } from "zod";
import { config } from "dotenv";

config({
  path: process.env.NODE_ENV === "development" ? ".env.local" : ".env",
});

const env = z.object({
  DATABASE_URL: z.coerce.string(),
  SALT: z.coerce.string(),
  ACCESS_TOKEN_KEY: z.coerce.string().default(""),
  PORT: z.coerce.number().default(3000),
});

export const env_vars = env.parse(process.env);
