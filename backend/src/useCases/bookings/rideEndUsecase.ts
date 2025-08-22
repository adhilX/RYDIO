import { IbookingRepostory } from "../../domain/interface/repositoryInterface/IbookingRepository";
import { IvehicleRepository } from "../../domain/interface/repositoryInterface/IvehicleRepository";
import { setings } from "../../shared/constent";
import { RideEndInputDto, RideEndOutputDto } from "../../domain/interface/DTOs/bookingDto/BookingDto";
import { IRideEndUsecase } from "../../domain/interface/usecaseInterface/bookings/IRideEndUsecase";

export class RideEndUsecase implements IRideEndUsecase{
    constructor(
        private _bookingRepository: IbookingRepostory, 
        private _vehicleRepository: IvehicleRepository,
    ) {}
    async execute(input: RideEndInputDto, scanner_user_id: string): Promise<RideEndOutputDto> {
        try {
            const booking = await this._bookingRepository.findByBookingId(input.bookingId);
            if (!booking) throw new Error("Booking not found");
            
            if (booking.status !== 'ongoing') {
                throw new Error("Booking is not in ongoing status. Current status: " + booking.status);
            }
            
            const vehicleData = await this._vehicleRepository.getVehicleDetails(booking.vehicle_id.toString());
            if (!vehicleData) {
                throw new Error("Vehicle not found");
            }
            
            const vehicleOwnerId = typeof vehicleData.owner_id === 'object' && vehicleData.owner_id !== null && '_id' in vehicleData.owner_id
                ? (vehicleData.owner_id as any)._id.toString()
                : vehicleData.owner_id.toString();
            
            if (vehicleOwnerId !== scanner_user_id) {
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
            
            return {
                success: true,
                message: "Ride ended successfully"
            };
        } catch (error) {
            console.error('Ride end error:', error);
            throw error;
        }
    }
}