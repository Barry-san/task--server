import { Handler } from "express";

export const rootHandler: Handler = (req, res) => {
  return res.json({ message: "this is the root route" });
};
