import { StatusCodes } from "http-status-codes";
import { app_config } from "../../../shared/constants/app.constant.js";
import AuthService from "./auth.service.js";



export default class AuthController{
    constructor(){
        this.authService=new AuthService()
    }
    async GoogleCallback(req,res){
     let {accessToken,refreshToken} = await this.authService.createUser(req.user)
     res.cookie("accesstoken",accessToken,app_config.cookies.ACESSS_COKKIE)
     res.cookie("refreshToken",refreshToken,app_config.cookies.REFRESH_COOKIE)
     res.redirect('http://localhost:5173')
    }
    async registerController(req,res){
        let {user,accessToken,refreshToken}=await this.authService.registerUser(req.body)
       
  res.cookie("accesstoken",accessToken,app_config.cookies.ACESSS_COKKIE)
     res.cookie("refreshToken",refreshToken,app_config.cookies.REFRESH_COOKIE)
        return res.status(StatusCodes.OK).json({message:"user registered successfully",user})   

    }


    async logincontroller(req,res){
    let {user,accessToken,refreshToken}=await this.authService.loginUser(req.body)
       
  res.cookie("accesstoken",accessToken,app_config.cookies.ACESSS_COKKIE)
     res.cookie("refreshToken",refreshToken,app_config.cookies.REFRESH_COOKIE)
        return res.status(StatusCodes.OK).json({message:"User logged in successfully",user})  
    }
}