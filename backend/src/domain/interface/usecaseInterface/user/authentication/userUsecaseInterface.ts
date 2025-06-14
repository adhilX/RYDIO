import { ClientEnties } from "../../../../entities/clientEnties";

export interface IcreateUserUsecase{
    createUser(user:ClientEnties):Promise<ClientEnties | null>
}