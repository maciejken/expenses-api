import express from "express";
import http from "http";
import dotenv from "dotenv";
import { syncDb } from "./db/jsonDb.mjs";
import expensesRouter from "./routes/expenses.mjs"

dotenv.config();

syncDb();

const app = express();

app.use(express.json());

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
