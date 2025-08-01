import { User } from "../../../domain/entities/userEntities";
import { IuserRepository } from "../../../domain/interface/repositoryInterface/IuserRepository";
import { IGetUserUsecase } from "../../../domain/interface/usecaseInterface/user/userProfile/IgetUserUsecase";

export class GetUserUsecase implements IGetUserUsecase {
    constructor(private userRepository: IuserRepository) {}

    async getUser(userId: string): Promise<User | null> {
        if (!userId) {
            throw new Error("User ID is required");
        }
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
}