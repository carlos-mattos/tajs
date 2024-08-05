import { it } from "@jest/globals";

function sum(a, b) {
  return a + b ;
}

it("sums two numbers", () => {
  expect(sum(1, 2)).toBe(3);
});
