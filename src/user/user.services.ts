import "dotenv/config";
import { hashSync, compareSync } from "bcryptjs";
import userRepository from "./user.repository";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { AppError } from "../err";
import { StatusCodes } from "http-status-codes";
import otpServices from "../OTP/otp.services";

function hashPassword(password: string) {
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
  otpServices.sendUserOTP(email);
  return { id: user.id, username: user.username };
}

async function updateUser(
  uid: string,
  userFields: Partial<{
    username: string;
    email: string;
    password: string;
    isVerified: boolean;
  }>
) {
  const user = await userRepository.getUser(uid);
  if (!user) throw new AppError("user does not exist", StatusCodes.NOT_FOUND);
  return await userRepository.updateUser(uid, userFields);
}

async function Login(email: string, password: string) {
  const user = await userRepository.getUserByEmail(email);
  if (!user || !comparePassword(password, user.password))
    throw new AppError(
      "invalid username and password combination",
      StatusCodes.BAD_REQUEST
    );

  const token = await generateToken(user.id, user.isVerified, user.username);
  return { id: user.id, username: user.username, token };
}

async function generateToken(
  id: string,
  isVerified: boolean,
  username: string
) {
  const token = jwt.sign(
    { id, isVerified, username },
    process.env.ACCESS_TOKEN_KEY as string,
    {
      expiresIn: "10d",
    }
  );
  return token;
}

export default { createUser, Login, updateUser };
