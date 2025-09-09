export interface IHashPassword {
        hashPassword(password:string):Promise<string>
        comparePassword(password:string,passwordInDb:string):Promise<boolean>
}