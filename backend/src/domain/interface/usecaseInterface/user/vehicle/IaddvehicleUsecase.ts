import { IVehicle } from "../../../../entities/vehcleEnties";

export interface IaddvehicleUsecase {

    addVehicle(vehicle:IVehicle):Promise<IVehicle>
}