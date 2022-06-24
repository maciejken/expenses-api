import express from "express";
import http from "http";
import dotenv from "dotenv";
import { create, find, findAll, remove, syncDb, update } from "./db/db.esm.js";

dotenv.config();

syncDb();

const app = express();

const expensesRouter = new express.Router();

app.use(express.json());

const defaultCategory = "uncategorized";

const groupByMap = {
  category: {
    key: "category",
    getInitialData: (name) => ({
      name,
      amount: 0,
    }),
    reducer: (groupData, item) => ({
      ...groupData,
      amount: groupData.amount + item.amount
    }),
  }
};

expensesRouter.get("/", async (req, res, next) => {
  const { from, to, category, group } = req.query;
  const startDate = new Date(from);
  const startDateCheck = startDate.getTime() ? (item) => new Date(item.date).getTime() > startDate.getTime() : null;
  const endDate = new Date(to);
  const endDateCheck = endDate.getTime() ? (item) => new Date(item.date).getTime() < endDate.getTime() : null;
  const groupBy = groupByMap[group];
  const expenses = await findAll("expenses", {
    where: {
      startDate: startDateCheck,
      endDate: endDateCheck,
      category
    },
    groupBy
  });
  res.json(expenses);
});

expensesRouter.post("/", async (req, res, next) => {
  let { title, amount, category, date } = req.body;
  const expenseDate = new Date(date);
  if (!expenseDate.getTime()) {
    date = new Date().toISOString();
  } else {
    date = expenseDate.toISOString();
  }
  if (!category) {
    category = defaultCategory;
  }
  if (title && amount) {
    const newExpense = await create("expenses", { title, amount, category, date });
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
