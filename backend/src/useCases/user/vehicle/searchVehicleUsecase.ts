import { IVehicle } from "../../../domain/entities/vehcleEnties";
import { IbookingRepostory } from "../../../domain/interface/repositoryInterface/IbookingRepository";
import { IvehicleRepository } from "../../../domain/interface/repositoryInterface/IvehicleRepository";
import { IsearchVehicleUsecase } from "../../../domain/interface/usecaseInterface/user/vehicle/IsearchVehicleUsecase";

export class SearchVehicleUsecase implements IsearchVehicleUsecase {

  constructor(private vehicleRepsitory: IvehicleRepository,private bookigRepository: IbookingRepostory) {
    this.vehicleRepsitory = vehicleRepsitory;
  }

  async searchVehicle(lat: number,lon: number, search: string,pickupDate: string,returnDate: string, currentPage: number,limit: number,user_id:string,filters: {
    fuel_types?: string[],
      seats?: number[],
      car_types?: string[],
      transmission?: string[],
      distance_range?: number
    }
  ): Promise<{ vehicles: IVehicle[], total: number } | null> {

const result = await this.vehicleRepsitory.findVehicle(lat, lon, search, currentPage, limit, user_id, filters);
if (!result) return null;

const { vehicles } = result;
const bookedVehicleIds = await this.bookigRepository.bookedVehicle(pickupDate, returnDate);

const availableVehicles = vehicles.filter(v => !bookedVehicleIds.includes(v._id!.toString()));
const  plainVehicles = JSON.parse(JSON.stringify(availableVehicles))

const cleanVehicles = (plainVehicles as any[]).map(({ owner_id, location_id, is_available, admin_approve, createdAt, updatedAt,registration_number, description, ...rest }) => rest);

return {
  vehicles: cleanVehicles,
  total: availableVehicles.length
};
}
}
