const express = require("express");
const http = require("http");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.get("/hello", async (req, res, next) => {
  res.json({ message: "Hello world!" });
});

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
