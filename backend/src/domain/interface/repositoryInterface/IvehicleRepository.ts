import { IVehicle } from "../../entities/vehcleEnties"

export interface IvehicleRepository {
    addVehicle(Vehicle: IVehicle): Promise<IVehicle>
    approveVehicle(id: string, action: string): Promise<boolean>
    rejectVehicle(id: string, action: string): Promise<boolean>
    myVehicle(owner_id: string, search: string, page: string, limit: string): Promise<{ vehicle: IVehicle[], total: number } | null>
    findVehicle(
        lat: number,
        lon: number,
        search: string,
        currentPage: number,
        limit: number,
        filters: {
            fuel_types?: string[],
            seats?: number[],
            car_types?: string[],
            transmission?: string[]
        }
    ): Promise<{ vehicles: IVehicle[], total: number } | null>;
    getVehicleDetails(Id: string): Promise<IVehicle | null>
   isExistingVehicle(regiseration_number: string): Promise<boolean>
}