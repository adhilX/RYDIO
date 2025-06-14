export interface IotpService{
    genarateOtp():string,
    storeOtp(email:string,otp:string):Promise<void>
    verifyOtp(email:string,otp:string):Promise<boolean>
}