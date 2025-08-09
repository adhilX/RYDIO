export interface IvehicleAproveUsecase {

    approveVehicle(id:string, action :'accepted'|'rejected',reason?:string):Promise<boolean>
}