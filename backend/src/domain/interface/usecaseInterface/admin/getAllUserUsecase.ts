import { User } from "../../../entities/userEntities";

export interface IgetAllUserUsecase{

    getAllUser():Promise<User[]|null>
}