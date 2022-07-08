import express from "express";
import http from "http";
import dotenv from "dotenv";
import morgan from "morgan";
import logger from "./lib/logger.js";
import { syncDb } from "./db/jsonDb.js";
import expensesRouter from "./routes/expenses.js";
import errorHandler from "./middlewares/errors.js";

dotenv.config();

syncDb();

const app = express();

app.use(
  morgan(
    ':remote-addr - :remote-user ":method :url HTTP/:http-version" status: :status :res[content-length] - :response-time ms ":referrer" ":user-agent"',
    {
      stream: logger.stream,
    }
  )
);

app.use(express.json());

app.use("/api/expenses", expensesRouter);

app.use(errorHandler);

const httpServer = http.createServer(app);

const HOSTNAME = process.env.HOSTNAME;
const HTTP_PORT = process.env.HTTP_PORT;

httpServer.listen(HTTP_PORT, () => {
  logger.info(`listening at http://${HOSTNAME}:${HTTP_PORT}`);
});
