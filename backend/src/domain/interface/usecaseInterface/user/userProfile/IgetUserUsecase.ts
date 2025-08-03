import { User } from "../../../../entities/userEntities";

export interface IGetUserUsecase {
    getUser(userId: string): Promise<User | null>;
}