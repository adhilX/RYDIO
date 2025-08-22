import { ChangePasswordInputDto, ChangePasswordOutputDto } from "../../DTOs/userDto/UserProfileDto";

export interface IChangePasswordUsecase {
    handleChangePassword(input: ChangePasswordInputDto): Promise<ChangePasswordOutputDto | null>
}