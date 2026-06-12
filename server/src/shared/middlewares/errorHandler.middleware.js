import { StatusCodes } from "http-status-codes";

const Errorhandler = (err, req, res, next) => {
  res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default Errorhandler;
