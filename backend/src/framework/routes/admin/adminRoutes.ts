import { Request, Response, Router } from "express";
import { adminLoginController, getAllUserController } from "../../DI/adminInject";

export class AdminRoutes {
     public AdminRoute : Router

    constructor(){
        this.AdminRoute = Router()
        this.setRoutes()
    }

    private setRoutes(){
        this.AdminRoute.post('/login',(req:Request,res:Response)=>{
            adminLoginController.handleAdminLogin(req,res)
        })
    
        this.AdminRoute.get('/getUsers',(req:Request,res:Response)=>{
            console.log('asdk')
            getAllUserController.getAllUsers(req,res)
        })

        this.AdminRoute.get('/test',(req:Request,res:Response)=>{
            res.send('hyyy iam here')
        })
    }
}