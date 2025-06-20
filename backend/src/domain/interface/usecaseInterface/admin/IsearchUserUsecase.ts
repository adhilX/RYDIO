import { User } from "../../../entities/userEntities";

export interface IsearchUserUsecase{

    searchUser(search:string,page:number,limit:number):Promise<{users:User[],total: number }|null>
}