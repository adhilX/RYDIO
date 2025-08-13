import { LogoutUserInputDto, LogoutUserOutputDto } from "../../../DTOs/userDto/AuthDto";

export interface IuserLogoutUsecase {
    clientLogout(input: LogoutUserInputDto): Promise<LogoutUserOutputDto>
}