import { Handler } from "express";
import httpstatus from "http-status-codes";

export const requireAuth: Handler = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(httpstatus.UNAUTHORIZED).json({
      isSuccess: true,
      message: "This resource requires an access token",
    });

  next();
};
