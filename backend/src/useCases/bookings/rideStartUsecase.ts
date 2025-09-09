import { IBookingRepository } from "../../domain/interface/repositoryInterface/IbookingRepository";
import { IVehicleRepository } from "../../domain/interface/repositoryInterface/IVehicleRepository";
import { RideStartInputDto, RideStartOutputDto } from "../../domain/interface/DTOs/bookingDto/BookingDto";
import { IRideStartUsecase } from "../../domain/interface/usecaseInterface/bookings/IRideStartUsecase";

export class RideStartUsecase implements IRideStartUsecase {    
  constructor(
    private _bookingRepository: IBookingRepository,
    private _vehicleRepository: IVehicleRepository
  ) {}

  async rideStart(input: RideStartInputDto, scanner_user_id: string): Promise<RideStartOutputDto> {
    const bookingData = await this._bookingRepository.findByBookingId(input.bookingId);
    if (!bookingData) {
      throw new Error("Booking not found");
    }
   
    if (bookingData.status !== "booked") {
      throw new Error("Ride cannot be started. Current status: " + bookingData.status);
    }

    const vehicleData = await this._vehicleRepository.getVehicleDetails(bookingData.vehicle_id.toString());
    if (!vehicleData) {
      throw new Error("Vehicle not found");
    }

    // Extract the actual user ID from the populated owner object or direct ID
    const vehicleOwnerId = typeof vehicleData.owner_id === 'object' && vehicleData.owner_id !== null && '_id' in vehicleData.owner_id
      ? (vehicleData.owner_id as any)._id.toString()
      : vehicleData.owner_id.toString();
    
    if (vehicleOwnerId !== scanner_user_id) {
      throw new Error("Access denied. Only the vehicle owner can start this ride.");
    }
    const updatedBooking = await this._bookingRepository.changeBookingStatus(input.bookingId, "ongoing");
    
    if (!updatedBooking) {
      throw new Error("Failed to update booking status");
    }

    return {
      success: true,
      message: "Ride started successfully"
    };
  }
}
