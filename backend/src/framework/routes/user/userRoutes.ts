import { Request, Response, Router } from "express";
import { sendendOtpController, userRegisterController } from "../../DI/userInject";

export class UserRoutes {

    public UserRoutes : Router

    constructor() {
        this.UserRoutes = Router();
        this.setRoutes();
    }

    private setRoutes(){
    this.UserRoutes.post('/signup', (req: Request, res:Response) => {
       sendendOtpController.sendOtp(req,res)
    })
    this.UserRoutes.post('/verifyotp',(req:Request,res:Response)=>{
       userRegisterController.register(req,res)
    })
    this.UserRoutes.post('/login',(req:Request, res:Response)=>{
        
    })
}}