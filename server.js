import express from "express";
import http from "http";
import dotenv from "dotenv";
import morgan from "morgan";
import logger from "./lib/logger.mjs";
import { syncDb } from "./db/jsonDb.mjs";
import expensesRouter from "./routes/expenses.mjs";
import errorHandler from "./middlewares/errors.mjs";

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
