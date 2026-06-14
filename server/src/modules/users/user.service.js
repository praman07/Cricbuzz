
import UserRepo from "../../repository/user.repository.js";
import { ROLES } from "../../shared/constants/role.js";
import BadRequestError from "../../shared/errors/BadRequest.error.js";
import NotFoundError from "../../shared/errors/NotFound.error.js";


export default class UserService {
  constructor() {
    this.userRepo = new UserRepo()
  }

  async getUsers() {
    return await this.userRepo.findAll();
  }

  /**
   * Get single active user by idx
   */
  async getUserById(id) {
    const user = await this.userRepo.findById(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  async changeUserRole(currentUser, targetUserId, newRole) {
    try {
      // find user
      const user = await this.userRepo.findById(targetUserId);

      if (!user) {
        throw new NotFoundError("User not found");
      }

      // prevent self role change
      if (currentUser._id.toString() === user._id.toString()) {
        throw new BadRequestError("You cannot change your own role");
      }

      // validate role
      const allowedRoles = Object.values(ROLES);
      if (!allowedRoles.includes(newRole)) {
        throw new BadRequestError("Invalid role");
      }

      // prevent last SUPER_ADMIN removal (optional but best practice)
      if (user.role === ROLES.SUPER_ADMIN && newRole !== ROLES.SUPER_ADMIN) {
        const count = await this.userRepo.countByRole(ROLES.SUPER_ADMIN);

        if (count <= 1) {
          throw new BadRequestError("At least one SUPER_ADMIN required");
        }
      }

      // update role
      user.role = newRole;

      await user.save();

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
    } catch (error) {
      console.log("error in service", error)
    }
  }
}