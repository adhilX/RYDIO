import { User } from "../../../../entities/userEntities";

export interface IuploadIdProofUsecase{
    uploadProof(idProofUrl:string,userId:string):Promise<User|null>
}