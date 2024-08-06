import { afterAll, beforeAll } from "vitest";
import { startTestServer, stopTestServer } from "../setup-test";
import request from "supertest";
import { app } from "../app";

beforeAll(() => {
  startTestServer();
});

afterAll(() => {
  stopTestServer();
});

export const testApi = request(app);
