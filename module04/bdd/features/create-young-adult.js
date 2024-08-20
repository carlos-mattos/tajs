import { BeforeStep, Then, When } from "@cucumber/cucumber";
import { deepStrictEqual, ok, strictEqual } from "node:assert";

let _testServerAddress = "";
let _context = {};

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

BeforeStep(function () {
  _testServerAddress = this.testServerAddress;
});

When("I create a new user with the following details:", async function (table) {
  const user = table.hashes()[0];
  const response = await createUserRequest(user);
  strictEqual(response.status, 201);
  _context.userData = await response.json();
  ok(_context.userData.id);
});

Then("I request the API with the user's ID", async function () {
  const user = await findUserByIdRequest(_context.userData.id);
  _context.createdUserData = user;
});

Then(
  "I should receive a JSON response with the user's details",
  async function () {
    const expectedKeys = ["name", "birthdate", "id", "category"];
    deepStrictEqual(
      Object.keys(_context.createdUserData).sort(),
      expectedKeys.sort()
    );
  }
);

Then("The user's category should be {string}", function (category) {
  strictEqual(_context.createdUserData.category, category);
});
