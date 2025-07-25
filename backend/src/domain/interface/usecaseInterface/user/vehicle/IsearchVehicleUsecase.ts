import { IVehicle } from "../../../../entities/vehcleEnties";

export interface IsearchVehicleUsecase {
  searchVehicle(
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
}
