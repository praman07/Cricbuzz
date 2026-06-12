import AppError from "./App.error.js";
import { StatusCodes } from "http-status-codes";

export default class NotFoundError extends AppError {
  constructor(message, details) {
    super(message, StatusCodes.NOT_FOUND, details);
  }
}
