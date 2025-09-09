import { GoogleLoginInputDto, LoginUserOutputDto } from "../../../DTOs/userDto/AuthDto";

export interface IGoogleLoginUsecase {
    googleLogin(input: GoogleLoginInputDto): Promise<LoginUserOutputDto>
}