import { ChangePasswordInputDto, ChangePasswordOutputDto } from "../../../DTOs/userDto/AuthDto";


export interface IChangePasswordUsecase {
 ChangePassword(input:ChangePasswordInputDto): Promise<ChangePasswordOutputDto>}
