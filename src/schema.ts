import { z } from "zod";

export const signupSchema = z.object({
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

export const loginSchema = z.object({
  email: z
    .string({ message: "this field is required" })
    .email("email must be in a valid email format e.g example@random.com"),
  password: z
    .string({ message: "password is required" })
    .min(6, "password must contain a minimum of 6 characters"),
});

export const projectSchema = z.object({
  description: z.string().trim().max(300).optional(),
  title: z.string().trim().min(5).max(100),
});

export const taskSchema = z.object({
  title: z
    .string({ message: "this filed is required" })
    .max(150, "task title must be 150 characters or less. "),
  description: z
    .string({ invalid_type_error: "descritpion must be a string" })
    .max(300, { message: "description must be 300 characters or less" })
    .optional(),
  isDone: z.boolean().default(false),
});

export const OTPschema = z.object({
  email: z.string().trim().email({ message: "please provide a valid email" }),
  otp: z.number(),
});

export const emailSchema = z.object({
  email: z
    .string({
      invalid_type_error: "email must be of type string",
      required_error: "this field is required",
    })
    .trim()
    .email({ message: "please provide a valid email" }),
});
