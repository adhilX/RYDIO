import { IwithdrawUsecase } from "../../domain/interface/usecaseInterface/wallets/IwithdrawUsecase";
import { WithdrawalInputDto } from "../../domain/interface/DTOs/userDto/WalletDto";
import { IbookingRepostory } from "../../domain/interface/repositoryInterface/IbookingRepository";
import { IvehicleRepository } from "../../domain/interface/repositoryInterface/IvehicleRepository";
import { IWalletRepository } from "../../domain/interface/repositoryInterface/IwalletRepository";
import { IAdminWalletRepository } from "../../domain/interface/repositoryInterface/IAdminWalletRepository";
import { ItrasationRepository } from "../../domain/interface/repositoryInterface/ItrasationRepository";
import { TransactionPurpose } from "../../domain/entities/transactionEntities";
import { BookingStatus } from "../../domain/entities/BookingEntities";

export class WithdrawUsecase implements IwithdrawUsecase{
    constructor(
        private bookingRepository: IbookingRepostory,
        private vehicleRepository: IvehicleRepository,
        private walletRepository: IWalletRepository,
        private adminWalletRepository: IAdminWalletRepository,
        private trasationRepository: ItrasationRepository
    ){}
    
    async withdraw(input: WithdrawalInputDto): Promise<boolean> {
        const {bookingId, userId} = input;
        
        // Get booking details
        const booking = await this.bookingRepository.findByBookingId(bookingId);
        if(!booking) throw new Error('Booking not found');
        
        // Check if booking is completed (required for withdrawals)
        if (booking.status !== BookingStatus.Completed) {
            throw new Error('Withdrawals are only allowed for completed bookings');
        }
        
        // Get vehicle details to find owner
        const vehicle = await this.vehicleRepository.findById(booking.vehicle_id.toString());
        if(!vehicle) throw new Error('Vehicle not found');
        
        const isOwner = vehicle.owner_id.toString() === userId;
        const isUser = booking.user_id.toString() === userId;
        
        // Check if already withdrawn
        if (isOwner && booking.finance.owner_withdraw) {
            throw new Error('Owner earnings already withdrawn');
        }
        
        if (isUser && booking.finance.user_withdraw) {
            throw new Error('Security deposit already withdrawn');
        }

     console.log(booking.finance.security_deposit)    
     console.log(booking.finance.fine_amount)    
        let withdrawalAmount = 0;        
        if (isOwner) {
            withdrawalAmount = booking.finance.owner_earnings;
        } else if (isUser) {
            withdrawalAmount = booking.finance.security_deposit - booking.finance.fine_amount;
            
            if (withdrawalAmount < 0) {
                throw new Error('Security deposit insufficient to cover fines');
            }
        }
        
        if (withdrawalAmount <= 0) {
            throw new Error('No amount available for withdrawal');
        }
        
        // Create transaction record
        const transaction = await this.trasationRepository.create({
            from: 'admin',
            to: userId,
            amount: withdrawalAmount,
            purpose: TransactionPurpose.withdraw,
            bookingId: bookingId,
            transactionType: 'credit'
        });
        
        if (!transaction || !transaction._id) {
            throw new Error('Failed to create transaction record');
        }
        
        try {
            // Update admin wallet (subtract the withdrawal amount)
            const adminWallet = await this.adminWalletRepository.getwalletDetails()
            if(!adminWallet){
                throw new Error('Admin wallet not found');
            }
            if(adminWallet.total_balance < withdrawalAmount){
                throw new Error('Insufficient balance in admin wallet');
            }
            await this.adminWalletRepository.updateWalletBalance(-withdrawalAmount);
            await this.adminWalletRepository.addTransaction(transaction._id.toString());
            
            // Update user's wallet balance (add the withdrawal amount)
            const updatedWallet = await this.walletRepository.updateWallet(userId, withdrawalAmount);
            if (!updatedWallet) {
                throw new Error('Failed to update wallet balance');
            }
            
            // Add transaction to user's wallet
            await this.walletRepository.addTransaction(userId, transaction._id.toString());
            
            // Mark as withdrawn in booking (only after successful wallet updates)
            if (isOwner) {
                await this.bookingRepository.updateBookingFinance(bookingId, {
                    'finance.owner_withdraw': true
                });
            } else if (isUser) {
                await this.bookingRepository.updateBookingFinance(bookingId, {
                    'finance.user_withdraw': true
                });
            }
            return true;
   
        } catch (error) {
            console.error('Withdrawal failed:', error);
            throw error;
        }
    }
}
