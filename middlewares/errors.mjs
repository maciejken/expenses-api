import logger from "../lib/logger.mjs";

export const ErrorMap = {
  InputError: {
    type: "InputError",
    status: 411,
  },
  AuthError: {
    type: "AuthError",
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

  logger.error(err.stack);
  res.status(status).json({ error });
};

export default errorHandler;
