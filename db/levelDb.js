import { Level } from "level";

const db = new Level("db/level", { valueEncoding: "json" });

export const syncDb = async () => {
  await db.open();
};

export const find = async (key) => {
  return db.get(key);
};

export const findAll = async (query) => {
  const keys = await db.keys({ gt: "a", limit: 10 }).all();
  return db.getMany(keys);
};

export const update = async (key, updatedData) => {
  await db.put(key, updatedData);
  return db.get(key);
};

export const remove = async (key) => {
  return db.del(key);
};
