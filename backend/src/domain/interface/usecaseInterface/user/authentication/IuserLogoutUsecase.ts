
export interface IuserLogoutUsecase {
    clientLogout(token:string):Promise<boolean>
}