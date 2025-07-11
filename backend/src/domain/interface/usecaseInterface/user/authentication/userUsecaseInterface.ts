import { User } from "../../../../entities/userEntities";

export interface IcreateUserUsecase{
createUser(user: User): Promise<Omit<User, 'password'> | null>}