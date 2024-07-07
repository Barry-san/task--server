import { Handler } from "express";
import { StatusCodes } from "http-status-codes";
import { z, ZodError } from "zod";

const signupSchema = z.object({
  username: z
    .string({ message: "this field is required" })
    .trim()
    .min(3, "username must contain at least 3 characters")
    .max(30, "username may only contain 30 characters or less"),

  email: z
    .string({ message: "this field is required" })
    .email("email must be in a valid email format e.g example@random.com"),
  password: z
    .string({ message: "password is required" })
    .min(6, "password must contain a minimum of 6 characters"),
});

const loginSchema = z.object({
  email: z
    .string({ message: "this field is required" })
    .email("email must be in a valid email format e.g example@random.com"),
  password: z
    .string({ message: "password is required" })
    .min(6, "password must contain a minimum of 6 characters"),
});

export const loginValidator: Handler = (req, res, next) => {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ isSuccess: false, errors: err.errors });
    }
  }
};

export const signupValidator: Handler = (req, res, next) => {
  try {
    signupSchema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ isSuccess: false, errors: err.errors });
    }
  }
};
