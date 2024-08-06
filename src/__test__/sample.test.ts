import { test, expect } from "vitest";

function microphone() {
  return "testing";
}

test("testing microphone", () => {
  expect(microphone()).toBe("testing");
});
