export interface IResendOtpUsecase {
    resendOtp(email:string):Promise<void>
}