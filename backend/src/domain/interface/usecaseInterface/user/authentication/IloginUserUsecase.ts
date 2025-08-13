import { LoginUserInputDto, LoginUserOutputDto } from "../../../DTOs/userDto/AuthDto";

export interface IloginUserUsecase {
    loginUser(payload: LoginUserInputDto): Promise<LoginUserOutputDto>
}