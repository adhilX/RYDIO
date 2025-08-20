import { LoginUserInputDto, LoginUserOutputDto } from "../../../DTOs/userDto/AuthDto";

export interface IloginUserUsecase {
    loginUser(input:LoginUserInputDto): Promise<LoginUserOutputDto>
}