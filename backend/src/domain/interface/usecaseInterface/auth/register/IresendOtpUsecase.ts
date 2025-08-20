export interface IresendOtpUsecase {
    resendOtp(email:string):Promise<void>
}