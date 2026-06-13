import { StatusCodes } from "http-status-codes";
import AppError from "./App.error.js";

export default class UnprocessableEntityError extends AppError{
    constructor(message,details){
        super(message,StatusCodes.UNPROCESSABLE_ENTITY,details)
    }
}