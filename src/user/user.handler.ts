import express from "express";
import userRepository from "./user.repository";
import userServices from "./user.services";
import { validator } from "../middlewares/validator";
import { requireAuth } from "../middlewares/requireAuth";
import { StatusCodes } from "http-status-codes";
import { emailSchema, loginSchema, signupSchema } from "../schema";
import otpServices from "../OTP/otp.services";

export const userRouter = express.Router();

userRouter.get("/", async (_, res) => {
  const users = await userRepository.getUsers();
  res.json({ length: users.length, data: users });
});

userRouter.post("/signup", validator(signupSchema), async (req, res, next) => {
  try {
    const { email, password, username } = req.body;
    const user = await userServices.createUser(username, password, email);
    return res.status(StatusCodes.CREATED).json({
      isSuccess: true,
      user,
    });
  } catch (error) {
    next(error);
  }
});

userRouter.post("/login", validator(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { id, token, refreshToken, username } = await userServices.Login(
      email,
      password
    );

    res.cookie("refreshToken", refreshToken, { httpOnly: true });
    res.cookie("accessToken", token);
    res.json({
      isSuccess: true,
      user: {
        username,
        id,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
});

userRouter.get("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const user = await userRepository.getUser(id);
  res.json({ user });
});

userRouter.delete("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const user = await userRepository.getUser(id);
  if (user) {
    userRepository.deleteUser(id);
    res
      .status(StatusCodes.OK)
      .json({ status: "success", message: "deleted user with id " + id });
  }
});

userRouter.post("/reset", validator(emailSchema), async (req, res, next) => {
  const { email } = req.body;
  try {
    otpServices.sendUserOTP(email);
    res.json({
      isSuccess: true,
      message: "password reset OTP sent successfully",
    });
  } catch (error) {
    next(error);
  }
});
