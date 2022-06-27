import isDate from "validator/lib/isDate.js";
import { AppError } from "./errors.mjs";

const checkDate = (date, isRequired = false) => {
  return !(date || isRequired) || isDate(date);
};

const getErrorMessage = ({ name, value, reqPart }) => {
  return `${AppError.InputError}: '${name}' - incorrect value in ${reqPart} ('${value}')`;
};

const getDateError = ({ from, to, date, reqPart }) => {
  if (reqPart === "body") {
    // date is required only in new expense data
    const isValidDate = checkDate(date, true);
    const msg =  getErrorMessage({ name: "date", value: date, reqPart });
    return isValidDate
      ? null
      : new Error(msg);
  }
  const isValidFrom = checkDate(from);
  const isValidTo = checkDate(to);
  if (isValidFrom && isValidTo) {
    return null;
  }
  if (!isValidFrom) {
    const msg = getErrorMessage({ name: "from", value: from, reqPart });
    return new Error(msg);
  }
  if (!isValidTo) {
    const msg = getErrorMessage({ name: "to", value: to, reqPart });
    return new Error(msg);
  }
};

export const checkDateInBody = (req, res, next) => {
  const error = getDateError({ date: req.body.date, reqPart: "body" });
  if (!error) {
    next();
  } else {
    next(error);
  }
};

export const checkDatesInQuery = (req, res, next) => {
  const { from, to } = req.query;
  const error = getDateError({ from, to, reqPart: "query" });
  if (!error) {
    next();
  } else {
    next(error);
  }
};
