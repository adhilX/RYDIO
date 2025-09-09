export interface IUserExistence {
    emailExists(email:string):Promise<boolean>
}