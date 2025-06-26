import { Vehicle } from "../../entities/vehcleEnties";

export interface IvehicleRepository{
    addVehicle(Vehicle:Vehicle):Promise<Vehicle>
    approveVehicle(id:string,action:string):Promise<boolean>
    rejectVehicle(id:string,action:string):Promise<boolean>
}