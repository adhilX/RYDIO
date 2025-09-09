import { LoginUserInputDto, LoginUserOutputDto } from "../../../DTOs/userDto/AuthDto";

export interface ILoginUserUsecase {
    loginUser(input:LoginUserInputDto): Promise<LoginUserOutputDto>
}