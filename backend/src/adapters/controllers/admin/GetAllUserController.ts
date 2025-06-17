import { Request, Response } from "express";
import { User } from "../../../domain/entities/userEntities";
import { IgetAllUserUsecase } from "../../../domain/interface/usecaseInterface/admin/getAllUserUsecase";
import { HttpStatus } from "../../../domain/entities/httpStatus";

export class GetAllUserController{
    
private  getAllUserUsecase : IgetAllUserUsecase

    constructor(getAllUserUsecase:IgetAllUserUsecase){
        this.getAllUserUsecase =  getAllUserUsecase
    }

    async getAllUsers(req:Request,res:Response):Promise< void>{
       const user= await this.getAllUserUsecase.getAllUser()
       res.status(HttpStatus.OK).json({user,message:'success'})
    }
}