import { expect, it, describe, beforeEach, jest } from "@jest/globals";
import mapPerson from "../src/person";

describe("Person suite", () => {
  describe("Happy path", () => {
    it("should map a person string to a person object", () => {
      const personStr = '{"name": "John", "age": 30}';

      const person = mapPerson(personStr);

      expect(person).toEqual({
        name: "John",
        age: 30,
        createdAt: expect.any(Date),
      });
    });
  });

  describe("what coverage does not tell you", () => {
    it("should not map a person given invalid JSON string", () => {
      const personStr = '{"name": "John", "age: 30}';

      expect(() => mapPerson(personStr)).toThrow(
        "Unexpected end of JSON input"
      );
    });

    it("should not map person given invalid JSON object", () => {
      const personStr = '{"name": "John"}';
      const person = mapPerson(personStr);

      expect(person).toEqual({
        name: "John",
        age: undefined,
        createdAt: expect.any(Date),
      });
    });
  });
});
