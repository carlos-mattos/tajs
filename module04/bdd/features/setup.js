import { Given, AfterAll } from "@cucumber/cucumber";
import sinon from "sinon";
import server from "../src/api.js";

let _testServer;

function waitForServerToStart(server) {
  return new Promise((resolve, reject) => {
    server.once("listening", () => resolve(server));
    server.once("error", (error) => reject(error));
  });
}

AfterAll(function (done) {
  sinon.restore();
  server.closeAllConnections();
  _testServer.close(done);
});

Given("I have a running server", async function () {
  _testServer = server.listen();
  await waitForServerToStart(_testServer);
  const serverInfo = _testServer.address();
  this.testServerAddress = `http://localhost:${serverInfo.port}`;
});

Given("The current date is {string}", function (date) {
  sinon.restore();
  const clock = sinon.useFakeTimers(new Date(date).getTime());
  this.clock = clock;
});
