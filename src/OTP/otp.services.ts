import { StatusCodes } from "http-status-codes";
import { AppError } from "../err";
import otpRepository from "./otp.repository";
import { generateOTP } from "./otp.helpers";
import { transporter } from "../mail";
import userServices from "../user/user.services";
import userRepository from "../user/user.repository";

async function sendUserOTP(email: string) {
  const OTP = generateOTP();
  const expiresAt = Date.now() + 60000; // set otp to expire in 10 minutes
  await transporter.sendMail({
    to: email,
    from: "hello@taskmanager.com",
    subject: "TASK MANAGER - verify your account",
    text: `
    Your otp : ${OTP}\n Expires in 15 minutes\n Do not share your one time password with anybody else`,
  });
  const response = await otpRepository.addOTP(OTP, email, expiresAt);
  return response;
}

async function confirmOTP(email: string, OTP: number) {
  const user = await userRepository.getUserByEmail(email);
  if (!user) throw new AppError("user not found.", StatusCodes.NOT_FOUND);

  const storedOTP = await otpRepository.getUserOTP(email);

  if (!storedOTP)
    throw new AppError(
      "user has no otp. Please request for an otp",
      StatusCodes.NOT_FOUND
    );

  if (storedOTP.otp !== OTP || storedOTP.expiresAt > Date.now())
    throw new AppError("incorrect or expired OTP", StatusCodes.BAD_REQUEST);

  if (storedOTP.otp === OTP) {
    const response = await userServices.updateUser(user.id, {
      isVerified: true,
    });
    return response;
  }
}
export default { sendUserOTP, confirmOTP };
