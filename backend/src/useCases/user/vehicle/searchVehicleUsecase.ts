import { IbookingRepostory } from "../../../domain/interface/repositoryInterface/IbookingRepository";
import { IvehicleRepository } from "../../../domain/interface/repositoryInterface/IvehicleRepository";
import { IsearchVehicleUsecase } from "../../../domain/interface/usecaseInterface/user/vehicle/IsearchVehicleUsecase";
import { SearchVehicleInputDto, SearchVehicleOutputDto } from "../../../domain/interface/DTOs/userDto/VehicleDto";

export class SearchVehicleUsecase implements IsearchVehicleUsecase {

  constructor(private _vehicleRepsitory: IvehicleRepository,private bookigRepository: IbookingRepostory) {
    this._vehicleRepsitory = _vehicleRepsitory;
  }

  async searchVehicle({ lat, lon, search, pickupDate, returnDate, currentPage, limit, user_id, filters }: SearchVehicleInputDto): Promise<SearchVehicleOutputDto | null> {
// get all vehicles
    const allVehiclesResult = await this._vehicleRepsitory.findVehicle(lat, lon, search, 1, 10000, user_id, filters);
    if (!allVehiclesResult) return null;
    console.log(allVehiclesResult,'allVehiclesResult')
// get all booked vehicle ids
    const bookedVehicleIds = await this.bookigRepository.bookedVehicle(pickupDate, returnDate);
    
    // get all available vehicles
    const allAvailableVehicles = allVehiclesResult.vehicles.filter(v => !bookedVehicleIds.includes(v._id!.toString()));
    const totalAvailable = allAvailableVehicles.length;

    // get paginated result
    const paginatedResult = await this._vehicleRepsitory.findVehicle(lat, lon, search, currentPage, limit, user_id, filters);
    if (!paginatedResult) return null;

    const { vehicles } = paginatedResult;
    // get paginated available vehicles
    const paginatedAvailableVehicles = vehicles.filter(v => !bookedVehicleIds.includes(v._id!.toString()));
    const plainVehicles = JSON.parse(JSON.stringify(paginatedAvailableVehicles));

    const cleanVehicles = (plainVehicles as any[]).map(({ owner_id, location_id, is_available, admin_approve, createdAt, updatedAt, registration_number, description, ...rest }) => ({
      _id: rest._id,
      name: rest.name,
      brand: rest.brand,
      fuel_type: rest.fuel_type,
      seats: rest.seats,
      car_type: rest.car_type,
      automatic: rest.automatic,
      price_per_day: rest.price_per_day,
      image_urls: rest.image_urls
    }));
    return {
      vehicles: cleanVehicles,
      total: totalAvailable 
    };
  } 
}
