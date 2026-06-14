import UnauthorizeError from "../errors/Unauthorized.error.js"
import env from '../../config/env.js'
import ForbiddenError from "../errors/Forbidden.error.js";
import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.accessToken

    if (!token) {
      throw new UnauthorizeError("Please login first");
    }
    const decoded = jwt.verify(
      token,
      env.JWT_ACCESS_SECRET
    );

    req.user = decoded;

    next();

  } catch (err) {
    console.log("error", err)
    if (err.name === "TokenExpiredError") {
      throw new UnauthorizeError("Access Token Expired")
    }
    throw new UnauthorizeError("Token Not Found")
  }
}

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new ForbiddenError("Authentication required")
      );
    }
    console.log("roles", req.user.role)

    if (!roles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          "You are not allowed to access this resource"
        )
      );
    }

    next();
  };
};