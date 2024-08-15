import { createServer } from "node:http";
import { once } from "node:events";
import { Person } from "./person.js";

const server = createServer(async (req, res) => {
  if (req.method !== "POST" || req.url !== "/persons") {
    return res.writeHead(404).end();
  }

  try {
    const data = (await once(req, "data")).toString();
    const result = Person.process(JSON.parse(data));

    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(result));
    res.end();

    return;
  } catch (error) {
    console.error(error);

    if (error.message.includes("required")) {
      res.writeHead(400);
      res.write(JSON.stringify({ validationError: error.message }));
      res.end();
      return;
    }

    res.writeHead(500);
    res.end();
  }
});

export default server;
