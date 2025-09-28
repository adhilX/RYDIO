import { IUserRepository } from "../../domain/interface/repositoryInterface/IUserRepository";
import { IEditProfileUsecase } from "../../domain/interface/usecaseInterface/userProfile/IEditProfileUsecase";
import { EditProfileInputDto, EditProfileOutputDto } from "../../domain/interface/DTOs/userDto/UserProfileDto";

export class EditProfileUsecase implements IEditProfileUsecase{
    private _userRepository:IUserRepository
    constructor(userRepository:IUserRepository){
        this._userRepository =userRepository
    }
        
    async handleEditProfile(input: EditProfileInputDto): Promise<EditProfileOutputDto | null> {
        try {
    
            const { name, email, phone, ImageUrl } = input;
            
            const updatedUser = await this._userRepository.updateProfile(
                email || "",
                phone || "",
                name || "",
                ImageUrl || "" 
            );
            
            if (!updatedUser) {
                throw new Error("User not found or update failed");
            }
            
            return {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                profile_image: updatedUser.profile_image,
                isVerified: updatedUser.is_verified_user || false,
                isBlocked: updatedUser.is_blocked || false,
                role: updatedUser.role,
                createdAt: updatedUser.createdAt,
                updatedAt:updatedUser.updatedAt
            };
        } catch (error) {
            console.error('Error in EditProfileUsecase:', error);
            throw error;
        }
    }
}
