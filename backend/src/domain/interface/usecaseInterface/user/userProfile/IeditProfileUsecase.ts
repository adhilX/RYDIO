import { User } from "../../../../entities/userEntities";

type userData ={name:string,email:string,phone?:string,profileImg?:string}
export interface IeditProfileUsecase {

    handleEditProfile(userData:userData):Promise<Omit<User, 'password'>>
}