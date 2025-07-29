import { IVehicle } from "../../../../entities/vehcleEnties";

export interface IsearchVehicleUsecase {
  searchVehicle(
    lat: number,
    lon: number,
    search: string,
    pickupDate: string,
    returnDate: string,
    currentPage: number,
    limit: number,
    user_id:string,
    filters: {
      fuel_types?: string[],
      seats?: number[],
      car_types?: string[],
      transmission?: string[]
      distance_range?: number
    }
  ): Promise<{ vehicles: IVehicle[], total: number } | null>;
}
