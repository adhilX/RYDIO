import { IVehicle } from "../../../../entities/vehcleEnties";

export interface ImyVehicleUsecase {
    getMyvehicle(owner_id:string): Promise<{vehicle:IVehicle[],total:number}|null>
}