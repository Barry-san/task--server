import "dotenv/config";
import { Handler } from "express";
import httpstatus, { StatusCodes } from "http-status-codes";
import { verify } from "jsonwebtoken";
import { AppError } from "../err";

export const requireAuth: Handler = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(httpstatus.UNAUTHORIZED).json({
      isSuccess: true,
      message: "you need to be authenticated to access this resource",
    });

  verify(token, process.env.ACCESS_TOKEN_KEY as string, async (err) => {
    if (err?.name === "TokenExpiredError") {
      return next(
        new AppError("Invalid or expired token", StatusCodes.UNAUTHORIZED)
      );
    }
  });

  const user = decodeUserToken(token);
  if (!user.isVerified)
    next(
      new AppError(
        "user must be verified to use this feature",
        StatusCodes.FORBIDDEN
      )
    );
  res.locals = user;
  next();
};

function decodeUserToken(token: string) {
  const userToken = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );
  return userToken as { id: string; isVerified: boolean };
}
