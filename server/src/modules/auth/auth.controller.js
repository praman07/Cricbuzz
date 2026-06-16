import { StatusCodes } from "http-status-codes";
import { app_config } from "../../shared/constants/app.constant.js";
import AuthService from "./auth.service.js";
import { buildSuccessResponse } from "../../shared/utils/buildSuccessRespose.js";

export default class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  /**
   * @route   GET /auth/google/callback
   * @desc    Handles Google OAuth callback,
   *          generates JWT tokens and redirects user
   * @access  Public
   */
  async GoogleCallback(req, res) {
    const { accessToken, refreshToken } =
      await this.authService.createUser(req.user);

    // Store tokens in secure cookies
    res.cookie(
      "accessToken",
      accessToken,
      app_config.cookies.ACESSS_COKKIE
    );

    res.cookie(
      "refreshToken",
      refreshToken,
      app_config.cookies.REFRESH_COOKIE
    );

    // Redirect user to dashboard after successful login
    res.redirect("http://localhost:5173/home");
  }

  /**
   * @route   POST /auth/register
   * @desc    Register a new user and issue tokens
   * @access  Public
   */
  async registerController(req, res) {
    const { user, accessToken, refreshToken } =
      await this.authService.registerUser(req.body);

    // Save JWT tokens in cookies
    res.cookie(
      "accessToken",
      accessToken,
      app_config.cookies.ACESSS_COKKIE
    );

    res.cookie(
      "refreshToken",
      refreshToken,
      app_config.cookies.REFRESH_COOKIE
    );

    return res.status(StatusCodes.CREATED).json({
      message: "User registered successfully",
      user,
    });
  }

  /**
   * @route   POST /auth/login
   * @desc    Authenticate user and issue JWT tokens
   * @access  Public
   */
  async logincontroller(req, res) {
    const { user, accessToken, refreshToken } =
      await this.authService.loginUser(req.body);

    // Save JWT tokens in cookies
    res.cookie(
      "accessToken",
      accessToken,
      app_config.cookies.ACESSS_COKKIE
    );

    res.cookie(
      "refreshToken",
      refreshToken,
      app_config.cookies.REFRESH_COOKIE
    );

    return res.status(StatusCodes.OK).json({
      message: "User logged in successfully",
      user,
    });
  }
 /**
 * @route   GET /auth/me
 * @desc    get the current user details. 
 *          
 * @access  Public
 */

  async getMe(req,res){
    buildSuccessResponse(res,"User Verified",200,req.user)

  }


  /**
 * @route   GET /auth/refresh
 * @desc    Generates a new access token using the refresh token
 *          stored in cookies and sends it back as an HTTP-only cookie.
 * @access  Public
 */
async refreshAccessToken(req, res) {
  const { accessToken } = await this.authService.refreshAccessToken(
    req.cookies.refreshToken
  );

  res.cookie(
    "accessToken",
    accessToken,
    app_config.cookies.ACESSS_COKKIE
  );

  return res.status(StatusCodes.OK).json({
    message: "Access token generated successfully",
  });
}
}