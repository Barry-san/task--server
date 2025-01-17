import { Handler } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError, ZodSchema } from "zod";

export const validator = (schema: ZodSchema, qureySchema?: ZodSchema) => {
  const handler: Handler = (req, res, next) => {
    try {
      schema.parse(req.body);
      qureySchema?.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          isSuccess: false,
          errors: error.errors,
        });
      }
    }
  };
  return handler;
};
