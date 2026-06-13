import UserRepo from "../../../repository/user.repository.js";
import jwt from "jsonwebtoken";
import env from "../../../config/env.js";
import AppError from "../../../shared/errors/App.error.js";
import {StatusCodes} from 'http-status-codes'
import BadRequestError from "../../../shared/errors/BadRequest.error.js";
import ConflictError from "../../../shared/errors/conflict.error.js";
import UnprocessableEntityError from "../../../shared/errors/UnprocessableEntitiy.error.js";
export default class AuthService {
  constructor() {
    this.userRepo = new UserRepo();
  }
  async createUser(user) {
  let dbUser = await this.userRepo.findByEmail(
    user.emails[0].value
  );

  if (!dbUser) {
    dbUser = await this.userRepo.create({
      email: user.emails[0].value,
      picture: user.photos[0].value,
      name: user.displayName,
    });
  }

  const payload = {
    _id: dbUser._id,
    email: dbUser.email,
    picture: dbUser.picture,
    role: dbUser.role,
    name: dbUser.name,
  };

  const accessToken = jwt.sign(
    payload,
    env.JWT_ACCESS_SECRET,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    payload,
    env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  dbUser.refreshToken = refreshToken;

  await dbUser.save();

  return {
    user: {
      id: dbUser._id,
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role,
      picture: dbUser.picture,
    },
    accessToken,
    refreshToken,
  };
}
  async registerUser(data) {
    const { name, email, password } = data;

    // Required fields
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      throw new BadRequestError("All fields are required");
    }

    // Name validation
    if (name.trim().length < 3) {
      throw new UnprocessableEntityError(
        "Name must be at least 3 characters long"
      );
    }

    // Email validation
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      throw new UnprocessableEntityError("Invalid email format");
    }

    // Password validation
    if (password.length < 8) {
      throw new UnprocessableEntityError(
        "Password must be at least 8 characters long"
      );
    }

    // Check existing user
    const existingUser = await this.userRepo.findByEmail(email);

    if (existingUser) {
      throw new ConflictError("User already exists");
    }

    // Create user
    const user = await this.userRepo.create({
      name,email,password
    });

    // Generate tokens
    const payload = {
    _id: user.id,
        email: user.email,
        picture: user.picture,
        role:user.role,
        name: user.name,
    };

    const accessToken = jwt.sign(
      payload,
      env.JWT_ACCESS_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      payload,
      env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );
  user.refreshToken=refreshToken
  await user.save()
    return {
      user,
      accessToken,
      refreshToken,
    };
  }
  async loginUser(data) {
  const { email, password } = data;

  // Required fields
  if (!email?.trim() || !password?.trim()) {
    throw new BadRequestError("Email and password are required");
  }

  // Find user
  const user = await this.userRepo.findByEmail(email);

  if (!user) {
    throw new UnprocessableEntityError("Invalid email or password");
  }

  // Google users may not have password
  if (!user.password) {
    throw new UnprocessableEntityError(
      "Please login with Google"
    );
  }

  // Compare password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new UnprocessableEntityError(
      "Invalid email or password"
    );
  }

  // Generate tokens
  const payload = {
    _id: user._id,
    email: user.email,
    picture: user.picture,
    role: user.role,
    name: user.name,
  };

  const accessToken = jwt.sign(
    payload,
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: "1h",
    }
  );

  const refreshToken = jwt.sign(
    payload,
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );

  // Save refresh token
  user.refreshToken = refreshToken;
  await user.save();

  return {
    user,
    accessToken,
    refreshToken,
  };
}
}
