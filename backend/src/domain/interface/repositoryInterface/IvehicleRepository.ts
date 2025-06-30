import { IVehicle } from "../../entities/vehcleEnties"

export interface IvehicleRepository{
    addVehicle(Vehicle:IVehicle):Promise<IVehicle>
    approveVehicle(id:string,action:string):Promise<boolean>
    rejectVehicle(id:string,action:string):Promise<boolean>
    myVehicle(owner_id:string,search:string,page:string,limit:string): Promise<{vehicle:IVehicle[],total:number}|null>
}