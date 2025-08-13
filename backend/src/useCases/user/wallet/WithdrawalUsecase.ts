import { IAdminWalletRepository } from "../../../domain/interface/repositoryInterface/IAdminWalletRepository";
import { IbookingRepostory } from "../../../domain/interface/repositoryInterface/IbookingRepository";
import { IWalletRepository } from "../../../domain/interface/repositoryInterface/IwalletRepository";
import { ItrasationRepository } from "../../../domain/interface/repositoryInterface/ItrasationRepository";
import { IvehicleRepository } from "../../../domain/interface/repositoryInterface/IvehicleRepository";
import {IWithdrawalUsecase } from "../../../domain/interface/usecaseInterface/user/wallet/IuserWithdrawalUsecase";
import { BookingStatus } from "../../../domain/entities/BookingEntities";

export class WithdrawalUsecase implements IWithdrawalUsecase{
    constructor(
        private _bookingRepository: IbookingRepostory,
        private _adminWalletRepository: IAdminWalletRepository,
        private _walletRepository: IWalletRepository,
        private _transactionRepository: ItrasationRepository,
        private _vehicleRepository: IvehicleRepository
    ) {}
     async userWithdrawal(bookingId: string, userId: string): Promise<boolean> {
        try {
            const booking = await this._bookingRepository.getBookingById(bookingId);
            if (!booking) {
                throw new Error("Booking not found");
            }
            if (booking.status !== BookingStatus.Completed) {
                throw new Error("Booking must be completed before withdrawal");
            }

            const vehicleData = await this._vehicleRepository.getVehicleDetails(booking.vehicle_id.toString());
            if (!vehicleData) {
                throw new Error("Vehicle not found");
            }

            const isBookingUser = booking.user_id.toString() === userId;
            const isVehicleOwner = vehicleData.owner_id.toString() === userId;

            if (!isBookingUser && !isVehicleOwner) {
                throw new Error("Access denied. You are not authorized to withdraw from this booking");
            }

            let withdrawalAmount = 0;
            let withdrawalType = '';
            let updateField = '';

            if (isBookingUser) {
                if (booking.finance.user_withdraw) {
                    throw new Error("User has already withdrawn from this booking");
                }
                
                withdrawalAmount = booking.finance.security_deposit - booking.finance.fine_amount;
                withdrawalType = 'User security deposit refund';
                updateField = 'finance.user_withdraw';
                
                if (withdrawalAmount <= 0) {
                    throw new Error("No amount available for user withdrawal (fines may exceed security deposit)");
                }
            } else if (isVehicleOwner) {

                if (booking.finance.owner_withdraw) {
                    throw new Error("Owner has already withdrawn from this booking");
                }
                withdrawalAmount = booking.finance.owner_earnings;
                withdrawalType = 'Owner earnings';
                updateField = 'finance.owner_withdraw';

                if (withdrawalAmount <= 0) {
                    throw new Error("No earnings available for owner withdrawal");
                }
            }

            const userWallet = await this._walletRepository.getWalletByUserId(userId);
            if (!userWallet) {
                throw new Error("User wallet not found");
            }

            // Create withdrawal transaction
            const withdrawalTransaction = await this._transactionRepository.createTrasation(
                'admin',
                userId,
                withdrawalAmount,
                isBookingUser ? 'refund' : 'commission',
                bookingId,
                'credit'
            );

            // Update user wallet
            await this._walletRepository.updateWallet(userId, withdrawalAmount);
            if (withdrawalTransaction._id) {
                await this._walletRepository.addTransaction(userId, withdrawalTransaction._id.toString());
            }

            // Reduce amount from admin wallet
            await this._adminWalletRepository.updateWalletBalance(-withdrawalAmount);
            if (withdrawalTransaction._id) {
                await this._adminWalletRepository.addTransaction(withdrawalTransaction._id.toString());
            }

            // Update booking withdrawal status
            const updateData: any = {};
            if (isBookingUser) {
                updateData['finance.user_withdraw'] = true;
            } else {
                updateData['finance.owner_withdraw'] = true;
            }

            await this._bookingRepository.updateBookingFinance(bookingId, updateData);

            console.log(`${withdrawalType} successful: ${withdrawalAmount} credited to user ${userId}`);
            return true;
            
        } catch (error) {
            console.error('Withdrawal error:', error);
            throw error;
        }
    }
}