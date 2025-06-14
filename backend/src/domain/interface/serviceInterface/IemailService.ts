

export interface IemailServise{
    sendOtp(email: string, otp: string): Promise<void>;
}