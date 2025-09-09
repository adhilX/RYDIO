import { LogoutUserInputDto, LogoutUserOutputDto } from "../../../DTOs/userDto/AuthDto";

export interface IUserLogoutUsecase {
    clientLogout(input:LogoutUserInputDto):Promise<LogoutUserOutputDto>
}