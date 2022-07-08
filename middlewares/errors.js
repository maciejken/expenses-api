import logger from "../lib/logger.js";

export const ErrorMap = {
  NotFound: {
    type: "NotFound",
    status: 404,
  },
  InvalidInput: {
    type: "InvalidInput",
    status: 411,
  },
  Unauthorized: {
    type: "Unauthorized",
    status: 401,
  },
};

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  let error = "Unknown";
  let status = 500;

  const [code] = err.message.split(":");
  const errorMapping = ErrorMap[code];

  if (errorMapping) {
    error = err.message;
    status = errorMapping.status;
  }

  res.status(status).json({ error });
};

export default errorHandler;
