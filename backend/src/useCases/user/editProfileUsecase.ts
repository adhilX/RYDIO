import { User } from "../../domain/entities/userEntities";
import { IuserRepository } from "../../domain/interface/repositoryInterface/IuserRepository";
import { IeditProfileUsecase } from "../../domain/interface/usecaseInterface/user/userProfile/IeditProfileUsecase";

export class EditProfileUsecase implements IeditProfileUsecase{
    private userRepository:IuserRepository
    constructor(userRepository:IuserRepository){
        this.userRepository =userRepository
    }
        
    async handleEditProfile(userData: { name: string; email: string; phone?: string; ImageUrl?: string; }): Promise<User> {
        const { name, email, phone, ImageUrl } = userData;
        console.log(ImageUrl)
        const updatedUser = await this.userRepository.updateProfile(
            email,
            phone ?? "",
            name,
            ImageUrl ?? ""
        );
        if (!updatedUser) {
            throw new Error("User not found or update failed");
        }
        return updatedUser;
    }
}
