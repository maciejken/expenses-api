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
  users: [],
  categories: [],
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

export const findAll = async (name) => {
  await db.read();
  return db.data[name];
};

export const create = async (name, newData) => {
  await db.read();
  const newItem = { id: nanoid(), ...newData };
  db.data[name].push(newItem);
  await db.write();
  return newItem;
};

export const update = async (name, updatedData) => {
  await db.read();
  const updatedDataIndex = db.data[name]
    .map((item) => item.id)
    .indexOf(updatedData.id);
  if (updatedDataIndex >= 0) {
    db.data[name][updatedDataIndex] = updatedData;
    await db.write();
    return updatedData;
  }
  return null;
};

export const remove = async (name, dataId) => {
  await db.read();
  const deletedDataIndex = db.data[name].map((item) => item.id).indexOf(dataId);
  if (deletedDataIndex >= 0) {
    const data = db.data[name];
    db.data[name] = data
      .slice(0, deletedDataIndex)
      .concat(data.slice(deletedDataIndex + 1));
    await db.write();
    return 1;
  }
  return null;
};