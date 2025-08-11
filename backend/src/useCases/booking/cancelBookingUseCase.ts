import { IcancelBookingUseCase } from "../../domain/interface/usecaseInterface/user/booking/IcancelBookingUseCase";
import { IbookingRepostory } from "../../domain/interface/repositoryInterface/IbookingRepository";
import { WalletRepository } from "../../adapters/repository/wallet/walletRepository";
import { AdminWalletRepository } from "../../adapters/repository/wallet/adminWalletRepository";
import { TrasationRepository } from "../../adapters/repository/transation/TrasationRepository";
import { IvehicleRepository } from "../../domain/interface/repositoryInterface/IvehicleRepository";
import { BookingStatus } from "../../domain/entities/BookingEntities";

export class CancelBookingUseCase implements IcancelBookingUseCase  {
    constructor(
        private _bookingRepository: IbookingRepostory,
        private _walletRepository: WalletRepository,
        private _adminWalletRepository: AdminWalletRepository,
        private _trasationRepository: TrasationRepository,
        private _vehicleRepository: IvehicleRepository
    ){}

    async execute(bookingId: string, reason: string): Promise<boolean> {
        const booking = await this._bookingRepository.getBookingById(bookingId);
        if (!booking) {
            throw new Error('Booking not found');
        }

        if (booking.status === BookingStatus.Cancelled) {
            throw new Error('Booking is already cancelled');
        }

        if (booking.status === BookingStatus.Completed) {
            throw new Error('Cannot cancel a completed booking');
        }

        if (booking.status === BookingStatus.ongoing) {
            throw new Error('Cannot cancel an ongoing booking');
        }

        const currentTime = new Date();
        const bookingStartTime = new Date(booking.start_date);
        const timeDifference = bookingStartTime.getTime() - currentTime.getTime();
        const hoursDifference = timeDifference / (1000 * 3600);

        if (hoursDifference < 24) {
            throw new Error('Cannot cancel booking less than 24 hours before start time');
        }

        const vehicle = await this._vehicleRepository.getVehicleDetails(booking.vehicle_id.toString());
        if (!vehicle) {
            throw new Error('Vehicle not found');
        }

        const ownerId = vehicle.owner_id.toString();
        const userId = booking.user_id.toString();
        const totalAmount = booking.total_amount;

        const userRefund = Math.round(totalAmount * 0.7);
        const ownerCompensation = Math.round(totalAmount * 0.3);

        try {
            await this._bookingRepository.cancelBooking(bookingId, reason);

            await this._adminWalletRepository.updateWalletBalance(-totalAmount);

            await this._walletRepository.updateWallet(userId, userRefund);

            await this._trasationRepository.createTrasation(
                'admin',   
                userId,    
                userRefund,
                'refund',
                bookingId,
                'credit'
            );
            await this._walletRepository.updateWallet(ownerId, ownerCompensation);

            await this._trasationRepository.createTrasation(
                'admin',
                ownerId,
                ownerCompensation,
                'refund',
                bookingId,
                'credit'
            );

            return true;
        } catch (error) {
            throw error
        }
    }
}
