import { User } from "../../../../entities/userEntities";

export interface ICreateUserUsecase {
  createUser(user: User): Promise<Omit<User, 'password'> | null>
}