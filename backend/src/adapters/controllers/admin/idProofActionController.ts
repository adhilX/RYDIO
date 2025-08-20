import { Request, Response } from "express";
import { IidProofActionUsecase } from "../../../domain/interface/usecaseInterface/users/IidProofActionUsecase";
import { HttpStatus } from "../../../domain/entities/httpStatus";

export class IdProofActionController {

    constructor(private _idProofActionUsecase :IidProofActionUsecase){
        this._idProofActionUsecase = _idProofActionUsecase
    }

    async idProofAction (req:Request,res:Response):Promise<void>{
        try {
            const {action,owner_id,reason} = req.body
            const {id}= req.params
            console.log(action,id)
            await this._idProofActionUsecase.setAction({idProof_id:id,owner_id,action,reason})
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