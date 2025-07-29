import { Request, Response } from "express";
import { IuploadIdProofUsecase } from "../../../../domain/interface/usecaseInterface/user/userProfile/IuploadIdProofUsecase";
import { HttpStatus } from "../../../../domain/entities/httpStatus";

export class UploadIdProofController {

    private uploadIdProofUsecase : IuploadIdProofUsecase

    constructor(uploadIdProofUsecase:IuploadIdProofUsecase){
        this.uploadIdProofUsecase= uploadIdProofUsecase
    }

   async uploadIdProof(req: Request, res: Response): Promise<void> {
       try {
           const { idProofUrl, userId } = req.body;
           if (!idProofUrl || !userId) {
                res.status(HttpStatus.BAD_REQUEST).json({
                   message: "Missing required fields: idProofUrl and userId",
               });
            return 
           }
          const newUser =  await this.uploadIdProofUsecase.uploadProof(idProofUrl, userId);
           res.status(HttpStatus.OK).json({ message: 'Id proof submitted successfully', newUser});
       } catch (error) {
           console.error('Error while uploading ID proof:', error);
           res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
               message: "An error occurred while uploading ID proof",
                error: error instanceof Error ? error.message : 'Unknown error from uploadIDproof controller',
           });
       }
   }
}