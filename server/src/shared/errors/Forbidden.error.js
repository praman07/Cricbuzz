import AppError from "./App.error.js";
import { StatusCodes } from "http-status-codes";

export default class ForbiddenError extends AppError {
  //forbidden error means 403
  constructor(message, details) {
    super(message, StatusCodes.FORBIDDEN, details);
  }
}
