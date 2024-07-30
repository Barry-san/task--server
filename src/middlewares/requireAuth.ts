import "dotenv/config";
import { Handler } from "express";
import httpstatus, { StatusCodes } from "http-status-codes";
import { verify } from "jsonwebtoken";
import { AppError } from "../err";
import { env_vars } from "../ENV";
import { generateToken, verifyRefreshToken } from "../user/user.helper";

export const requireAuth: Handler = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  const token = req.cookies.accessToken;

  if (!token)
    return res.status(httpstatus.UNAUTHORIZED).json({
      isSuccess: true,
      message: "you need to be authenticated to access this resource",
    });

  const user = decodeUserToken(token);

  verify(token as string, env_vars.ACCESS_TOKEN_KEY, async (err) => {
    if (err?.name === "TokenExpiredError") {
      let isValidRefreshToken = verifyRefreshToken(refreshToken);
      if (!isValidRefreshToken)
        next(
          new AppError(
            "session timed out. please login and try again",
            StatusCodes.UNAUTHORIZED
          )
        );
      else {
        res.cookie(
          "accessToken",
          generateToken(user.id, user.isVerified, user.username)
        );
        res.locals = user;
        next();
      }
    }
  });

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
  return userToken as { id: string; isVerified: boolean; username: string };
}
