import { expect, test } from "vitest";
import { testApi } from "./setup";

test("root handler", async () => {
  const response = await testApi.get("/");
  expect(response.body.isSuccess).toBe(true);
});
