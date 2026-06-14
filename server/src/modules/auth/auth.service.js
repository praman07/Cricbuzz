import UserRepo from "../../repository/user.repository.js";
import jwt from "jsonwebtoken";
import env from "../../config/env.js";
import AppError from "../../shared/errors/App.error.js";
import { StatusCodes } from 'http-status-codes'
import BadRequestError from "../../shared/errors/BadRequest.error.js";
import ConflictError from "../../shared/errors/conflict.error.js";
import UnprocessableEntityError from "../../shared/errors/UnprocessableEntitiy.error.js";
export default class AuthService {
  constructor() {
    this.userRepo = new UserRepo();
  }

  /**
   * Handle Google OAuth Login/Register
   * - Creates user if not exists
   * - Generates access & refresh tokens
   * - Stores refresh token in database
   */
  async createUser(user) {
    // Check if user already exists
    let dbUser = await this.userRepo.findByEmail(
      user.emails[0].value
    );

    // Create new user for first-time Google login
    if (!dbUser) {
      dbUser = await this.userRepo.create({
        email: user.emails[0].value,
        picture: user.photos[0].value,
        name: user.displayName,
      });
    }

    // JWT payload
    const payload = {
      _id: dbUser._id,
      email: dbUser.email,
      picture: dbUser.picture,
      role: dbUser.role,
      name: dbUser.name,
    };

    // Generate authentication tokens
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

    // Persist refresh token
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

  /**
   * Register a new user
   * - Validates input
   * - Checks duplicate email
   * - Creates account
   * - Issues JWT tokens
   */
  async registerUser(data) {
    const { name, email, password, role } = data;

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      throw new BadRequestError("All fields are required");
    }

    // Validate name length
    if (name.trim().length < 3) {
      throw new UnprocessableEntityError(
        "Name must be at least 3 characters long"
      );
    }

    // Validate email format
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      throw new UnprocessableEntityError("Invalid email format");
    }

    // Validate password strength
    if (password.length < 8) {
      throw new UnprocessableEntityError(
        "Password must be at least 8 characters long"
      );
    }

    // Prevent duplicate registrations
    const existingUser = await this.userRepo.findByEmail(email);

    if (existingUser) {
      throw new ConflictError("User already exists");
    }

    // Create user account
    const user = await this.userRepo.create({
      name,
      email,
      password,
      role
    });

    // JWT payload
    const payload = {
      _id: user._id,
      email: user.email,
      picture: user.picture,
      role: user.role,
      name: user.name,
    };

    // Generate tokens
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

    // Store refresh token
    user.refreshToken = refreshToken;
    await user.save();

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Authenticate existing user
   * - Validates credentials
   * - Verifies password
   * - Issues fresh JWT tokens
   */
  async loginUser(data) {
    const { email, password } = data;

    // Validate request body
    if (!email?.trim() || !password?.trim()) {
      throw new BadRequestError(
        "Email and password are required"
      );
    }

    // Find user by email
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      throw new UnprocessableEntityError(
        "Invalid email or password"
      );
    }

    // Google accounts don't have passwords
    if (!user.password) {
      throw new UnprocessableEntityError(
        "Please login with Google"
      );
    }

    // Verify password
    const isPasswordValid =
      await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new UnprocessableEntityError(
        "Invalid email or password"
      );
    }

    // JWT payload
    const payload = {
      _id: user._id,
      email: user.email,
      picture: user.picture,
      role: user.role,
      name: user.name,
    };

    // Generate tokens
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

    // Update refresh token in database
    user.refreshToken = refreshToken;
    await user.save();

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}