import { IRideEndUsecase } from "../../domain/interface/usecaseInterface/user/booking/IRideEndUsecase";
import { IbookingRepostory } from "../../domain/interface/repositoryInterface/IbookingRepository";
import { IvehicleRepository } from "../../domain/interface/repositoryInterface/IvehicleRepository";

export class RideEndUsecase implements IRideEndUsecase{
    constructor(
        private _bookingRepository: IbookingRepostory, 
        private _vehicleRepository: IvehicleRepository
    ) {}
    async execute(bookingId: string, scanner_user_id: string): Promise<boolean> {
        // Get booking details
        const booking = await this._bookingRepository.getBookingById(bookingId);
        if (!booking) throw new Error("Booking not found");
        
        // Check booking status
        if (booking.status !== 'ongoing') {
            throw new Error("Booking is not in ongoing status. Current status: " + booking.status);
        }
        
        // Get vehicle details to verify owner
        const vehicleData = await this._vehicleRepository.getVehicleDetails(booking.vehicle_id.toString());
        if (!vehicleData) {
            throw new Error("Vehicle not found");
        }
        
        // Verify scanner is the vehicle owner
        if (vehicleData.owner_id.toString() !== scanner_user_id) {
            throw new Error("Access denied. Only the vehicle owner can end this ride.");
        }
        
        // Update booking status to completed
        const updatedBooking = await this._bookingRepository.changeBookingStatus(bookingId, "completed");
        
        if (!updatedBooking) {
            throw new Error("Failed to update booking status");
        }
        
        return true;
    }
}