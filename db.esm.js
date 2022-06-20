import { Low, JSONFile } from "lowdb";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const file = path.resolve(__dirname, "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);

export const syncDb = async () => {
  await db.read();
  const hasData = !!db.data;
  db.data ||= {
    expenses: [],
    users: [],
    categories: [],
  };

  if (!hasData) {
    await db.write();
    console.info("db.json created!");
  }
};

export const getExpenses = async () => {
  await db.read();
  return db.data.expenses;
};

export const createExpense = async ({ title, amount, category }) => {
  const id = nanoid();
  db.data.expenses.push({ id, title, amount, category });
  await db.write();
  return { id, title, amount, category };
};
