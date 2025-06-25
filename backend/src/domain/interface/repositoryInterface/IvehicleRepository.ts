import { IVehicle } from "../../entities/vehcleEnties";

export interface IvehicleRepository{
    addVehicle(Vehicle:IVehicle):Promise<IVehicle>
}