import { IVehicle } from "../../../../entities/vehcleEnties";

export interface IpendingVehicleUsecase {
    getPendingVehicle( page:number, limit: number): Promise<{ vehicle: IVehicle[]; total: number; } | null>
}