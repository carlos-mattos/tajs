import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import { Service } from "../src/service.js";

describe("Service", () => {
  let _service;
  const filename = "./testfile.ndjson";

  describe("create - spies", () => {
    const MOCKED_HASH_PASSWORD = "hashed-password";

    beforeEach(() => {
      jest.spyOn(crypto, "createHash").mockReturnValue({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue(MOCKED_HASH_PASSWORD),
      });

      jest.spyOn(fs, "appendFile").mockResolvedValue();

      _service = new Service({
        filename,
      });
    });

    it("should call appendFile with the correct arguments", async () => {
      const input = {
        username: "user",
        password: "password",
      };

      const expectedCreatedAt = new Date().toISOString();

      jest
        .spyOn(Date.prototype, "toISOString")
        .mockReturnValue(expectedCreatedAt);

      await _service.create(input);

      expect(crypto.createHash).toHaveBeenCalledWith("sha256");

      const hash = crypto.createHash("sha256");

      expect(hash.update).toHaveBeenCalledWith(input.password);
      expect(hash.digest).toHaveBeenCalledWith("hex");

      const expected = JSON.stringify({
        username: input.username,
        password: MOCKED_HASH_PASSWORD,
        createdAt: expectedCreatedAt,
      }).concat("\n");

      expect(fs.appendFile).toHaveBeenCalledWith(filename, expected);
    });
  });
});
