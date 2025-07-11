import { User } from "../../../../entities/userEntities";

export interface IadminLoginUseCase {
    handleLogin(email: string, password: string): Promise<Pick<User, '_id' | 'email' | 'name' | 'role'>>
}