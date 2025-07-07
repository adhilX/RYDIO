import { IVehicle } from "../../../../entities/vehcleEnties";

export interface IsearchVehicleUsecase {
    searchVehicle(lat:number,lon:number,search:string,currentPage:number,limit:number): Promise<{ vehicles: IVehicle[], total: number } | null>
}