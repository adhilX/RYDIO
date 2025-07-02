import { IVehicle } from "../../../../entities/vehcleEnties";

export interface IapprovedVehicleUsecase {

    getApprovedVehicle( page:number, limit: number): Promise<{ vehicle: IVehicle[]; total: number; } | null>
}