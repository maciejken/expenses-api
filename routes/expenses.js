import { Router } from "express";
import { nanoid } from "nanoid";
import { find, findAll, remove, update } from "../db/levelDb.js";
import { ErrorMap } from "../middlewares/errors.js";
import {
  checkAmount,
  checkDateInBody,
  checkDatesInQuery,
  checkTitle,
} from "../middlewares/validation.js";

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
    const dateISOString = expenseDate.toISOString();
    if (!category) {
      category = defaultCategory;
    }
    const expenseId = nanoid();
    const newExpense = await update(`expenses__${date}__${expenseId}`, {
      id: expenseId,
      title,
      amount: parseFloat(amount),
      category,
      date: dateISOString,
    });
    res.json(newExpense);
  }
);

expensesRouter.get("/:id", async (req, res, next) => {
  try {
    const expense = await find(`expenses__${req.params.id}`);
    res.json(expense);
  } catch (err) {
    next(new Error(`${ErrorMap.NotFound.type}`));
  }
});

expensesRouter.put("/:id", async (req, res, next) => {
  const payload = { ...req.body, id: req.params.id };
  const updatedExpense = await update(`expenses__${req.params.id}`, payload);
  res.json(updatedExpense);
});

expensesRouter.delete("/:id", async (req, res, next) => {
  const result = await remove(`expenses__${req.params.id}`);
  res.json(result);
});

export default expensesRouter;
