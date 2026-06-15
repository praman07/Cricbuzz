import bcrypt from "bcrypt";
import userModel from "./models/user.model.js";

const createSuperAdmin = async () => {
  try {

    const existingUser = await userModel.findOne({
      email:"superadmin@gmail.com"
    });

    if (existingUser) {
      console.log("Super Admin already exists");
      return;
    }

   

    await userModel.create({
      name: "Super Admin",
      email: "superadmin@gmail.com",
      password: "super123",
      role: "SUPER_ADMIN",
    });

    console.log("Super Admin Created");
  } catch (error) {
    console.error(
      "Super Admin Seed Error:",
      error
    );
  }
};

export default createSuperAdmin