import { Low, JSONFile } from "lowdb";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const file = path.resolve(__dirname, "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);

const initialData = {
  expenses: [],
};

export const syncDb = async () => {
  await db.read();
  const hasData = !!db.data;
  db.data ||= initialData;

  if (!hasData) {
    await db.write();
    console.info("db.json created!");
  }
};

export const find = async (name, itemId) => {
  await db.read();
  return db.data[name].find((d) => d.id === itemId) || null;
};

export const findAll = async (name) => {
  await db.read();
  return db.data[name];
};

export const create = async (name, newData) => {
  const newItem = { id: nanoid(), ...newData };
  db.data[name].push(newItem);
  await db.write();
  return newItem;
};
