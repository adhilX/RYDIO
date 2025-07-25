import { IVehicle } from "../../../domain/entities/vehcleEnties";
import { IvehicleRepository } from "../../../domain/interface/repositoryInterface/IvehicleRepository";
import { IsearchVehicleUsecase } from "../../../domain/interface/usecaseInterface/user/vehicle/IsearchVehicleUsecase";

export class SearchVehicleUsecase implements IsearchVehicleUsecase {

  constructor(private vehicleRepsitory: IvehicleRepository) {
    this.vehicleRepsitory = vehicleRepsitory;
  }

  async searchVehicle(
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
  ): Promise<{ vehicles: IVehicle[], total: number } | null> {
    return this.vehicleRepsitory.findVehicle(
      lat,
      lon,
      search,
      currentPage,
      limit,
      filters
    );
  }
}
