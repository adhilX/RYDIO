import { Request, Response } from "express";
import { HttpStatus } from "../../../../domain/entities/httpStatus";
import { IChangePasswordUsecase } from "../../../../domain/interface/usecaseInterface/user/userProfile/IchangePasswordUsercase";

export class ChangePasswordUserController{
    private _changePasswordUsecase : IChangePasswordUsecase
    constructor(changePasswordUsecase:IChangePasswordUsecase){
        this._changePasswordUsecase=changePasswordUsecase
    }

    async handleEditProfle(req:Request,res:Response):Promise<void>{
        try {
       const newUser =  await this._changePasswordUsecase.handleChangePassword(req.body.value)
           res.status(HttpStatus.OK).json({message:'password changes',newUser})
        } catch (error) {
            console.error('Error while changing password:', error);
            res.status(HttpStatus.BAD_REQUEST).json({
                message: "Error while changing password",
                error: error instanceof Error ? error.message : 'Unknown error from change password controller',
            });
        }
    }
}