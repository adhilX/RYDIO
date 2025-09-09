export interface IOtpService{
    genarateOtp():string,
    storeOtp(email:string,otp:string):Promise<void>
    verifyOtp(email:string,otp:string):Promise<boolean>
}