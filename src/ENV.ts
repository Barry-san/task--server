import { z } from "zod";
import { config } from "dotenv";

config({
  path: process.env.NODE_ENV === "development" ? ".env.local" : ".env",
});

const env = z.object({
  DATABASE_URL: z.coerce.string(),
  SALT: z.coerce.string(),
  ACCESS_TOKEN_KEY: z.coerce.string(),
  REFRESH_TOKEN_KEY: z.coerce.string(),
  PORT: z.coerce.number().default(3000),
  SMTP_HOST: z.coerce.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_USER: z.coerce.string(),
  SMTP_PASSWORD: z.coerce.string(),
  DOMAIN_URL: z.coerce.string().default("http://localhost:3000"),
  NODE_ENV: z.coerce.string(),
});

export const env_vars = env.parse(process.env);
