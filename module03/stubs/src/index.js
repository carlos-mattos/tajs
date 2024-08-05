import { Service } from "./service.js";

const data = {
  username: `user${Math.floor(Math.random() * 1000)}`,
  password: `pass${Math.floor(Math.random() * 1000)}`,
};

const service = new Service({
  filename: "./users.ndjson",
});

await service.create(data);

const users = await service.read();

console.log("users", users);
