import { Request, Response } from "express";
import { IjwtService } from "../../../../domain/interface/serviceInterface/IjwtService";
import { IloginUserUsecase } from "../../../../domain/interface/usecaseInterface/user/authentication/IloginUserUsecase";

export class UserLoginController {
    private jwtService: IjwtService
    private loginUserUsecase : IloginUserUsecase

    constructor(jwtService:IjwtService,loginUserUsecase:IloginUserUsecase){
        this.jwtService = jwtService
        this.loginUserUsecase =loginUserUsecase
    }

    async handleLogin(req:Request,res:Response){
         const { email, password } = req.body
         
    }
}