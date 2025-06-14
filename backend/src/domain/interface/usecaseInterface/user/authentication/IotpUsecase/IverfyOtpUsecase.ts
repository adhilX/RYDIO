export interface IverfyOtpUsecase {
    verifyOtp(email: string, enteredOtp: string): Promise<boolean>
}