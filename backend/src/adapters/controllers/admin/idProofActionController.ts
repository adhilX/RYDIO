import { Request, Response } from "express";
import { IidProofActionUsecase } from "../../../domain/interface/usecaseInterface/admin/IidProofActionUsecase";
import { HttpStatus } from "../../../domain/entities/httpStatus";

export class IdProofActionController {

    constructor(private idProofActionUsecase :IidProofActionUsecase){
        this.idProofActionUsecase = idProofActionUsecase
    }

    async idProofAction (req:Request,res:Response):Promise<void>{
        try {
            const {action,owner_id} = req.body
            const {id}= req.params
            console.log(action,id)
            const response = await this.idProofActionUsecase.setAction(id,owner_id,action)
            res.status(HttpStatus.OK).json({message:action+' success'})   
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'An error occurred while processing ID proof action.',
                error: error instanceof Error ? error.message : String(error)
            });
            console.error('IdProofActionController.idProofAction error:', error);
        }
    }
}  