import { Request, Response } from "express";
import { IeditProfileUsecase } from "../../../../domain/interface/usecaseInterface/user/userProfile/IeditProfileUsecase";
import { HttpStatus } from "../../../../domain/entities/httpStatus";

export class EditProfileController{
    private _EditProfileUseCase : IeditProfileUsecase
    constructor(EditProfileUseCase:IeditProfileUsecase){
        this._EditProfileUseCase=EditProfileUseCase
    }

    async handleEditProfle(req:Request,res:Response):Promise<void>{
        try {
       const newUser =  await this._EditProfileUseCase.handleEditProfile(req.body)
           res.status(HttpStatus.CREATED).json({newUser})
        } catch (error) {
           console.log('error while editing profile', error)
            res.status(HttpStatus.BAD_REQUEST).json({
                message: "Error while editing profile",
                error: error instanceof Error ? error.message : 'Unknown error from edit profile controller',
            })
        }
    }
}