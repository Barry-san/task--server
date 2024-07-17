import { Router } from "express";
import { validator } from "../middlewares/validator";
import { OTPschema } from "../schema";
import otpServices from "./otp.services";

export const OTPRouter = Router();

OTPRouter.get(
  "/",
  validator(OTPschema.pick({ email: true })),
  async (req, res, next) => {
    const { email } = req.body;
    await otpServices.sendUserOTP(email);
    res.json({ isSuccess: true, message: `user OTP sent to ${email}` });
    try {
    } catch (error) {
      next(error);
    }
  }
);

OTPRouter.post("/verify", validator(OTPschema), async (req, res, next) => {
  const { email, otp } = req.body;
  try {
    const response = await otpServices.confirmOTP(email, otp);
    res.json({ isSuccess: true, user: response });
  } catch (error) {
    next(error);
  }
});
