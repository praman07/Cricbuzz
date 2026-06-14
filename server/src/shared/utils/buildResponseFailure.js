import { StatusCodes } from "http-status-codes";

export const buildResponseFailure = (
  message = "Something went wrong",
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
  details = null
) => {
  return {
    success: false,
    statusCode,
    message,
    details,
  };
};