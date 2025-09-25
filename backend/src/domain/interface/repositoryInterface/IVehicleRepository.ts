import { IVehicle } from "../../entities/vehcleEnties"
import { IBaseRepository } from "./IbaseRepo"

export interface IVehicleRepository extends IBaseRepository<IVehicle> {
    approveVehicle(id: string, action: string): Promise<boolean>
    rejectVehicle(id: string, action: string, reason: string): Promise<boolean>
    myVehicle(owner_id: string, search: string, page: string, limit: string): Promise<{ vehicle: IVehicle[], total: number } | null>
    findVehicle(
        lat: number,
        lon: number,
        search: string,
        currentPage: number,
        limit: number,
        user_id: string,
        filters: {
            fuel_types?: string[],
            seats?: number[],
            car_types?: string[],
            transmission?: string[]
            distance_range?: number
        }
    ): Promise<{ vehicles: IVehicle[], total: number } | null>;
    getVehicleDetails(Id: string): Promise<IVehicle | null>
   isExistingVehicle(regiseration_number: string): Promise<boolean>
   deleteVehicle(vehicleId:string):Promise<boolean>
   changeVehicleStatus(vehicleId:string,action?:boolean):Promise<boolean>
   getVehicle(vehicleId:string):Promise<IVehicle | null>
   reapplyVehicle(vehicleId: string): Promise<boolean>
   
   // Dashboard Analytics Methods
   getActiveVehiclesCount(): Promise<number>
   getLastMonthActiveVehiclesCount(): Promise<number>
   getVehicleActivityChartData(): Promise<{ total: number; active: number; pending: number; rejected: number }>
   getPendingVehiclesCount(): Promise<number>
   getApprovedVehiclesCount(): Promise<number>
   getRejectedVehiclesCount(): Promise<number>
   getTopRevenueVehicles(): Promise<Array<{
       type: string;
       model: string;
       revenue: number;
   }>>
   
}