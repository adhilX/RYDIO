import { GoogleLoginInputDto, GoogleLoginOutputDto } from "../../../DTOs/userDto/AuthDto";

export interface IgoogleloginUsecase {
    googleLogin(input: GoogleLoginInputDto): Promise<GoogleLoginOutputDto>
}