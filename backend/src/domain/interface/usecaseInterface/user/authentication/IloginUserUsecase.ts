import { LoginUserInputDto, LoginUserOutputDto } from "../../../DTOs/userDto/LoginUserDto";

export interface IloginUserUsecase {
    loginUser(payload: LoginUserInputDto): Promise<LoginUserOutputDto>
}