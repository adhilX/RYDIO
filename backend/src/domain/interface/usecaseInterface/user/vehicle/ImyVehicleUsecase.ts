import { IVehicle } from "../../../../entities/vehcleEnties";

export interface ImyVehicleUsecase {
    getMyvehicle(owner_id:string,search:string,page:string,limit:string): Promise<{vehicle:IVehicle[],total:number}|null>
}