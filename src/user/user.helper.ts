import jwt from "jsonwebtoken";

import { env_vars } from "../ENV";
import { compareSync, hashSync } from "bcryptjs";
export function generateToken(
  id: string,
  isVerified: boolean,
  username: string
) {
  const token = jwt.sign(
    { id, isVerified, username },
    env_vars.ACCESS_TOKEN_KEY,
    {
      expiresIn: "10d",
    }
  );
  return token;
}

export function hashPassword(password: string) {
  const hashedPassword = hashSync(password);
  return hashedPassword;
}
export function comparePassword(password: string, hash: string) {
  const result = compareSync(password, hash);
  return result;
}

export function generateRefreshToken(id: string) {
  return jwt.sign({ id }, env_vars.REFRESH_TOKEN_KEY, { expiresIn: "100d" });
}

export function verifyRefreshToken(refreshToken: string) {
  let isValid = true;
  jwt.verify(refreshToken, env_vars.REFRESH_TOKEN_KEY, (err, payload) => {
    if (err) {
      isValid = false;
    }
  });
  return isValid;
}
