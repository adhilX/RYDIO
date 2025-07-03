import { IVehicle } from "../../../../entities/vehcleEnties";

export interface IsearchVehicleUsecase {
    searchVehicle(lat:number,lon:number):Promise<IVehicle[]|null>
}