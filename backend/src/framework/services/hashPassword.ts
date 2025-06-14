import { IhashPassword } from "../../domain/interface/serviceInterface/IhashPassword";
import bcrypt from 'bcrypt'
export class HashPassword implements IhashPassword {
 async   hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password,10)
    }

 async comparePassword(password: string, passwordInDb: string): Promise<boolean> {
        return await bcrypt.compare(password, passwordInDb)
    }
}