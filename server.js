import express from "express";
import http from "http";
import dotenv from "dotenv";
import logger from "./lib/logger.mjs";
import { syncDb } from "./db/jsonDb.mjs";
import expensesRouter from "./routes/expenses.mjs";
import errorHandler from "./middlewares/errors.mjs";

dotenv.config();

syncDb();

const app = express();

app.use(express.json());

const logRequestStart = (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}, client IP ${req.ip}`);
  next();
};
app.use(logRequestStart);

app.use("/api/expenses", expensesRouter);

const logRequestError = (req, res, next) => {
  logger.error(`${req.method} ${req.originalUrl} route not found`);
  next();
};
app.use(logRequestError);

app.use(errorHandler);

const httpServer = http.createServer(app);

const HOSTNAME = process.env.HOSTNAME;
const HTTP_PORT = process.env.HTTP_PORT;

httpServer.listen(HTTP_PORT, () => {
  logger.info(`listening at http://${HOSTNAME}:${HTTP_PORT}`);
});
