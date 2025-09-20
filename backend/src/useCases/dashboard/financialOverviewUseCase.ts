import { IBookingRepository } from "../../domain/interface/repositoryInterface/IBookingRepository";
import { IWalletRepository } from "../../domain/interface/repositoryInterface/IWalletRepository";
import { IVehicleRepository } from "../../domain/interface/repositoryInterface/IVehicleRepository";
import { IFinancialOverviewUseCase } from "../../domain/interface/usecaseInterface/dashboard/IFinancialOverviewUseCase";
import { IFinancialOverviewOutPutDto } from "../../domain/interface/DTOs/DashboardDto/DashboardDto";

export class FinancialOverviewUseCase implements IFinancialOverviewUseCase{
    constructor(
        private bookingRepository: IBookingRepository,
        private walletRepository: IWalletRepository,
        private vehicleRepository: IVehicleRepository
    ) {}

    async getFinancialOverview(): Promise<IFinancialOverviewOutPutDto> {
        try {
            // Get commission from completed bookings
            const commission = await this.bookingRepository.getTotalCommission();
            
            // Get penalties from cancelled/violated bookings
            const penalties = await this.bookingRepository.getTotalPenalties();
            
            // Get refunds from cancelled bookings
            const refunds = await this.bookingRepository.getTotalRefunds();
            
            // Get top revenue generating vehicles
            const rawTopRevenueVehicles = await this.vehicleRepository.getTopRevenueVehicles();
            
            // Calculate percentages for top revenue vehicles (business logic)
            const totalRevenue = rawTopRevenueVehicles.reduce((sum, vehicle) => sum + vehicle.revenue, 0);
            const topRevenueVehicles = rawTopRevenueVehicles.map(vehicle => ({
                type: vehicle.type || 'Unknown',
                model: vehicle.model || 'Unknown',
                revenue: vehicle.revenue || 0,
                percentage: totalRevenue > 0 ? Math.round((vehicle.revenue / totalRevenue) * 100) : 0
            }));
            
            // Get wallet balance
            const walletBalance = await this.walletRepository.getAdminWalletBalance();

            return {
                commission,
                penalties,
                refunds,
                topRevenueVehicles,
                walletBalance
            };
        } catch (error) {
            throw new Error(`Failed to get financial overview: ${error}`);
        }
    }
}
