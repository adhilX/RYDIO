import { IRideEndUsecase } from "../../domain/interface/usecaseInterface/user/booking/IRideEndUsecase";
import { IbookingRepostory } from "../../domain/interface/repositoryInterface/IbookingRepository";
import { IvehicleRepository } from "../../domain/interface/repositoryInterface/IvehicleRepository";
import { BookingStatus, Ibooking } from "../../domain/entities/BookingEntities";
import { setings } from "../../shared/constent";

export class RideEndUsecase implements IRideEndUsecase{
    constructor(
        private _bookingRepository: IbookingRepostory, 
        private _vehicleRepository: IvehicleRepository,
    ) {}
    async execute(bookingId: string, scanner_user_id: string): Promise<boolean> {
        try {
            const booking = await this._bookingRepository.findById(bookingId);
            if (!booking) throw new Error("Booking not found");
            
            if (booking.status !== 'ongoing') {
                throw new Error("Booking is not in ongoing status. Current status: " + booking.status);
            }
            
            const vehicleData = await this._vehicleRepository.getVehicleDetails(booking.vehicle_id.toString());
            if (!vehicleData) {
                throw new Error("Vehicle not found");
            }
            
            if (vehicleData.owner_id.toString() !== scanner_user_id) {
                throw new Error("Access denied. Only the vehicle owner can end this ride.");
            }

            const currentTime = new Date();
            const endDate = new Date(booking.end_date);
            const isLate = currentTime > endDate;
            
            // Calculate penalty if late
            let penaltyAmount = 0;
            if (isLate) {
                const hoursLate = Math.ceil((currentTime.getTime() - endDate.getTime()) / (1000 * 60 * 60));
                const daysLate = Math.ceil(hoursLate / 24);
                penaltyAmount = setings.fine * daysLate;
                
                booking.finance.fine_amount = penaltyAmount;
                booking.finance.is_late_return = true;
            }
            
            booking.ride_end_time = currentTime;

            const updatedBooking = await this._bookingRepository.endRide(booking);
            if (!updatedBooking) {
                throw new Error("Failed to end ride and update booking");
            }
            
            return true;
        } catch (error) {
            console.error('Ride end error:', error);
            throw error;
        }
    }
}