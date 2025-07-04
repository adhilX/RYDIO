import { IVehicle } from "../../../../entities/vehcleEnties";

export interface IvehicleDetailsUsecase {

    getVehicleDetails(id:string):Promise<IVehicle |null>
    
}