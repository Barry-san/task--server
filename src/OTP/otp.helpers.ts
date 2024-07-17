export function generateOTP() {
  return Math.round(Math.random() * 900000 + 10000);
}
