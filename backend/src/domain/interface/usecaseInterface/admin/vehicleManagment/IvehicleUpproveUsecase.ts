export interface IvehicleAproveUsecase {

    approveVehicle(id:string, action :'accepted'|'rejected'):Promise<boolean>
}