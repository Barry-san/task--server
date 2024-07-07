import "dotenv/config";
import { hashSync, compareSync } from "bcryptjs";
import userRepository from "./user.repository";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { AppError } from "../err";
import { StatusCodes } from "http-status-codes";

function hashPassword(password: string) {
  const salt = process.env.SALT;
  const hashedPassword = hashSync(password);
  return hashedPassword;
}
function comparePassword(password: string, hash: string) {
  const result = compareSync(password, hash);
  return result;
}

async function createUser(username: string, password: string, email: string) {
  const hashedPassword = hashPassword(password);

  const user = await userRepository.insertUser(username, hashedPassword, email);
  console.log("got to here");
  const token = generateToken(user.id);
  return { id: user.id, username: user.username, token };
}

async function Login(email: string, password: string) {
  const user = await userRepository.getUserByEmail(email);
  console.log(user);
  if (!user || !comparePassword(password, user.password))
    throw new AppError(
      "invalid username and password combination",
      StatusCodes.BAD_REQUEST
    );
  const token = await generateToken(user.id);
  return { id: user.id, username: user.username, token };
}

async function generateToken(id: string) {
  const token = jwt.sign({ id }, process.env.ACCESS_TOKEN_KEY || "", {
    expiresIn: "10d",
  });
  return token;
}

export default { createUser, Login };
