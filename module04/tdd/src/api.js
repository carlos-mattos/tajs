import { createServer } from "node:http";
import { once } from "node:events";
import { randomUUID } from "node:crypto";

const USERS_DB = [];

function getUserCategory(birthdate) {
  const age = new Date().getFullYear() - new Date(birthdate).getFullYear();

  if (age < 18) return "Minor";
  if (age >= 18 && age <= 25) return "Young Adult";
  if (age > 25 && age <= 51) return "Adult";

  return "Senior";
}

const server = createServer(async (req, res) => {
  if (req.url === "/users" && req.method === "POST") {
    const user = JSON.parse(await once(req, "data"));
    const updatedUser = {
      ...user,
      id: randomUUID(),
      category: getUserCategory(user.birthdate),
    };

    USERS_DB.push(updatedUser);

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(updatedUser));
    return;
  }

  if (req.url.startsWith("/users/") && req.method === "GET") {
    const [, , id] = req.url.split("/");
    const user = USERS_DB.find((user) => user.id === id);

    res.end(JSON.stringify(user));
    return;
  }

  res.end();
  return;
});

export default server;
