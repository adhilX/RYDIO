import { SendForgotPasswordOtpInputDto, SendForgotPasswordOtpOutputDto } from "../../../DTOs/userDto/AuthDto";

export interface IForgotPasswordUsecase {
    execute(input: SendForgotPasswordOtpInputDto): Promise<SendForgotPasswordOtpOutputDto>;
}
