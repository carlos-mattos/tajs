import { describe, it, expect, jest, beforeAll, afterAll } from "@jest/globals";

function waitForServerToStart(server) {
  return new Promise((resolve, reject) => {
    server.once("listening", () => resolve(server));
    server.once("error", (error) => reject(error));
  });
}

describe("E2E test suite", () => {
  describe("E2E Tests for Server in a non-test environment", () => {
    it("should start the server with port 4000", async () => {
      process.env.NODE_ENV = "development";
      process.env.PORT = 4000;

      jest.spyOn(console, "log");

      const { default: server } = await import("../src/index.js");
      await waitForServerToStart(server);

      const serverInfo = server.address();

      expect(console.log).toHaveBeenCalledWith(
        `Server is running ${serverInfo.address}:${serverInfo.port}`
      );

      server.close();
    });
  });

  describe("E2E Tests for Server", () => {
    let _testServer;
    let _testServerAddress;

    beforeAll(async () => {
      process.env.NODE_ENV = "test";
      const { default: server } = await import("../src/index.js");
      _testServer = server.listen();

      await waitForServerToStart(_testServer);

      const serverInfo = _testServer.address();
      _testServerAddress = `http://localhost:${serverInfo.port}`;
    });

    afterAll((done) => _testServer.close(done));

    it("should return 404 for unsupported routes", async () => {
      const response = await fetch(`${_testServerAddress}/unsupported`);
      expect(response.status).toBe(404);
    });

    it("should return 400 for invalid data", async () => {
      const response = await fetch(`${_testServerAddress}/persons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "John" }),
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.validationError).toBe("CPF is required");
    });
  });
});
