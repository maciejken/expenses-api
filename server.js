import express from "express";
import http from "http";
import dotenv from "dotenv";
import { create, find, findAll, syncDb } from "./db/jsonDb.mjs";

dotenv.config();

syncDb();

const app = express();

app.use(express.json());

app.get("/api/expenses", async (req, res, next) => {
  const expenses = await findAll("expenses");
  res.json(expenses);
});

app.post("/api/expenses", async (req, res, next) => {
  const { title, amount } = req.body;
  if (title && amount) {
    const newExpense = await create("expenses", { title, amount });
    res.json(newExpense);
  } else {
    next(error(422, "title or amount empty!"));
  }
});

app.get("/api/expenses/:id", async (req, res, next) => {
  const expense = await find("expenses", req.params.id);
  res.json(expense);
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send({ error: err.message });
});

app.use(function (req, res) {
  res.status(404);
  res.send({ error: "Sorry, can't find that" });
});

const httpServer = http.createServer(app);

const HOSTNAME = process.env.HOSTNAME;
const HTTP_PORT = process.env.HTTP_PORT;

httpServer.listen(HTTP_PORT, () => {
  console.info(`server is running at http://${HOSTNAME}:${HTTP_PORT}`);
});
