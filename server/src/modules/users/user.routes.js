import express from "express";
import UserController from "./user.controller.js";



import { authMiddleware, authorizeRoles } from "../../shared/middlewares/auth.middleware.js";
import { ROLES } from "../../shared/constants/role.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";

const router = express.Router();
const userController = new UserController();

/**
 * Get all users
 * Access: SUPER_ADMIN
 */
router.get(
  "/",
  authMiddleware,
  authorizeRoles(ROLES.ADMIN,ROLES.SUPER_ADMIN),
  asyncHandler(userController.getUsers.bind(userController))
);

/**
 * Get user by id
 * Access: SUPER_ADMIN
 */
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles(ROLES.ADMIN,ROLES.SUPER_ADMIN),
  asyncHandler(userController.getUserById.bind(userController))
);

router.patch(
  "/:id/role",
  authMiddleware,
  authorizeRoles(ROLES.SUPER_ADMIN),
 asyncHandler(userController.changeUserRole.bind(userController))
);

export default router;