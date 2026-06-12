import AppError from "./App.error.js";
import { StatusCodes } from "http-status-codes";

export default class UnauthorizeError extends AppError {
  //Unauthorized means 401
  constructor(message, details) {
    super(message, StatusCodes.UNAUTHORIZED, details);
  }
}
