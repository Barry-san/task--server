import express from "express";
import userRepository from "./user.repository";
import userServices from "./user.services";
import { validator } from "../middlewares/validator";
import { requireAuth } from "../middlewares/requireAuth";
import { StatusCodes } from "http-status-codes";
import { loginSchema, signupSchema } from "../schema";

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
    const user = await userServices.Login(email, password);
    res.json({
      status: "success",
      user,
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
