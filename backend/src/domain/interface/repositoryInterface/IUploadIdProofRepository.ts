import { User } from "../../entities/userEntities";

export interface IUploadIdProofRepository{
    uploadImg(Image:string,user_id:string):Promise<User| null>
}