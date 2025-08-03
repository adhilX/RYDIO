export interface IvendorAccessUsecase {
    vendorAccess(userId:string,vendorAccess:boolean):Promise<boolean>
}