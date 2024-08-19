import { describe, it, expect, jest, beforeAll, afterAll } from "@jest/globals";
import server from "../src/api.js";

function waitForServerToStart(server) {
  return new Promise((resolve, reject) => {
    server.once("listening", () => resolve(server));
    server.once("error", (error) => reject(error));
  });
}

describe("API Users E2E ", () => {
  let _testServer;
  let _testServerAddress;

  function createUserRequest(user) {
    return fetch(`${_testServerAddress}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
  }

  async function findUserByIdRequest(id) {
    const user = await fetch(`${_testServerAddress}/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return user.json();
  }

  beforeAll(async () => {
    _testServer = server.listen();
    await waitForServerToStart(_testServer);
    const serverInfo = _testServer.address();
    _testServerAddress = `http://localhost:${serverInfo.port}`;
  });

  afterAll((done) => {
    server.closeAllConnections();
    _testServer.close(done);
  });

  it("should register a new user with age 25 and return Young Adult category", async () => {
    jest.useFakeTimers({
      now: new Date("2025-01-01"),
    });

    const expectedCategory = "Young Adult";
    const response = await createUserRequest({
      name: "John Doe",
      birthdate: "2000-01-01",
    });
    expect(response.status).toBe(201);
    const result = await response.json();
    expect(result).toHaveProperty("id");

    const user = await findUserByIdRequest(result.id);
    expect(user.category).toBe(expectedCategory);

    jest.useRealTimers();
  });

  it("should register a new user with age 26 and return Adult category", async () => {
    jest.useFakeTimers({
      now: new Date("2026-01-01"),
    });

    const expectedCategory = "Adult";
    const response = await createUserRequest({
      name: "John Doe",
      birthdate: "2000-01-01",
    });
    expect(response.status).toBe(201);
    const result = await response.json();
    expect(result).toHaveProperty("id");

    const user = await findUserByIdRequest(result.id);
    expect(user.category).toBe(expectedCategory);

    jest.useRealTimers();
  });

  it("should register a new user with age 51 and return Senior category", async () => {
    jest.useFakeTimers({
      now: new Date("2076-01-01"),
    });

    const expectedCategory = "Senior";
    const response = await createUserRequest({
      name: "John Doe",
      birthdate: "2000-01-01",
    });
    expect(response.status).toBe(201);
    const result = await response.json();
    expect(result).toHaveProperty("id");

    const user = await findUserByIdRequest(result.id);
    expect(user.category).toBe(expectedCategory);

    jest.useRealTimers();
  });

  it("should register a new user with age 17 and return Minor category", async () => {
    jest.useFakeTimers({
      now: new Date("2017-01-01"),
    });

    const expectedCategory = "Minor";
    const response = await createUserRequest({
      name: "John Doe",
      birthdate: "2000-01-01",
    });
    expect(response.status).toBe(201);
    const result = await response.json();
    expect(result).toHaveProperty("id");

    const user = await findUserByIdRequest(result.id);
    expect(user.category).toBe(expectedCategory);

    jest.useRealTimers();
  });
});
