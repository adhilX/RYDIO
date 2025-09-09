import { EditProfileInputDto, EditProfileOutputDto } from "../../DTOs/userDto/UserProfileDto";

export interface IEditProfileUsecase {
    handleEditProfile(input: EditProfileInputDto): Promise<EditProfileOutputDto | null>
}