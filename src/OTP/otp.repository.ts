import prisma from "../db";

async function getUserOTP(email: string) {
  const userOTPs = await prisma.oTP.findFirst({
    where: { email },
    orderBy: {
      expiresAt: "desc",
    },
  });
  return userOTPs;
}
async function addOTP(otp: number, email: string, expiresAt: number) {
  return await prisma.oTP.create({
    data: {
      expiresAt,
      email,
      otp,
    },
  });
}
async function deletUserOTPs(email: string) {
  return await prisma.oTP.deleteMany({ where: { email } });
}

export default { getUserOTP, deletUserOTPs, addOTP };
