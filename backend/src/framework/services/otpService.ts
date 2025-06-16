import NodeCache from "node-cache";
import { IotpService } from "../../domain/interface/serviceInterface/IotpService";

export class OtpService implements IotpService {
private cache : NodeCache
    constructor(){
this.cache = new NodeCache({ stdTTL: 300 });
    }
    genarateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async storeOtp(email: string, otp: string): Promise<void> {
        this.cache.set(email,otp,300)
    }

    async verifyOtp(email: string, otp: string): Promise<boolean> {
        console.log(email,otp,'emailotp')
        const cachedOtp = this.cache.get(email);
         console.log(cachedOtp,'cachedOtp')
        if (cachedOtp && cachedOtp == otp) {
            this.cache.del(email); 
            return true;
        }
        return false;
    }
}