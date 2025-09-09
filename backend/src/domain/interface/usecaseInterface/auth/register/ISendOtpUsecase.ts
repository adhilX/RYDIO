import { SendForgotPasswordOtpInputDto, SendForgotPasswordOtpOutputDto } from "../../../DTOs/userDto/AuthDto";

export interface ISendOtpUsecase {
    execute(input: SendForgotPasswordOtpInputDto): Promise<SendForgotPasswordOtpOutputDto>
}