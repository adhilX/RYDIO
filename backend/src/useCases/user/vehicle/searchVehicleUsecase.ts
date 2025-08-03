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
// get all vehicles
    const allVehiclesResult = await this.vehicleRepsitory.findVehicle(lat, lon, search, 1, 10000, user_id, filters);
    if (!allVehiclesResult) return null;
    console.log(allVehiclesResult,'allVehiclesResult')
// get all booked vehicle ids
    const bookedVehicleIds = await this.bookigRepository.bookedVehicle(pickupDate, returnDate);
    
    // get all available vehicles
    const allAvailableVehicles = allVehiclesResult.vehicles.filter(v => !bookedVehicleIds.includes(v._id!.toString()));
    const totalAvailable = allAvailableVehicles.length;

    // get paginated result
    const paginatedResult = await this.vehicleRepsitory.findVehicle(lat, lon, search, currentPage, limit, user_id, filters);
    if (!paginatedResult) return null;

    const { vehicles } = paginatedResult;
    // get paginated available vehicles
    const paginatedAvailableVehicles = vehicles.filter(v => !bookedVehicleIds.includes(v._id!.toString()));
    const plainVehicles = JSON.parse(JSON.stringify(paginatedAvailableVehicles));

    const cleanVehicles = (plainVehicles as any[]).map(({ owner_id, location_id, is_available, admin_approve, createdAt, updatedAt, registration_number, description, ...rest }) => rest);
    return {
      vehicles: cleanVehicles,
      total: totalAvailable 
    };
  } 
}
