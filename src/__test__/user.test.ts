import { afterAll, beforeAll, expect, test } from "vitest";
import { testApi } from "./setup";
import { faker } from "@faker-js/faker";

let testUser: Object;
beforeAll(() => {
  testUser = {
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
  };
});

test("user sign up", async () => {
  const response = await testApi.post("/users/signup").send(testUser);
  expect(response.body.isSuccess).toBe(true);
});

test("user login", async () => {
  const response = await testApi.post("/users/login").send(testUser);
  console.log(response.body);
  expect(response.body.isSuccess).toBe(true);
});

afterAll(() => {
  testApi.get("/users");
  testApi.delete("/users");
});
