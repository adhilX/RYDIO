import { ChangePasswordInputDto, ChangePasswordOutputDto } from "../../../DTOs/userDto/AuthDto";

export interface IchangePasswordUsecase {
 ChangePassword(input: ChangePasswordInputDto): Promise<ChangePasswordOutputDto>}
