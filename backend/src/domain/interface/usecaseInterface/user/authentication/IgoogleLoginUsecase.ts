import { GoogleLoginInputDto, LoginUserOutputDto } from "../../../DTOs/userDto/AuthDto";

export interface IgoogleloginUsecase {
    googleLogin(input: GoogleLoginInputDto): Promise<LoginUserOutputDto >
}