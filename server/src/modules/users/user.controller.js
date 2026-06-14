import { StatusCodes } from "http-status-codes";
import UserService from "./user.service.js";

export default class UserController {
  constructor() {
    this.userService = new UserService();
  }

  /**
   * Get all users
   * Access: SUPER_ADMIN
   */
  async getUsers(req, res, next) {
  
      const users = await this.userService.getUsers();

      return res.status(StatusCodes.OK).json({
        success: true,
        count: users.length,
        users,
      });
    } 


  /**
   * Get user by id
   * Access: SUPER_ADMIN
   */
  async getUserById(req, res) {
  
      const user = await this.userService.getUserById(
        req.params.id
      );

      return res.status(StatusCodes.OK).json({
        success: true,
        user,
      });
   
  }

  async changeUserRole(req,res){{
    try {
         const currentUser = req.user; // from authMiddleware
      const targetUserId = req.params.id;
      const { role } = req.body; 

      const updatedUser = await this.userService.changeUserRole(
        currentUser,
        targetUserId,
        role
      );
       return res.status(StatusCodes.OK).json({
        success: true,
        message: "User role updated successfully",
        data: updatedUser,
      });
    } catch (error) {
        console.log("error",error)
    }
  }}
}