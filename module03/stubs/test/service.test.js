import { expect, it, describe, beforeEach, jest } from "@jest/globals";
import { Service } from "../src/service.js";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";

describe("Service", () => {
  let _service;

  beforeEach(() => {
    _service = new Service({
      filename: "./testfile.ndjson",
    });
  });

  describe("read", () => {
    it("should return an empty array", async () => {
      jest.spyOn(fs, "readFile").mockResolvedValue("");

      const result = await _service.read();

      expect(result).toEqual([]);
    });

    it("should return users without passwords", async () => {
      const dbData = [
        {
          username: "user1",
          password: "password1",
          createdAt: new Date().toISOString(),
        },
        {
          username: "user2",
          password: "password2",
          createdAt: new Date().toISOString(),
        },
      ];

      jest
        .spyOn(fs, "readFile")
        .mockResolvedValue(
          dbData.map((data) => JSON.stringify(data).concat("\n")).join("")
        );

      const result = await _service.read();

      expect(result).toEqual(dbData.map(({ password, ...rest }) => rest));
    });
  });
});
