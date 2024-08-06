import { Server } from "http";
import { app } from "./app";
import { env_vars } from "./ENV";

let server: Server;
export const startTestServer = () => {
  return (server = app.listen(0, "localhost", () => {
    console.log("e dey work o");
  }));
};

export const stopTestServer = () => {
  return server.close();
};
