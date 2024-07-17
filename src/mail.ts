import { createTransport } from "nodemailer";
import { env_vars } from "./ENV";

export const transporter = createTransport({
  host: env_vars.SMTP_HOST,
  port: env_vars.SMTP_PORT,
  secure: false,
  auth: {
    user: env_vars.SMTP_USER,
    pass: env_vars.SMTP_PASSWORD,
  },
});
