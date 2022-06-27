import { Router } from "express";
import { create, find, findAll, remove, update } from "../db/jsonDb.mjs";
import {
  checkAmount,
  checkDateInBody,
  checkDatesInQuery,
  checkTitle,
} from "../middlewares/validation.mjs";

const expensesRouter = new Router();

const defaultCategory = "uncategorized";

expensesRouter.get("/", checkDatesInQuery, async (req, res, next) => {
  const { from, to, category, groupBy } = req.query;
  const expenses = await findAll("expenses", {
    where: {
      startDate: from ? new Date(from) : null,
      endDate: to ? new Date(to) : null,
      category,
    },
    groupBy,
  });
  res.json(expenses);
});

expensesRouter.post(
  "/",
  checkTitle,
  checkAmount,
  checkDateInBody,
  async (req, res, next) => {
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
    const newExpense = await create("expenses", {
      title,
      amount,
      category,
      date,
    });
    res.json(newExpense);
  }
);

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

export default expensesRouter;
