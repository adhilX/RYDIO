import { IVehicleRepository } from "../../domain/interface/repositoryInterface/IVehicleRepository";
import { IBookingRepository } from "../../domain/interface/repositoryInterface/IBookingRepository";

export class VehicleManagementUseCase {
    constructor(
        private vehicleRepository: IVehicleRepository,
        private bookingRepository: IBookingRepository
    ) {}

    async getVehicleManagementStats(): Promise<{
        pendingVehicles: number;
        approvedVehicles: number;
        rejectedVehicles: number;
        averageRevenuePerBooking: number;
        chartData: Array<{ height: number; color: string }>;
    }> {
        try {
            const pendingVehicles = await this.vehicleRepository.getPendingVehiclesCount();
            const approvedVehicles = await this.vehicleRepository.getApprovedVehiclesCount();
            const rejectedVehicles = await this.vehicleRepository.getRejectedVehiclesCount();
            
            const averageRevenuePerBooking = await this.bookingRepository.getAverageRevenuePerBooking();
            
            // Get raw vehicle activity data from repository
            const rawChartData = await this.vehicleRepository.getVehicleActivityChartData();
            
            // Calculate chart data with percentages and colors (business logic)
            const totalVehicles = rawChartData.total;
            const chartData = [
                { 
                    height: totalVehicles > 0 ? Math.round((rawChartData.active / totalVehicles) * 100) : 0, 
                    color: '#10B981' 
                }, // Green for active vehicles
                { 
                    height: totalVehicles > 0 ? Math.round((rawChartData.pending / totalVehicles) * 100) : 0, 
                    color: '#F59E0B' 
                }, // Yellow for pending vehicles
                { 
                    height: totalVehicles > 0 ? Math.round((rawChartData.rejected / totalVehicles) * 100) : 0, 
                    color: '#EF4444' 
                }  // Red for rejected vehicles
            ];

            return {
                pendingVehicles,
                approvedVehicles,
                rejectedVehicles,
                averageRevenuePerBooking,
                chartData
            };
        } catch (error) {
            throw new Error(`Failed to get vehicle management stats: ${error}`);
        }
    }
}
