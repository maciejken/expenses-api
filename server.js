import express from "express";
import http from "http";
import dotenv from "dotenv";
import { nanoid } from "nanoid";
import { join, dirname } from "path";
import { Low, JSONFile } from "lowdb";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config();

// Use JSON file for storage
const file = join(__dirname, "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);

const app = express();

app.use(express.json());

// function error(status, msg) {
//   var err = new Error(msg);
//   err.status = status;
//   return err;
// }

// app.use("/api", function (req, res, next) {
//   var key = req.query["api-key"];

//   // key isn't present
//   if (!key) return next(error(400, "api key required"));

//   // key is invalid
//   if (apiKeys.indexOf(key) === -1) return next(error(401, "invalid api key"));

//   // all good, store req.key for route access
//   req.key = key;
//   next();
// });

// map of valid api keys, typically mapped to
// account info with some sort of database like redis.
// api keys do _not_ serve as authentication, merely to
// track API usage or help prevent malicious behavior etc.

// var apiKeys = ["foo", "bar", "baz"];

app.get("/api/expenses", async (req, res, next) => {
  await db.read();
  const hasData = !!db.data;
  db.data ||= { expenses: [] };

  if (!hasData) {
    await db.write();
  }
  res.send(db.data.expenses);
});

app.post("/api/expenses", async (req, res, next) => {
  const { title, amount } = req.body;
  await db.read();
  if (title && amount) {
    const id = nanoid();
    db.data.expenses.push({ id, title, amount });
    await db.write();
    res.json(db.data.expenses);
  } else {
    next();
  }
});

// middleware with an arity of 4 are considered
// error handling middleware. When you next(err)
// it will be passed through the defined middleware
// in order, but ONLY those with an arity of 4, ignoring
// regular middleware.
app.use(function (err, req, res, next) {
  // whatever you want here, feel free to populate
  // properties on `err` to treat it differently in here.
  res.status(err.status || 500);
  res.send({ error: err.message });
});

// our custom JSON 404 middleware. Since it's placed last
// it will be the last middleware called, if all others
// invoke next() and do not respond.
app.use(function (req, res) {
  res.status(404);
  res.send({ error: "Sorry, can't find that" });
});

const httpServer = http.createServer(app);

const HTTP_PORT = process.env.HTTP_PORT;

httpServer.listen(HTTP_PORT, () => {
  console.info(`server is running on port ${HTTP_PORT}`);
});
