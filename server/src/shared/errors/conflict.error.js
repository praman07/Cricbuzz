import { StatusCodes } from "http-status-codes";
import AppError from "./App.error.js";
export default class ConflictError extends AppError {
  constructor(message, details) {
    super(message, StatusCodes.CONFLICT, details);
  }
}
