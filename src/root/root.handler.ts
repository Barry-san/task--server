import { Handler } from "express";

export const rootHandler: Handler = (req, res) => {
  return res.json({ isSuccess: true, message: "this is the root route" });
};
