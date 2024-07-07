import express, { ErrorRequestHandler } from "express";
import httpstatus from "http-status-codes";
import { rootHandler } from "./root/root.handler";
import { userRouter } from "./user/user.handler";

export const app = express();
app.use(express.json());
app.get("/", rootHandler);
app.use("/users", userRouter);
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

app.listen(3000);
