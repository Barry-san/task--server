import express from "express";
import userRepository from "./user.repository";
import userServices from "./user.services";
import { validator } from "../middlewares/validator";
import { requireAuth } from "../middlewares/requireAuth";
import { StatusCodes } from "http-status-codes";
import { emailSchema, loginSchema, signupSchema } from "../schema";
import { z, ZodError } from "zod";
import otpServices from "../OTP/otp.services";
import { env_vars } from "../ENV";

export const userRouter = express.Router();
const cookieSettings = {
  maxAge: 24 * 60 * 60 * 1000,
};

userRouter.get("/", async (req, res, next) => {
  try {
    const page = req.query.page
      ? z.coerce
          .number({ message: "page must be a number" })
          .int("page number must be an integer")
          .parse(req.query.page)
      : 1;
    const users = await userServices.getUsers(page);
    res.json({ isSuccess: true, page, length: users.length, data: users });
  } catch (error) {
    if (error instanceof ZodError)
      return res.json({
        isSuccess: false,
        errors: error.errors.map((err) => ({
          code: err.code,
          messsage: err.message,
        })),
      });
    next(error);
  }
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

    res.cookie("refreshToken", refreshToken, {
      secure: env_vars.NODE_ENV === "production" ? true : false,
      path: "/",
      maxAge: 10 * 24 * 60 * 60 * 1000,
    });
    res.cookie("accessToken", token, {
      secure: env_vars.NODE_ENV === "production" ? true : false,
      path: "/",
      maxAge: 10 * 24 * 60 * 60 * 1000,
    });
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
