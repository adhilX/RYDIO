export interface IuserExistence {
    emailExists(email:string):Promise<boolean>
}