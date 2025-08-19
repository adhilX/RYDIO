import { EditProfileInputDto, EditProfileOutputDto } from "../../../DTOs/userDto/UserProfileDto";

export interface IeditProfileUsecase {
    handleEditProfile(input: EditProfileInputDto): Promise<EditProfileOutputDto | null>
}