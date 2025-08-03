import { User } from "../../../entities/userEntities";

export interface IsearchUserUsecase {

    searchUser(search: string, page: number, limit: number): Promise<{ users: Pick<User, 'name' | 'email' | 'phone' | '_id'>[]; total: number; } | null>
}