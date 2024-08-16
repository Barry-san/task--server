import express, { ErrorRequestHandler } from "express";
import httpstatus, { StatusCodes } from "http-status-codes";
import { rootHandler } from "./root/root.handler";
import { userRouter } from "./user/user.handler";
import { projectRoute } from "./projects/project.handler";
import { env_vars } from "./ENV";
import { OTPRouter } from "./OTP/otp.handler";
import cookieParser from "cookie-parser";
import cors from "cors";

export const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "*" }));
app.get("/", rootHandler);
app.use("/users", userRouter);
app.use("/projects", projectRoute);
app.use("/otp", OTPRouter);

app.all("/*", (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    isSuccess: false,
    message:
      "requested resource not found, please check that the endpoint you're trying to access exists",
  });
});

const errorHanlder: ErrorRequestHandler = (err, req, res, next) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({ isSuccess: false, message: err.message });
  } else {
    console.log(err);
    res
      .status(httpstatus.INTERNAL_SERVER_ERROR)
      .json({ status: "failure", message: "an error occured on the server" });
  }
};

app.use(errorHanlder);
app.listen(env_vars.PORT);
