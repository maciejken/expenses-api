import express from "express";
import http from "http";
import dotenv from "dotenv";
import { create, find, findAll, remove, syncDb, update } from "./db/db.esm.js";

dotenv.config();

syncDb();

const app = express();

const expensesRouter = new express.Router();

app.use(express.json());

expensesRouter.get("/", async (req, res, next) => {
  const expenses = await findAll("expenses");
  res.json(expenses);
});

expensesRouter.post("/", async (req, res, next) => {
  const { title, amount } = req.body;
  if (title && amount) {
    const newExpense = await create("expenses", { title, amount });
    res.json(newExpense);
  } else {
    next(error(422, "title or amount empty!"));
  }
});

expensesRouter.get("/:id", async (req, res, next) => {
  const expense = await find("expenses", req.params.id);
  res.json(expense);
});

expensesRouter.patch("/:id", async (req, res, next) => {
  const payload = { ...req.body, id: req.params.id };
  const updatedExpense = await update("expenses", payload);
  res.json(updatedExpense);
});

expensesRouter.delete("/:id", async (req, res, next) => {
  const result = await remove("expenses", req.params.id);
  res.json(result);
});

app.use('/api/expenses', expensesRouter);

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
