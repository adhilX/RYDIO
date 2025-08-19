import { IbookingRepostory } from "../../domain/interface/repositoryInterface/IbookingRepository";
import { IGetBookedVehicleUsecase } from "../../domain/interface/usecaseInterface/user/booking/IGetBookedVehicleUsecase";
import { GetBookedVehicleInputDto, GetBookedVehicleOutputDto } from "../../domain/interface/DTOs/bookingDto/BookingDto";

export class GetBookedVehicleUsecase implements IGetBookedVehicleUsecase {
  constructor(private _bookingRepository: IbookingRepostory) {
    this._bookingRepository = _bookingRepository;
  }

  async execute(input: GetBookedVehicleInputDto): Promise<GetBookedVehicleOutputDto | null> {
    try {
      // Get all bookings for the user with active status
      const userBookings = await this._bookingRepository.findByUserId(input.vehicleId, 1000, 1, "", "booked");
      
      if (!userBookings || userBookings.bookings.length === 0) {
        return null;
      }
      
      // Extract unique vehicle IDs from bookings
      const vehicleIds = userBookings.bookings.map(booking => booking.vehicle_id.toString());
      const uniqueVehicleIds = [...new Set(vehicleIds)];
      
      return {
        bookedVehicles: uniqueVehicleIds
      };
    } catch (error) {
      console.error('Error in GetBookedVehicleUsecase:', error);
      throw error;
    }
  }
}