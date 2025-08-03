import { IVehicle } from "../../../../entities/vehcleEnties";

export interface IapprovedVehicleUsecase {

    getApprovedVehicle(search:string, page:number, limit: number): Promise<{ vehicle: IVehicle[]; total: number; } | null>
}