export interface IVerifyOtpUsecase {
    verifyOtp(email: string, enteredOtp: string): Promise<boolean>
}