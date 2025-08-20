import { Request, Response } from "express";
import { HttpStatus } from "../../../../domain/entities/httpStatus";
import { IeditProfileUsecase } from "../../../../domain/interface/usecaseInterface/users/IeditProfileUsecase";

export class EditProfileController{
    private _EditProfileUseCase : IeditProfileUsecase
    constructor(EditProfileUseCase:IeditProfileUsecase){
        this._EditProfileUseCase=EditProfileUseCase
    }

    async handleEditProfle(req:Request,res:Response):Promise<void>{
        try {
            const input = {
                userId: req.body.userId,
                profileData: {
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    address: req.body.address,
                    city: req.body.city,
                    state: req.body.state,
                    pincode: req.body.pincode
                }
            };
            const updatedUser = await this._EditProfileUseCase.handleEditProfile(input);
            res.status(HttpStatus.OK).json({message: 'Profile updated successfully', user: updatedUser});
        } catch (error) {
           console.log('error while editing profile', error)
            res.status(HttpStatus.BAD_REQUEST).json({
                message: "Error while editing profile",
                error: error instanceof Error ? error.message : 'Unknown error from edit profile controller',
            })
        }
    }
}