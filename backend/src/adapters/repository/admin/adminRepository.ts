import { User } from "../../../domain/entities/userEntities";
import { IadminRepository } from "../../../domain/interface/repositoryInterface/IadminRepository";
import { userModel } from "../../../framework/database/models/userModel";

export class AdminRepository implements IadminRepository {
    async findByEmail(email: string): Promise<User | null> {
        return userModel.findOne({email})
    }
    
    async getAllUsers(): Promise<User[] | null> {
        return userModel.find()
    }
}