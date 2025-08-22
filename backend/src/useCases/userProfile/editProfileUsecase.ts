import { User } from "../../domain/entities/userEntities";
import { IuserRepository } from "../../domain/interface/repositoryInterface/IuserRepository";
import { IeditProfileUsecase } from "../../domain/interface/usecaseInterface/userProfile/IeditProfileUsecase";
import { EditProfileInputDto, EditProfileOutputDto } from "../../domain/interface/DTOs/userDto/UserProfileDto";

export class EditProfileUsecase implements IeditProfileUsecase{
    private _userRepository:IuserRepository
    constructor(userRepository:IuserRepository){
        this._userRepository =userRepository
    }
        
    async handleEditProfile(input: EditProfileInputDto): Promise<EditProfileOutputDto | null> {
        try {
            const { userId, profileData } = input;
            const { name, email, phone, address, city, state, pincode } = profileData;
            
            const updatedUser = await this._userRepository.updateProfile(
                email || "",
                phone || "",
                name || "",
                "" // ImageUrl placeholder
            );
            
            if (!updatedUser) {
                throw new Error("User not found or update failed");
            }
            
            return {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                address: address,
                city: city,
                state: state,
                pincode: pincode,
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
