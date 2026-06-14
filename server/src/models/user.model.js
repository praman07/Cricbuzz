import { Schema, model } from "mongoose";

import { ROLES } from "../shared/constants/role.js";
import bcrypt from 'bcrypt'
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
   
    password: {
      type: String,
     
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.ADMIN,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    picture:{
        type:String,
        default:"https://imgs.search.brave.com/prvIxPo67PTI-yZ-6lm-tuU9ibY9GKqY7vcFf3ppXPk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wbmcu/cG5ndHJlZS5jb20v/cG5nLXZlY3Rvci8y/MDI1MDgxOC9vdXJt/aWQvcG5ndHJlZS13/aGF0c2FwcC1kZWZh/dWx0LXByb2ZpbGUt/cGhvdG8tdmVjdG9y/LXBuZy1pbWFnZV8x/NzAzNDM5Ny53ZWJw"
    },
    refreshToken:{
      type:String
    }
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return ;
  }

  this.password = await bcrypt.hash(this.password, 10);
 
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
let userModel = model("User", userSchema);

export default userModel;
