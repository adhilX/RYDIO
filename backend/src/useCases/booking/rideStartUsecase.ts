import { IbookingRepostory } from "../../domain/interface/repositoryInterface/IbookingRepository";
import { IrideStartUsecase } from "../../domain/interface/usecaseInterface/user/booking/IrideStartUsecase";
import { IvehicleRepository } from "../../domain/interface/repositoryInterface/IvehicleRepository";

export class RideStartUsecase implements IrideStartUsecase {    
  constructor(
    private _bookingRepository: IbookingRepostory,
    private _vehicleRepository: IvehicleRepository
  ) {}

  async rideStart(booking_id: string, scanner_user_id: string): Promise<boolean> {
    const bookingData = await this._bookingRepository.findById(booking_id);
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

    if (vehicleData.owner_id.toString() !== scanner_user_id) {
      throw new Error("Access denied. Only the vehicle owner can start this ride.");
    }
    const updatedBooking = await this._bookingRepository.changeBookingStatus(booking_id, "ongoing");
    
    if (!updatedBooking) {
      throw new Error("Failed to update booking status");
    }

    return true;
  }
}
