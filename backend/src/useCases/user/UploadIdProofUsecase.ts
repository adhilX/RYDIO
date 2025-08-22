import { User } from "../../domain/entities/userEntities";
import { IUploadIdProofRepository } from "../../domain/interface/repositoryInterface/IUploadIdProofRepository";
import { IuploadIdProofUsecase } from "../../domain/interface/usecaseInterface/user/userProfile/IuploadIdProofUsecase";

export class UploadIdProofUsecase implements IuploadIdProofUsecase{

    private _uploadIdProofRepository :IUploadIdProofRepository

    constructor(uploadIdProofRepository:IUploadIdProofRepository){
        this._uploadIdProofRepository= uploadIdProofRepository
    }
   async uploadProof(idProofUrl: string,userId:string): Promise<User|null> {
      return await  this._uploadIdProofRepository.uploadImg(idProofUrl,userId)
    }

}