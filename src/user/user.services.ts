import userRepository from "./user.repository";
import { AppError } from "../err";
import { StatusCodes } from "http-status-codes";
import otpServices from "../OTP/otp.services";
import {
  generateToken,
  hashPassword,
  comparePassword,
  generateRefreshToken,
} from "./user.helper";
import { User } from "@prisma/client";

async function createUser(username: string, password: string, email: string) {
  const hashedPassword = hashPassword(password);
  const user = await userRepository.insertUser(username, hashedPassword, email);
  otpServices.sendUserOTP(email);
  return { id: user.id, username: user.username };
}

async function getUsers(page: number = 1) {
  return userRepository.getUsers(page);
}

async function updateUser(uid: string, userFields: Partial<User>) {
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
  const refreshToken = generateRefreshToken(user.id);
  return { id: user.id, username: user.username, token, refreshToken };
}

export default { createUser, getUsers, Login, updateUser };
