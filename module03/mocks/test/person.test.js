import { describe, it, expect, jest } from "@jest/globals";
import { Person } from "../src/person.js";

describe("Person", () => {
  describe("validate", () => {
    it("should throw an error if name is not provided", () => {
      const mockInvalidPerson = { cpf: "123.456.789-01" };

      expect(() => Person.validate(mockInvalidPerson)).toThrow(
        "Name is required"
      );
    });

    it("should throw an error if CPF is not provided", () => {
      const mockInvalidPerson = { name: "John Doe" };

      expect(() => Person.validate(mockInvalidPerson)).toThrow(
        "CPF is required"
      );
    });

    it("should pass if name and CPF are provided", () => {
      const mockValidPerson = { name: "John Doe", cpf: "123.456.789-01" };

      expect(() => Person.validate(mockValidPerson)).not.toThrow();
    });
  });

  describe("format", () => {
    it("should format the person name and CPF", () => {
      const mockPerson = { name: "John Doe", cpf: "123.456.789-01" };

      const formattedPerson = Person.format(mockPerson);

      expect(formattedPerson).toEqual({
        cpf: "12345678901",
        firstName: "John",
        lastName: "Doe",
      });
    });
  });

  describe("process", () => {
    it("should process a valid person", () => {
      const mockPerson = { name: "John Doe", cpf: "123.456.789-01" };

      jest.spyOn(Person, "validate").mockReturnValue();
      jest.spyOn(Person, "format").mockReturnValue({
        cpf: "12345678901",
        firstName: "John",
        lastName: "Doe",
      });

      const result = Person.process(mockPerson);

      expect(result).toBe("ok");
    });
  });
});
