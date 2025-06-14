export interface IhashPassword {
        hashPassword(password:string):Promise<string>
        comparePassword(password:string,passwordInDb:string):Promise<boolean>
}