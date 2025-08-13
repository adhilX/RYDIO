import { SendForgotPasswordOtpInputDto, SendForgotPasswordOtpOutputDto } from "../../../../DTOs/userDto/AuthDto";

export interface IsendOptUsecase{
    execute(input: SendForgotPasswordOtpInputDto): Promise<SendForgotPasswordOtpOutputDto>
}