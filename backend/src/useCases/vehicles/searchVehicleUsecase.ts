import { IBookingRepository } from "../../domain/interface/repositoryInterface/IbookingRepository";
import { IvehicleRepository } from "../../domain/interface/repositoryInterface/IvehicleRepository";
import { IsearchVehicleUsecase } from "../../domain/interface/usecaseInterface/vehicles/IsearchVehicleUsecase";
import { SearchVehicleInputDto, SearchVehicleOutputDto } from "../../domain/interface/DTOs/userDto/VehicleDto";

export class SearchVehicleUsecase implements IsearchVehicleUsecase {

  constructor(private _vehicleRepsitory: IvehicleRepository,private bookigRepository: IBookingRepository) {
    this._vehicleRepsitory = _vehicleRepsitory;
  }

  async searchVehicle({ lat, lon, search, pickupDate, returnDate, currentPage, limit, user_id, filters }: SearchVehicleInputDto): Promise<SearchVehicleOutputDto | null> {
    try {
      // Get all booked vehicle ids for the date range
      const bookedVehicleIds = await this.bookigRepository.bookedVehicle(pickupDate, returnDate);
      console.log('Booked vehicle IDs:', bookedVehicleIds);
      
      // Get all vehicles matching the search criteria (for total count)
      const allVehiclesResult = await this._vehicleRepsitory.findVehicle(lat, lon, search, 1, 10000, user_id, filters);
      if (!allVehiclesResult) {
        console.log('No vehicles found from repository');
        return { vehicles: [], total: 0 };
      }
            
      // Filter out booked vehicles to get available vehicles
      const allAvailableVehicles = allVehiclesResult.vehicles.filter(v => {
        const vehicleId = v._id?.toString();
        const isBooked = bookedVehicleIds.includes(vehicleId!);
        return !isBooked;
      }); 
      
      const totalAvailable = allAvailableVehicles.length;
      
      // Apply pagination to available vehicles
      const startIndex = (currentPage - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedAvailableVehicles = allAvailableVehicles.slice(startIndex, endIndex);
      
      
      // Clean and format the vehicle data
      const cleanVehicles = paginatedAvailableVehicles.map(vehicle => ({
        _id: vehicle._id,
        name: vehicle.name,
        brand: vehicle.brand,
        fuel_type: vehicle.fuel_type,
        seats: vehicle.seats,
        car_type: vehicle.car_type,
        automatic: vehicle.automatic,
        price_per_day: vehicle.price_per_day,
        image_urls: vehicle.image_urls
      }));
      
      return {
        vehicles: cleanVehicles,
        total: totalAvailable 
      };
    } catch (error) {
      console.error('Error in searchVehicle:', error);
      return null;
    }
  } 
}
