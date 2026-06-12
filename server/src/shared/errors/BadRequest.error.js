import AppError from "./App.error.js";
import { StatusCodes } from "http-status-codes";

export default class BadRequestError extends AppError {
  constructor(message, details) {
    super(message, StatusCodes.BAD_REQUEST, details);
  }
}
